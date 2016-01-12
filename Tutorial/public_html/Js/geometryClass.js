$(function(){
    var scene, camera, renderer;
    var controls, guiControls, datGUI;
    var genGeometry, sphereGeometry, boxGeometry, cylinderGeometry, dodecahedronGeometry, icosahedronGeometry, octahedronGeometry, planeGeometry,  ringGeometry, tetrahedronGeometry, torusGeometry, torusKnotGeometry;
    var lineMaterial;
    var torusKnot, plane, sphere, shape, mesh;
    var stats;
    var SCREEN_WIDTH, SCREEN_HEIGHT;
    var materials;
    
    function init(){    
        /*creates empty scene object and renderer*/
        scene = new THREE.Scene();
        camera =  new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, .1, 500);
        renderer = new THREE.WebGLRenderer({antialias:true});
        
        renderer.setClearColor(0xffffff);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled= true;
        renderer.shadowMapSoft = true;
        
        /*add controls*/
        controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.addEventListener( 'change', render );
        
        /*datGUI controls object*/
        guiControls = new function(){   
        /*geo  position*/
            this.rotationX  = 0.00;
            this.rotationY  = 0.00;
            this.rotationZ  = 0.01; 
            /*material*/
            this.color = 0x000000;
            this.form = 0;
            this.wireframe = true;  
            /*mesh or line*/
            this.lineshape =  true;
        }
        
        /*create geometries*/
        genGeometryShape = [        
            boxGeometry = new THREE.BoxGeometry( 6 ,6, 6, 6),       
            cylinderGeometry = new THREE.CylinderGeometry( 6, 6, 6, 6),     
            dodecahedronGeometry = new THREE.DodecahedronGeometry(6),
            icosahedronGeometry = new THREE.IcosahedronGeometry(6),
            octahedronGeometry = new THREE.OctahedronGeometry(6),
            sphereGeometry = new THREE.SphereGeometry( 6, 32, 32),          
            ringGeometry = new THREE.RingGeometry( 6, 6, 6),
            torusGeometry = new THREE.TorusGeometry( 3, 3, 32, 32),
            torusKnotGeometry = new THREE.TorusKnotGeometry( 3, 3, 32, 32)      
        ];
        genGeometryMesh = [     
            boxGeometry = new THREE.BoxGeometry( 6 ,6, 6, 6),       
            cylinderGeometry = new THREE.CylinderGeometry( 6, 6, 6, 6),     
            dodecahedronGeometry = new THREE.DodecahedronGeometry(6),
            icosahedronGeometry = new THREE.IcosahedronGeometry(6),
            octahedronGeometry = new THREE.OctahedronGeometry(6),
            sphereGeometry = new THREE.SphereGeometry( 6, 32, 32),          
            ringGeometry = new THREE.RingGeometry( 6, 6, 6),
            torusGeometry = new THREE.TorusGeometry( 3, 3, 32, 32),
            torusKnotGeometry = new THREE.TorusKnotGeometry( 3, 3, 32, 32)      
        ];      

        /*materials and initial object creation*/       
        materials  = [
            lineMaterial = new THREE.LineBasicMaterial({color: guiControls.color}),
            meshBasicMaterial = new THREE.MeshBasicMaterial({color: guiControls.color, wireframe:true})
            ];      
        shape =  new THREE.Line(genGeometryShape[0], materials[0]);
        mesh =  new THREE.Mesh(genGeometryMesh[0], materials[1]);
        
        /*position and add objects to scene*/       
        shape.position.x = 2.5
        shape.position.y = 6;
        shape.position.z = 2.5;
        shape.castShadow = false;
        scene.add(shape);
        
        mesh.position.x = 2.5
        mesh.position.y = 6;
        mesh.position.z = 2.5;
        mesh.castShadow = false;

                
        camera.position.x = 10;
        camera.position.y = 20;
        camera.position.z = 10; 
        camera.lookAt(scene.position);
        
        /*adds controls to scene*/
        datGUI = new dat.GUI();
        var rotFolder = datGUI.addFolder('Rotation  Options');
        var shapeFolder = datGUI.addFolder('Form Options');     
        var materialFolder = datGUI.addFolder('Material Options');
        
        materialFolder.open();
        
        rotFolder.add(guiControls, 'rotationX',0,1);
        rotFolder.add(guiControls, 'rotationY',0,1);    
        rotFolder.add(guiControls, 'rotationZ',0,1);
            
        materialFolder.addColor(guiControls, 'color').onChange(function(value){
            shape.material.color.setHex (value);
            mesh.material.color.setHex (value);         
        });
        materialFolder.add(guiControls, 'lineshape').name('Line Shape').onChange(function(value){
            if (value == true){
                console.log(shape)
                scene.remove(mesh);             
                scene.add(shape = new THREE.Line(genGeometryShape[guiControls.form], materials[0]));
            }
            else{       
                console.log(mesh)               
                scene.remove(shape);
                scene.add(mesh = new THREE.Mesh(genGeometryMesh[guiControls.form], materials[1]));          
            }   
        });
        materialFolder.add(guiControls, 'wireframe').name('Wireframe').onChange(function(value){
            if (mesh.material.wireframe  == false){
                mesh.material.wireframe = true;
            }
            else{
                mesh.material.wireframe = false;
            }
        });     
        
        shapeFolder.add(guiControls, 'form',{'Box':0, 'Cylinder':1, 'Dodecahedron':2, 'Icosahedron':3, 'Octahedron':4,  'Sphere':5, 'Ring':6, 'Torus':7, 'Torus Knot':8}).onChange(function(value){
            if (value == 0 && guiControls.lineshape == true){                   
                scene.remove(shape);
                scene.remove(mesh);                 
                shape = new THREE.Line(genGeometryShape[0], materials[0]);
                scene.add(shape);
            }
            else if (value == 0 && guiControls.lineshape == false){
                scene.remove(shape);
                scene.remove(mesh); 
                mesh = new THREE.Mesh(genGeometryMesh[0], materials[1]);
                scene.add(mesh);
            }               
            else if (value == 1 && guiControls.lineshape == true){
                scene.remove(shape);
                scene.remove(mesh); 
                shape = new THREE.Line(genGeometryShape[1], materials[0]);
                scene.add(shape);
            }
            else if (value == 1 && guiControls.lineshape == false){
                scene.remove(shape);
                scene.remove(mesh); 
                mesh = new THREE.Mesh(genGeometryMesh[1], materials[1]);
                scene.add(mesh);
            }                   
            else if (value == 2 && guiControls.lineshape == true){
                scene.remove(shape);
                scene.remove(mesh); 
                shape = new THREE.Line(genGeometryShape[2], materials[0]);
                scene.add(shape);
            }
            else if (value == 2 && guiControls.lineshape == false){
                scene.remove(shape);
                scene.remove(mesh); 
                mesh = new THREE.Mesh(genGeometryMesh[2], materials[1]);
                scene.add(mesh);
            }               
            else if (value == 3 && guiControls.lineshape == true){
                scene.remove(shape);
                scene.remove(mesh); 
                shape = new THREE.Line(genGeometryShape[3], materials[0]);
                scene.add(shape);
            }
            else if (value == 3 && guiControls.lineshape == false){
                scene.remove(shape);
                scene.remove(mesh); 
                mesh = new THREE.Mesh(genGeometryMesh[3], materials[1]);
                scene.add(mesh);
            }               
            else if (value == 4 && guiControls.lineshape == true){
                scene.remove(shape);
                scene.remove(mesh); 
                shape = new THREE.Line(genGeometryShape[4], materials[0]);
                scene.add(shape);
            }
            else if (value == 4 && guiControls.lineshape == false){
                scene.remove(shape);
                scene.remove(mesh); 
                mesh = new THREE.Mesh(genGeometryMesh[4], materials[1]);
                scene.add(mesh);
            }               
            else if (value == 5 && guiControls.lineshape == true){
                scene.remove(shape);
                scene.remove(mesh); 
                shape = new THREE.Line(genGeometryShape[5], materials[0]);
                scene.add(shape);
            }
            else if (value == 5 && guiControls.lineshape == false){
                scene.remove(shape);
                scene.remove(mesh); 
                mesh = new THREE.Mesh(genGeometryMesh[5], materials[1]);
                scene.add(mesh);
            }               
            else if (value == 6 && guiControls.lineshape == true){
                scene.remove(shape);
                scene.remove(mesh); 
                shape = new THREE.Line(genGeometryShape[6], materials[0]);
                scene.add(shape);
            }
            else if (value == 6 && guiControls.lineshape == false){
                scene.remove(shape);
                scene.remove(mesh); 
                mesh = new THREE.Mesh(genGeometryMesh[6], materials[1]);
                scene.add(mesh);
            }                   
            else if (value == 7 && guiControls.lineshape == true){
                scene.remove(shape);
                scene.remove(mesh); 
                shape = new THREE.Line(genGeometryShape[7], materials[0]);
                scene.add(shape);
            }
            else if (value == 7 && guiControls.lineshape == false){
                scene.remove(shape);
                scene.remove(mesh); 
                mesh = new THREE.Mesh(genGeometryMesh[7], materials[1]);
                scene.add(mesh);
            }               
            else if (value == 8 && guiControls.lineshape == true){
                scene.remove(shape);
                scene.remove(mesh); 
                shape = new THREE.Line(genGeometryShape[8], materials[0]);
                scene.add(shape);
            }
            else if (value == 8 && guiControls.lineshape == false){
                scene.remove(shape);
                scene.remove(mesh); 
                mesh = new THREE.Mesh(genGeometryMesh[8], materials[1]);
                scene.add(mesh);
            }                   
        });
    datGUI.close();
        $("#webGL-container").append(renderer.domElement);
        /*stats*/
        stats = new Stats();        
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';     
        $("#webGL-container").append( stats.domElement );
        
        console.log(scene);
    }
    function render() {
        shape.rotation.x += guiControls.rotationX;
        shape.rotation.y += guiControls.rotationY;
        shape.rotation.z += guiControls.rotationZ;
        mesh.rotation.x += guiControls.rotationX;
        mesh.rotation.y += guiControls.rotationY;
        mesh.rotation.z += guiControls.rotationZ;
    }
    function animate(){ 
        requestAnimationFrame(animate);
        render();
        stats.update();     
        renderer.render(scene, camera);
    }
    $(window).resize(function(){

        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;

        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();

        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    });
    init(); 
    animate();
    
}); 