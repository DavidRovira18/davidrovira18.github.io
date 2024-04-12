import { createNoise2D } from './simplex-noise.js';  
import Chunk from './chunk.js';
import * as THREE from 'three';

export default class ChunkSystem{
    constructor(chunkSize, params, scene, camera)
    {
        this.camera = camera;
        this.scene = scene; 

        this.chunkSize = chunkSize;
        this.params = params;

        this.chunks = {};
        this.currentChunk = undefined;
        this.visitedChunks = [];

        //Init noise function
        this.noise = createNoise2D();

        this.initChunk();
    }

    initChunk()
    {
        var key = this.chunkKeyFromPos(this.camera.position);
        const chunk = new Chunk(this.chunkSize, this.noise, new THREE.Vector3(key[0] * this.chunkSize + this.chunkSize/2, 0, key[1] * this.chunkSize + this.chunkSize/2), this.params);
        key = key.join('_')
        this.chunks[key] = chunk;
        this.scene.add(chunk);
        this.currentChunk = key;

        //Only add chunk to visited ones if not visited already
        if (!this.visitedChunks.includes(key))
            this.visitedChunks.push(key);
        
    }

    chunkKeyFromPos(position)
    {
        const [x,y,z] = position;
        const ix = Math.floor(x/this.chunkSize);
        const iz = Math.floor(z/this.chunkSize);

        return [ix, iz];
    }

    updateChunks()
    {
        if (this.cameraInVisitedChunk())
            return;

        //Create new chunk
        this.initChunk();
    }

    cameraInVisitedChunk() //Check if camera in current chunk
    {
        var key = this.chunkKeyFromPos(this.camera.position);
        key = key.join('_');

        if(key===this.currentChunk)
            return true;

        if(this.visitedChunks.includes(key))
            return true;

        return false;
    }
}