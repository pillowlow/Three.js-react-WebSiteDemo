import React,{Component} from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Water } from "./libs/Water2"

// fbx loader
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"

// import vertex from "./shaders/vertexShader";
// import fragment from "./shaders/fragmentShader";
// import * as dat from 'dat.gui';

/**
 * This is the main rendering component. This component consist of:
 * 1] The basic scene
 * 2] Camera
 * 3] Orbit Controls
 */

//Initialise GUI
// const gui = new dat.GUI();

const params = {
    color: '#ffffff',
    scale: 4,
    flowX: 1,
    flowY: 1
};


class ThreeScene extends Component{
    
    //This is a function to handle resizing of window
    handleWindowResize = ()=>{
        // console.log("hello")
        
        //update the camera
        this.camera.aspect = window.innerWidth/window.innerHeight
        this.camera.updateProjectionMatrix()
        // console.log(this.camera.aspect)

        //update the renderer
        this.renderer.setSize(window.innerWidth,window.innerHeight)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.render(this.scene,this.camera)
        // this.canvas = this.renderer.domElement

    }


    /*
    // This is a function to display in fullscreen
    handleFullscreen = () => {
    
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
    
        if(!fullscreenElement)
        {
            if(this.canvas.requestFullscreen)
            {
                try{this.canvas.requestFullscreen()}
               catch(err){
                   console.log(err)
               }
            }
            else if(this.canvas.webkitRequestFullscreen)
            {
                this.canvas.webkitRequestFullscreen()
            }
        }
        else
        {
            if(document.exitFullscreen)
            {
                document.exitFullscreen()
            }
            else if(document.webkitExitFullscreen)
            {
                document.webkitExitFullscreen()
            }
        }
    }*/

    animation = ()=>{
        
        // Update controls
        this.controls.update()

        // Render
        this.renderer.render(this.scene, this.camera)

        requestAnimationFrame(this.animation)
    }

    //Load the entire scene
    componentDidMount=()=>{

        this.size = {
            width:window.innerWidth,
            height:window.innerHeight
        }
       
        //scene
        this.scene = new THREE.Scene();
         // fog


        

        //renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias:true
        })
        this.renderer.setSize(this.size.width,this.size.height)
        this.renderer.setClearColor(0x61dafb,1);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.toneMapping = THREE.NoToneMapping;

        // Assign the canvas
        this.canvas = this.renderer.domElement
        
        //camera
        this.camera = new THREE.PerspectiveCamera(45,this.size.width/this.size.height,0.1,100)
        this.camera.position.set( - 15, 7, 15 )
        this.camera.lookAt(this.scene.position)
        this.scene.add(this.camera)

        // Controls
        this.controls = new OrbitControls(this.camera, this.canvas)
        this.controls.enableDamping = true

        // add fog
        const fog = this.scene.fog = new THREE.Fog( 0x61dafb, 0, 50 )
        console.log(fog)


        // add partical

        var particularGruop = new THREE.Object3D();
        function generateParticle(num, amp = 2) {
            var gmaterial = new THREE.MeshPhysicalMaterial({color:0xFFFFFF, side:THREE.DoubleSide});
          
            var gparticular = new THREE.CircleGeometry(0.2,5);
          
            for (var i = 1; i < num; i++) {
              var pscale = 0.001+Math.abs(Math.random(0.03));
              var particular = new THREE.Mesh(gparticular, gmaterial);
              particular.position.set(Math.random(amp),Math.random(amp),Math.random(amp));
              particular.rotation.set(Math.random(),Math.random(),Math.random());
              particular.scale.set(pscale,pscale,pscale);
              particular.speedValue = Math.random(1);
               


          
              particularGruop.add(particular);
            }
          }
          this.scene.add(particularGruop);
          





        // add fbx
        const Loader = new FBXLoader()
        const loadPath = require('../models/testMonkey.fbx'); //D:\CodingWorks\React-threejs-template\public\static\models
        Loader.load(
            loadPath,
            (object) => {
                // object.traverse(function (child) {
                //     if ((child as THREE.Mesh).isMesh) {
                //         // (child as THREE.Mesh).material = material
                //         if ((child as THREE.Mesh).material) {
                //             ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
                //         }
                //     }
                // })
                // object.scale.set(.01, .01, .01)



                this.scene.add(object)
                
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }






        )
        
        
        
        
        
        //Add cube
        // var geometry = new THREE.PlaneGeometry(1,1)
        // var material = new THREE.MeshBasicMaterial(
        //     {
        //         color:new THREE.Color('red'),
                
        //     }
        // )
        // this.cube = new THREE.Mesh(geometry,material)
        // this.scene.add(this.cube)

        // ground

        const groundGeometry = new THREE.PlaneGeometry( 20, 20 );
        const groundMaterial = new THREE.MeshStandardMaterial( { roughness: 0.8, metalness: 0.4 } );
        const ground = new THREE.Mesh( groundGeometry, groundMaterial );
        ground.rotation.x = Math.PI * - 0.5;
        this.scene.add( ground );

        

        const textureLoader = new THREE.TextureLoader();
        textureLoader.load( './static/textures/FloorsCheckerboard_S_Diffuse.jpg', function ( map ) {

            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.anisotropy = 16;
            map.repeat.set( 4, 4 );
            groundMaterial.map = map;
            groundMaterial.needsUpdate = true;

        } );
       



        // water

        const waterGeometry = new THREE.PlaneGeometry( 20, 20 );

         let water = new Water( waterGeometry, {
            color: params.color,
            scale: params.scale,
            flowDirection: new THREE.Vector2( params.flowX, params.flowY ),
            textureWidth: 1024,
            textureHeight: 1024
        } );

        water.position.y = 1;
        water.rotation.x = Math.PI * - 0.5;
        this.scene.add( water );

        
        //Add Ambient light
        const light = new THREE.AmbientLight(0xcccccc,0.4)
        this.scene.add(light)

        const testLight = new THREE.AmbientLight(0xffc0cb, 0.7)
        this.scene.add(testLight)

        // Add directional Light
        const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
		directionalLight.position.set( - 1, 1, 1 );
        this.scene.add( directionalLight );    


        // add ray caster
        var rayCaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2(), INTERSECTED;
        var intersected;

        function onMouseMove(event){
            event.preventDefault();
            mouse.x



        }





        this.renderer.render(this.scene,this.camera)

        //Add event listener for resizing
        window.addEventListener('resize',this.handleWindowResize,false)

        // Add event listener for Fullscreen
        window.addEventListener('dblclick', this.handleFullscreen)


        this.mount.appendChild(this.renderer.domElement)

        this.animation()

    }
    
    render(){
        return(
            <div ref={
                mount=>{this.mount = mount}
            }>
            </div>
        )
    }

}

export default ThreeScene;