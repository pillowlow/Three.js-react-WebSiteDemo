import React,{Component} from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
// Post Processing
import { RenderPass} from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass"
import { EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer"

// fbx loader
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"


class newThreeScene extends Component{
    

    postProcessing = () =>{
        
        this.RenderScene = new RenderPass(this.scene,this.camera)
        this.BloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth,window.innerHeight),
            1.5,
            0.4,
            0.85

        );
        this.BloomPass.threshold = 0;
        this.BloomPass.strength = 3;
        this.BloomPass.radius = 0;

        this.BloomComposer = new EffectComposer(this.renderer);
        this.BloomComposer.setSize(window.innerWidth,window.innerHeight);
        this.BloomComposer.renderToScreen = true;
        this.BloomComposer.addPass(this.RenderScene);
        console.log(this.RenderScene);
        this.BloomComposer.addPass(this.BloomPass);
        console.log(this.BloomPass);
        console.log(this.BloomComposer);

        
    }

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

    animation = ()=>{
        
        // Update controls
        this.controls.update()

        // Render
        this.renderer.render(this.scene, this.camera)
        

        requestAnimationFrame(this.animation)
        //this.camera.layers.set(1);
       // console.log(this.BloomComposer)
       //this.BloomComposer.render();
    }

    resetAllMat = ()=> {
        // the method is really unsafe, reset by each Object 
        // all the mat properties of needed mesh should be registered by hand particularly

        const monkey = this.scene.getObjectByName("monkey")
        if(monkey){
            monkey.children[0].material.color.set( 0xffffff )
        }
        

        const dounut = this.scene.getObjectByName("dounut")
        dounut.children[0].material.color.set( 0xffffff )

    }
    
    rayCast =(event)=>{
        //1. sets the mouse position with a coordinate system where the center
        //   of the screen is the origin
        const mouse = new THREE.Vector2();
        // RayCaster
        const myRayCaster = new THREE.Raycaster();
        

        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        

        //2. set the picking ray from the camera position and mouse coordinates
        myRayCaster.setFromCamera( mouse, this.camera );    
        
        //3. compute intersections
        var intersects = myRayCaster.intersectObjects( this.scene.children );



        //4. thingsToDo

        // reset color
        this.resetAllMat();

        if(intersects.length <1){
            
            //console.log("nothing");
        }
        else{
            for ( var i = 0; i < intersects.length; i++ ) {
                
                
                intersects[ i ].object.material.color.set( 0xff0000 );
                intersects[ i ].object.material.emissive.set(0xff0000);
                /*
                    An intersection has the following properties :
                        - object : intersected object (THREE.Mesh)
                        - distance : distance from camera to intersection (number)
                        - face : intersected face (THREE.Face3)
                        - faceIndex : intersected face index (number)
                        - point : intersection point (THREE.Vector3)
                        - uv : intersection point in the object's UV coordinates (THREE.Vector2)
                */
            }


        }

        


    }



    componentDidMount=()=>{



        this.size = {
            width:window.innerWidth,
            height:window.innerHeight
        }
       
        //scene
        this.scene = new THREE.Scene();
       
        

        //renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas:this.canvas,
            antialias:true
        })

        //this.renderer.autoClear = false;
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

        this.postProcessing(); // for PostProcessing and whatever need in future




        


        
        // Controls
        this.controls = new OrbitControls(this.camera, this.canvas)
        this.controls.enableDamping = true

        
        


        // add fog
        const fog = this.scene.fog = new THREE.Fog( 0x61dafb, 0, 30 )
        

        
          





        // add fbx
        const Loader = new FBXLoader()
        const Loader2 = new FBXLoader()
        const loadPath = require('../models/testMonkey.fbx'); 
        const loadPath2 = require('../models/dounutTest.fbx');
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
                object.position.set(2,2,2)
                object.name = "monkey"
                //object.layers.set(1);
                console.log(object.name)
                
            },
            /*
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }*/
        )
        Loader2.load(
            loadPath2,
            (object) =>{
                this.scene.add(object)
                object.name = "dounut"
                object.layers.set(1);
                console.log(object.name)
            }
            
        )
        
        //Add Ambient light
        const light = new THREE.AmbientLight(0xcccccc,0.4)
        this.scene.add(light)

        const testLight = new THREE.AmbientLight(0xffc0cb, 0.7)
        this.scene.add(testLight)

        // Add directional Light
        const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
		directionalLight.position.set( - 1, 1, 1 );
        this.scene.add( directionalLight );    



        this.renderer.render(this.scene,this.camera)

        

        //Add event listener for resizing
        window.addEventListener('resize',this.handleWindowResize,false)

        window.addEventListener('resize',()=>{this.BloomComposer.setSize(window.innerWidth,window.innerHeight)},false)
        
        
        window.addEventListener('click',this.rayCast,false)



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

export default newThreeScene;