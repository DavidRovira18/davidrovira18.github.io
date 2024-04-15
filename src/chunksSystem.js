import { createNoise2D } from './simplex-noise.js';  
import Chunk from './chunk.js';
import * as THREE from 'three';

const vec3 = new THREE.Vector3();
const vec2 = new THREE.Vector2();
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

        this.updateChunks();
    }

    createChunk(i, j, LOD)
    {
        const chunk = new Chunk(this.chunkSize, this.noise, new THREE.Vector3(i * this.chunkSize + this.chunkSize/2, 0, j * this.chunkSize + this.chunkSize/2), this.params, LOD);
        const index = `${i}_${j}`
        this.chunks[index] = chunk;
        this.scene.add(chunk);
        this.currentChunk = index;
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
        // if (this.cameraInVisitedChunk())
        //     return;
        var [x,y] = this.chunkKeyFromPos(this.camera.position);

         //Generate central chunk and bounding
         for(let i = x-4; i<=x+4; ++i)
         for(let j = y-4; j<=y+4; ++j)
         {
             const index = `${i}_${j}`;

             const LOD = Math.floor(vec2.set(i - x, j - y).length() * 0.5); //Distance between chunks
             if(this.chunks[index])
                 continue;

             else
             {
                this.createChunk(i,j, LOD);
             }
             
         }
    }

    cameraInVisitedChunk() //Check if camera in visited chunk
    {
        var key = this.chunkKeyFromPos(this.camera.position);
        key = key.join('_');

        if(key===this.currentChunk)
            return true;

        if(this.chunks[key])
            return true;

        return false;
    }

    cameraLookingAtVisitedChunk() //Check if camera is looking at a visited chunk 
    {
        //Get camera direction
        var direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);

        // Calculate a target position in front of the camera
        var targetPosition = new THREE.Vector3().copy(this.camera.position).add(direction * this.chunkSize);

        // Convert the target position to chunk coordinates
        var key = this.chunkKeyFromPos(targetPosition);
        key = key.join('_');

        // Check if the chunk at the target position has been visited
        if (this.chunks[key]) {
            return true;
        }

        return false;
    }
}