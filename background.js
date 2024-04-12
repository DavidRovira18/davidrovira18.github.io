import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import ChunkSystem from './chunksSystem.js';

var BACKGROUND = {
    init: async function()
    {
        const chunkSize = 256;
        //Set up scene
        this.scene = new THREE.Scene();

        //Set renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        
        //Set camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(10, chunkSize, 10);
        this.camera.lookAt(0,5,0);
        
        // Create chunk system

        this.chunkSystem = new ChunkSystem(chunkSize, [15, 1, 1, 3, 0.5, 2], this.scene, this.camera);
        // const divisions = 100;
        // this.geometry = new THREE.PlaneGeometry(chunk_size, chunk_size, divisions, divisions);
        // this.geometry.rotateX(-Math.PI * 0.5)
        // const material = new THREE.MeshNormalMaterial({ wireframe: true });
        // this.plane = new THREE.Mesh(this.geometry, material);
        // this.scene.add(this.plane);


        //this.vertex_positions = this.geometry.getAttribute('position');

        //Add simplex noise to the plane
        
        //this.updateGeometry(10, 1.5, 1, 3);


        // Set up orbit controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.enableZoom = true;

        return new Promise((resolve) => {
            resolve();
        })
    },

    animate: function()
    {

        //this.camera.position.y += 0.005;
        this.chunkSystem.updateChunks();
        // Render the scene
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.animate.bind(this));
    }
}

export default BACKGROUND;