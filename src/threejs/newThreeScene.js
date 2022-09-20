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
        this.BloomPass.strength = 1;
        this.BloomPass.radius = 0;

        this.BloomComposer = new EffectComposer(this.renderer);
        this.BloomComposer.setSize(window.innerWidth,window.innerHeight);
        this.BloomComposer.renderToScreen = true;
        this.BloomComposer.addPass(this.RenderScene);
        //console.log(this.RenderScene);
        this.BloomComposer.addPass(this.BloomPass);
        //console.log(this.BloomPass);
        //console.log(this.BloomComposer);

        
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
        this.renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)
        this.renderer.render(this.scene,this.camera)

        
        // this.canvas = this.renderer.domElement
        // postProcessing
        this.BloomComposer.setSize(window.innerWidth,window.innerHeight)
        


    }

    animation = ()=>{
        
        // Update controls
        this.controls.update()

        // Render
        //this.renderer.render(this.scene, this.camera)
        

        requestAnimationFrame(this.animation)
        //this.camera.layers.set(1);
       // console.log(this.BloomComposer)
       this.BloomComposer.render();

       const testCloud = this.scene.getObjectByName("testCloud")

       if(testCloud){
        
        testCloud.rotation.y += 0.00314;
       }
       
       const galaxy = this.scene.getObjectByName("galaxy")
       if(galaxy){
        
        galaxy.rotation.y += 0.00400;
       }
       

       
       
    }



    resetAllMat = ()=> {
        // the method is really unsafe, reset by each Object 
        // all the mat properties of needed mesh should be registered by hand particularly

        const monkey = this.scene.getObjectByName("monkey")
        if(monkey){
            monkey.children[0].material.color.set( 0xffffff )
            monkey.children[0].material.emissive.set( 0x000000 )
        }
        

        const dounut = this.scene.getObjectByName("dounut")
        if(dounut){
            dounut.children[0].material.color.set( 0xffffff )
            dounut.children[0].material.emissive.set( 0x000000 )
        }
        
        const testCloud = this.scene.getObjectByName("testCloud")
        if(testCloud){
            var temp = testCloud.children;
            temp.forEach(element => {
                if(element.name == "Sphere"){
                    element.material.color.set( 0xffffff )
                    element.material.emissive.set( 0x000000 )
                    
                }
                else if(element.name == "Sphere001"){
                    element.material.color.set( 0xfffb00 )
                    element.material.emissive.set( 0x000000 )
                    
                }
                else{
                    element.material.color.set( 0x00fffb )
                    element.material.emissive.set( 0x000000 )
                   
                }
            });
            
         }

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
        // set color
        if(intersects.length === 0){
            
            //console.log("nothing");
        }
        else{
            for ( var i = 0; i < intersects.length; i++ ) {
                
                if(intersects[ i ].object.material !== undefined){
                    intersects[ i ].object.material.color.set( 0xff0000 );
                    intersects[ i ].object.material.emissive.set(0xff0000);
                    break;
                }
                
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

        this.renderer.autoClear = false;
        this.renderer.setSize(this.size.width,this.size.height)
        this.renderer.setClearColor(0x000000,1);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.toneMapping = THREE.NoToneMapping;

        // Assign the canvas
        this.canvas = this.renderer.domElement
        
        
        //camera
        this.camera = new THREE.PerspectiveCamera(45,this.size.width/this.size.height,0.1,100)
        this.camera.position.set( - 7, 10, 7 )
        this.camera.lookAt(this.scene.position)
        this.scene.add(this.camera)

        this.postProcessing(); // for PostProcessing and whatever need in future




        


        
        // Controls
        this.controls = new OrbitControls(this.camera, this.canvas)
        this.controls.enableDamping = true

        
        


        // add fog
        const fog = this.scene.fog = new THREE.Fog( 0x000000, 0, 25 )
        
        /*
        // galaxy geometry
        const starGeometry = new THREE.SphereGeometry(80, 64, 64);
        const texLoader = new THREE.TextureLoader();
        // galaxy material
        const starMaterial = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader(".../public/static/texture/galaxy1.png"),
            side: THREE.BackSide,
            transparent: true,
        });

        // galaxy mesh
        const starMesh = new THREE.Mesh(starGeometry, starMaterial);
        //starMesh.layers.set(1);
        this.scene.add(starMesh);
        */
        
        const GalaxyTexLoader = new THREE.TextureLoader();
        const GalaxyTexPath = "./galaxy1.png" ;
       
        GalaxyTexLoader.load(
            './static/textures/galaxy1.png',
            (tex) =>{
                
                const color = new THREE.Color("rbg(255,255,255)")
                const starGeometry = new THREE.SphereGeometry(10, 64, 64);
                const starMaterial = new THREE.MeshStandardMaterial({
                    map: tex,
                    side: THREE.BackSide,
                    transparent: true,
                    emissive: color,
                    
                    emissiveIntensity: 10,
                    
                    
                   
                    
                });
                
                const starMesh = new THREE.Mesh(starGeometry, starMaterial);
                //starMesh.layers.set(1);
                
                this.scene.add(starMesh);
                starMesh.name = "galaxy"
                
            },
            undefined,
            function (err){
                console.log(err,"wrong");
            }

        )
        

        



        // add fbx
        const Loader = new FBXLoader()
        const Loader2 = new FBXLoader()
        const Loader3 = new FBXLoader()
        const Loader4 = new FBXLoader()
        const loadPath = require('../models/testMonkey.fbx'); 
        const loadPath2 = require('../models/dounutTest.fbx');
        const loadPath3 = require('../models/testBackGroundParts.fbx');
        const loadPath4 = require('../models/MainSpaceStation.fbx');
        
        /*
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
                
                //object.layers.set(1);
                //console.log(object.name)
                
            },
            /*
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }
        )*/
        
        Loader3.load(
            loadPath3,
            (object) =>{
                this.scene.add(object)
                object.name = "testCloud"
                
                
            }
            
        )
        Loader4.load(
            loadPath4,
            (object) =>{
                
                this.scene.add(object)
                object.name = "SpaceStation"
                
                
            },
            undefined,
            function (err){
                console.log(err,"wrong");
            }
        )
        
        
        
        

        

        // Add directional Light
        const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.3)
        this.scene.add( directionalLight );    
        
        const MyambientLight = new THREE.AmbientLight(0xffffff, 0.1)
        this.scene.add( MyambientLight );    
        



        this.renderer.render(this.scene,this.camera)

        

        //Add event listener for resizing
        window.addEventListener('resize',this.handleWindowResize,false)

        
        
        
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