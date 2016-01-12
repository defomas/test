$(function(){
//http://stemkoski.github.io/Three.js/#hello-world
        //global variables//
        // vars for scene / camera / renderer
	var scene, camera, renderer;
        // orbitscontrols / guicontrols / gui
	var controls, guiControls, datGUI;
        // axishelper / gridhelper / 
        var axis, grid, color;
        // 
        var cubeGeometry,  torGeometry, textGeometry,  planeGeometry;
        // vars for the materials
        var cubeMaterial, torMaterial, textMaterial,  planeMaterial;
        // meshes
        var cube, torusKnot, text, plane, houseObj, extraText;
        // statistics
	var stats;
        // lights and lighthelper
	var spotLight, hemi, cameraHelper;
        // size of the screen
	var SCREEN_WIDTH, SCREEN_HEIGHT;
        // mouseobject and raycaster
        var mouse, raycaster;
        // scene children array
        var objects = [];
        //  array for added text
        var textObjects = [];
               
        // globals for audio
        // create audio context
        var ctx = new AudioContext();
        // get audio element (div)
        var audio = document.getElementById('myAudio');
        // get audiofile
        var audioSrc = ctx.createMediaElementSource(audio);
        // create analyser for music frequency
        var analyser = ctx.createAnalyser();
        // connecting the source to the analyser and context destination
        audioSrc.connect(analyser);
        audioSrc.connect(ctx.destination);
        // frequencyBinCount tells you how many values you'll receive from the analyser
        var frequencyData = new Uint8Array(analyser.frequencyBinCount);
        
        // initialising function
	function init(){
        // hide the div popup    
        $(".popup").hide();
        
		//creates empty scene object, camera and renderer
		scene = new THREE.Scene();
		camera =  new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, .1, 500);
		renderer = new THREE.WebGLRenderer({antialias:true});
		
                // set color and size of renderer
		renderer.setClearColor(0xEBE0FF);
		renderer.setSize(window.innerWidth, window.innerHeight);
                // enables shadowmapping  and defines the type
                renderer.shadowMap.enabled = true;
                renderer.shadowMapSoft = true;
		
		//add orbitcontrols and an eventlistener 
		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.addEventListener( 'change', render );
                
                //adds helpers
                axis =  new THREE.AxisHelper(10);
                scene.add (axis);

                grid = new THREE.GridHelper(50, 5);
                color = new THREE.Color("rgb(255,0,0)");
                grid.setColors(color, 0x000000);

                scene.add(grid);

                /*create cube*/
                cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
                cubeMaterial = new THREE.MeshLambertMaterial({color:0xff3300});
                cube  = new THREE.Mesh(cubeGeometry, cubeMaterial);
                cube.name = "cube";

                /*create torus knot*/
                torGeometry = new THREE.TorusKnotGeometry( 3, 1, 64, 64);
                //torMaterial = new THREE.MeshPhongMaterial( { color: 0xffff00 } );
                torMaterial = new THREE.MeshPhongMaterial({color:frequencyData[1]*0xff3300});
                torusKnot = new THREE.Mesh( torGeometry, torMaterial );
                torusKnot.name = "torusKnot";
               // torusKnot.name = frequencyData.length;

                /*create text*/
                textGeometry = new THREE.TextGeometry('Hello  World', {size:2, height:1});
                textMaterial = new THREE.MeshPhongMaterial( { color: 0xff9000 } );
                text = new THREE.Mesh( textGeometry, textMaterial );
                text.name = "text";

                /*create plane*/
                planeGeometry = new THREE.PlaneGeometry (100,100,100);
                planeMaterial = new THREE.MeshLambertMaterial({color:0xffffff});
                plane = new THREE.Mesh(planeGeometry, planeMaterial);
                plane.name = "plane";

                /*position and add objects to scene*/
                plane.rotation.x = -.5*Math.PI;
                plane.receiveShadow = true;
                scene.add(plane);

                cube.position.x = 9.5;
                cube.position.y = 4;
                cube.position.z = 2.5;
                cube.castShadow = true;
                scene.add(cube);

                torusKnot.position.x = -8;
                torusKnot.position.y = 6;
                torusKnot.position.z = 2.5;
                torusKnot.castShadow = true;
                scene.add( torusKnot );

                text.position.x = 22;
                text.position.y = 6;
                text.position.z = 2.5;
                text.castShadow = true;
                scene.add( text );
           
		camera.position.x = 0;
		camera.position.y = 150;
		camera.position.z = 300;	
		camera.lookAt(scene.position);
                
                //hemi light
                hemi = new THREE.HemisphereLight(0xbbbbbb, 0x660066);
                scene.add(hemi);        
        
		/*adds spot light with starting parameters*/
		spotLight = new THREE.SpotLight(0xffffff);
		spotLight.castShadow = true;
		spotLight.position.set (20, 35, 40);
		spotLight.intensity = 0.5;		
		spotLight.distance = 373;
		spotLight.angle = 1.6;
		spotLight.exponent = 38;
                spotLight.shadow.camera.near = 10; 
                spotLight.shadow.camera.far = 100;
                spotLight.shadow.camera.fov = 50;      
                //spotLight.shadowCameraVisible = true;
                spotLight.shadow.bias = 0.00;
                spotLight.shadow.darkness = 0.11;
                //spotLight.target = text;
        
		scene.add(spotLight);
                
                cameraHelper = new THREE.CameraHelper( spotLight.shadow.camera );
//                scene.add(cameraHelper);
        
		/*datGUI controls object*/
		guiControls = new function(){
                this.SceneToConsole= function(){
                console.log(scene);
                console.log(camera.position.x + " X Position");
                console.log(camera.position.y + " Y Position");
                console.log(camera.position.z + " Z Position");
                };
            
			this.rotationX  = cube.rotation.x;
			this.rotationY  = 0.0;
			this.rotationZ  = 0.0;
			
			this.lightX = spotLight.position.x;
			this.lightY = spotLight.position.y;
			this.lightZ = spotLight.position.z;
			this.intensity = spotLight.intensity;		
			this.distance = spotLight.distance;
			this.angle = spotLight.angle;
			this.exponent = spotLight.exponent;
			this.cameraHelper= false;
			this.shadowMapWidth=512;
			this.shadowMapHeight=512;
                        this.shadowCameraNear = spotLight.shadow.camera.near;
                        this.shadowCameraFar = spotLight.shadow.camera.far;
                        this.shadowCameraFov = spotLight.shadow.camera.fov;
			this.shadowBias= spotLight.shadow.bias;
			this.shadowDarkness= spotLight.shadow.darkness;	
                        this.target = cube;
                        
                        this.addText = function(){
                            addText();
                        };
                        this.deleteText = function(){
                            deleteText();
                        };
		};        
        
                //load blender scene
                var loader = new THREE.ObjectLoader();    
           
                loader.load('./models/Bambo_House.json',function ( obj ) {
            
                        obj.scale.set(2,2,2);
                        obj.position.x = -15;
                        obj.position.y = 0;
                        obj.position.z = 2.5;   
                       
                       
                        scene.add( obj );
                        
                houseObj = obj.getObjectByName( "body_house" );   
                
                scene.traverse(function(children){
                
                if(children instanceof THREE.Mesh){
                    
                objects.push(children);
            
                }});
                
                    console.log(objects);
                    console.log(scene);
                    
                }); 
                
        
        //add raycaster and mouse as 2D vector
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();
        
        //add event listener for mouse and calls function when activated
        document.addEventListener( 'mousedown', onDocumentMouseDown, false );
        document.addEventListener( 'touchstart', onDocumentTouchStart, false );        
                   
		/*adds controls to scene*/
		datGUI = new dat.GUI();		
                datGUI.add(guiControls, 'SceneToConsole');
                
                // text controls
                var textFolder = datGUI.addFolder('Text');
                textFolder.add(guiControls, 'addText');
                textFolder.add(guiControls, 'deleteText');
                
                // cube controls
                var cubeFolder = datGUI.addFolder('Cube');
                cubeFolder.add(guiControls, 'rotationX',0.0,1.0);
                cubeFolder.add(guiControls, 'rotationY',0.0,1.0);
                cubeFolder.add(guiControls, 'rotationZ',0.0,1.0);
                
                // light controls
                var lightFolder = datGUI.addFolder('Lights');
		lightFolder.add(guiControls, 'lightX',-60,180);	
		lightFolder.add(guiControls, 'lightY',0,180);	
		lightFolder.add(guiControls, 'lightZ',-60,180);
                               
                lightFolder.add(guiControls, 'target', ['cube', 'torusKnot','text','house']).onChange(function(){
                if (guiControls.target === 'cube'){
                spotLight.target =  cube;
                
                }
                else if (guiControls.target === 'torusKnot'){
                spotLight.target =  torusKnot;
                }
                else if (guiControls.target === 'text'){
                spotLight.target =  text;
                }
                
                else if (guiControls.target === 'house'){
                spotLight.target =  houseObj;
                }
                 });                
		
		lightFolder.add(guiControls, 'intensity',0.01, 5).onChange(function(value){
			spotLight.intensity = value;
		});		
		lightFolder.add(guiControls, 'distance',0, 1000).onChange(function(value){
			spotLight.distance = value;
                        
		});	
		lightFolder.add(guiControls, 'angle',0.001, 1.570).onChange(function(value){
			spotLight.angle = value;
                       
		});		
		lightFolder.add(guiControls, 'exponent',0 ,50 ).onChange(function(value){
			spotLight.exponent = value;
		});
		lightFolder.add(guiControls, 'cameraHelper').onChange(function(value){
                    if(value === true)
                    {                       
                         scene.add(cameraHelper);
                    }
                    else if (value === false)
                    {
                        scene.remove(cameraHelper);
                    }
		});
                datGUI.add(guiControls, 'shadowCameraNear',0,100).name("Near").onChange(function(value){
                spotLight.shadow.camera.near = value;
                spotLight.shadow.camera.updateProjectionMatrix(); 
                cameraHelper.update();
                });
                datGUI.add(guiControls, 'shadowCameraFar',0,5000).name("Far").onChange(function(value){
                spotLight.shadow.camera.far = value;
                spotLight.shadow.camera.updateProjectionMatrix();
                 cameraHelper.update();
                });
                datGUI.add(guiControls, 'shadowCameraFov',1,180).name("Fov").onChange(function(value){
                spotLight.shadow.camera.fov = value;
                spotLight.shadow.camera.updateProjectionMatrix();
                cameraHelper.update();
                });
		lightFolder.add(guiControls, 'shadowBias',0,1).onChange(function(value){
                        spotLight.shadow.bias = value;
                        spotLight.shadow.camera.updateProjectionMatrix();
		});
		lightFolder.add(guiControls, 'shadowDarkness',0,1).onChange(function(value){
                        spotLight.shadow.darkness = value;
                        spotLight.shadow.camera.updateProjectionMatrix();
		});
		datGUI.close();
        
		$("#webGL-container").append(renderer.domElement);
		/*stats*/
		stats = new Stats();		
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';		
		$("#webGL-container").append( stats.domElement );
        
	// create the video element
	video = document.createElement( 'video' );
	// video.id = 'video';
	// video.type = ' video/ogg; codecs="theora, vorbis" ';
	video.src = "./movies/One_Punch_Man_Opening_Full_Version.ogv";
	video.load(); // must call after setting/changing source
	
	videoImage = document.createElement( 'canvas' );
	videoImage.width = 855;
	videoImage.height = 408;

	videoImageContext = videoImage.getContext( '2d' );
	// background color if no video present
	videoImageContext.fillStyle = '#000000';
	videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

	videoTexture = new THREE.Texture( videoImage );
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;
	
	var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );
	// the geometry on which the movie will be displayed;
	// 		movie image will be scaled to fit these dimensions.
	var movieGeometry = new THREE.PlaneGeometry( 240, 100, 4, 4 );
	var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
	movieScreen.position.set(0,50,-50);
        movieScreen.name = "moviescreen";
	scene.add(movieScreen);	
	}        
   

   
    function addText(){                   
        textSize  = Math.floor((Math.random()*6));
        textGeometry = new THREE.TextGeometry('Hello World', {size:textSize, height:1}); 
        textMaterial = new THREE.MeshPhongMaterial( { color: Math.random()*0xff9000 } ); 
        extraText = new THREE.Mesh( textGeometry, textMaterial );
        extraText.castShadow = true;
        extraText.receiveShadow = true;
        extraText.name = "spam-"+scene.children.length;
        extraText.position.x = 22;//Math.floor(Math.random()*99) - 49;
        extraText.position.y = 6;//Math.floor(Math.random()*99) - 49;
        extraText.position.z =  Math.floor(Math.random()*10) - 10;
        scene.add(extraText);
        objects.push(extraText);
        textObjects.push(extraText);
        this.textCount = scene.children.length;  
        
        console.log(textCount);       
    }
    
    function deleteText(){
        var arrayText = scene.children;
        var lastTextAdded = arrayText[arrayText.length-1];
        if (lastTextAdded instanceof THREE.Mesh){
            scene.remove(lastTextAdded);
            objects.splice(objects.length-1,1);
            textObjects.splice(objects.length-1,1);
            addText.textCount = scene.children.length;
        }
        console.log(arrayText.length);
        console/log(addText.textCount);
    }
    
    function onDocumentTouchStart( event ) {

        event.preventDefault();

        event.clientX = event.touches[0].clientX;
        event.clientY = event.touches[0].clientY;
        onDocumentMouseDown( event );

    }
    
    function onDocumentMouseDown( event ) {
        
       // event.preventDefault();

        mouse.x = ( event.clientX / renderer.domElement.width ) * 2 - 1;
        mouse.y = - ( event.clientY / renderer.domElement.height ) * 2 + 1;

        raycaster.setFromCamera( mouse, camera );

        var intersects = raycaster.intersectObjects( objects );
        
        var color = (Math.random() * 0xffffff);

        if ( intersects.length > 0 ) {
            
            this.temp = intersects[ 0 ].object.material.color.getHexString();
            this.name = intersects[ 0 ].object.name;           
            
            if (this.name === "body_house" ||this.name === "roof" ||this.name === "windows" ||this.name === "boards" ||this.name === "chimneys" ||this.name === "stairs" ||this.name === "gutters" ||this.name === "parapet" ||this.name === "barrels" ||this.name === "fundametnts"){
                intersects[ 0 ].object.material.color.setHex( color );
            }

            if(this.name === "cube")
            {                
                if (video.paused) {
                 video.play(); 
                }
                else { 
                video.pause(); 
                 } 
            }
            
            if(this.name === "torusKnot")
            {                
                if (audio.paused) {
                 audio.play(); 
                }
                else { 
                audio.pause(); 
                 } 
            }
                             
            $( ".text" ).empty();
            $( ".popup" ).append( "<div class='text'><p>This is the color <strong>#" + this.temp + "</strong> and the name assigned in Blender is <strong>" + this.name  + "</strong></p></div>" );
            $(".popup").show();
                              
        }
        
    }    
    function render() {	

        torusKnot.material.color.setRGB(frequencyData[torusKnot.id]/255,0,0);
        torusKnot.rotation.x += frequencyData[50]/1000;
        torusKnot.rotation.y = frequencyData[torusKnot.id]/50;
        torusKnot.rotation.z += frequencyData[torusKnot.id]/17;
        
        analyser.getByteFrequencyData(frequencyData); 
                 
	if ( video.readyState === video.HAVE_ENOUGH_DATA ) 
	{
            videoImageContext.drawImage( video, 0, 0 );
            if ( videoTexture ) 
		videoTexture.needsUpdate = true;
	}       
            cube.rotation.x += guiControls.rotationX;
            cube.rotation.y += guiControls.rotationY;
            cube.rotation.z += guiControls.rotationZ;
        
            spotLight.position.x = guiControls.lightX;
            spotLight.position.y = guiControls.lightY;
            spotLight.position.z = guiControls.lightZ;
	}
	
    function animate(){
	requestAnimationFrame(animate);
	render();
	stats.update();		
	renderer.render(scene, camera);
	}
    
    init();
    animate();
    //console.log(scene);
    console.log(objects);
    
    $(window).resize(function(){
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;
        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    });
    
});	