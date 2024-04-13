import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
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
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.set(0, 30, 100);
        this.camera.lookAt( 0 , 1 , 0);
        
        //Set lighting 
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 1, 0);
        this.scene.add(directionalLight);

        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.5);
        this.scene.add(hemisphereLight);

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
        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        // this.controls.enableDamping = true;
        // this.controls.enableZoom = true;

        //Set up fly controls
        // this.controls = new FlyControls(this.camera, this.renderer.domElement);
        // this.controls.movementSpeed = 10;
        // this.controls.rollSpeed = 2;
        // this.controls.dragToLook = false;
        // this.controls.moveUp = false;
        // this.controls.moveDown = false;

        //Set clock
        this.clock = new THREE.Clock();
        this.clock.start();


        //handle resize
        window.addEventListener( 'resize', onWindowResize.bind(this), false );

        function onWindowResize(){
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize( window.innerWidth, window.innerHeight );}   

        return new Promise((resolve) => {
            resolve();
        })
    },

    animate: function()
    {
        const dt = this.clock.getDelta();

        this.camera.position.z -= 0.5;
        this.chunkSystem.updateChunks();

        // Render the scene
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.animate.bind(this));
    }
}

export default BACKGROUND;