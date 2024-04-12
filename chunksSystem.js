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

        //Init noise function
        this.noise = createNoise2D();

        this.initChunk();
    }

    initChunk()
    {
        var key = this.chunkKeyFromPos(this.camera.position);

        //Generate central chunk and bounding
        for(let i = key[0]-1; i<=key[0]+1; ++i)
            for(let j = key[1]-1; j<=key[1]+1; ++j)
            {
                const index = `${i}_${j}`;
                if(this.chunks[index])
                    continue;

                const chunk = new Chunk(this.chunkSize, this.noise, new THREE.Vector3(i * this.chunkSize + this.chunkSize/2, 0, j * this.chunkSize + this.chunkSize/2), this.params);
                this.chunks[index] = chunk;
                this.scene.add(chunk);
                this.currentChunk = index;
            }
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

        if(this.chunks[key])
            return true;

        return false;
    }
}