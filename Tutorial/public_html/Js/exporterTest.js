var scene, camera, renderer;

var WIDTH  = window.innerWidth;
var HEIGHT = window.innerHeight;

var SPEED = 0.01;

function init() {
    scene = new THREE.Scene();

    //initMesh();
    initScene();
    initCamera();
    initLights();
    initRenderer();

    document.body.appendChild(renderer.domElement);
}

function initCamera() {
    camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 10);
    camera.position.set(0, 3.5, 5);
    camera.lookAt(scene.position);
}


function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
}

function initLights() {
    var light = new THREE.AmbientLight(0xffffff);
    scene.add(light);
}

function initScene(){
        var loader = new THREE.ObjectLoader();
    loader.load('./models/Tiger.json', function(obj){
        scene.add(obj);
    });
}

var mesh = null;
function initMesh() {
    

    var loader = new THREE.JSONLoader();
    loader.load('./models/marmelab.json', function(geometry, materials) {
        mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.75;
        mesh.translation = THREE.GeometryUtils.center(geometry);
       // mesh.translation = THREE.geometry.center();
        scene.add(mesh);
    });
}

function rotateMesh() {
    if (!mesh) {
        return;
    }

    mesh.rotation.x -= SPEED * 2;
    mesh.rotation.y -= SPEED;
    mesh.rotation.z -= SPEED * 3;
}

function rotateScene() {
    if (!obj) {
        return;
    }

   obj.rotation.x -= SPEED * 2;
    obj.rotation.y -= SPEED;
    obj.rotation.z -= SPEED * 3;
}

function render() {
    requestAnimationFrame(render);
   // rotateMesh();
   // rotateScene();
    renderer.render(scene, camera);
   
}

init();
render();