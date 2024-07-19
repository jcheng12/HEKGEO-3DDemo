import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { XYZLoader } from 'three/addons/loaders/XYZLoader.js';
import { PCDLoader } from 'three/addons/loaders/PCDLoader.js';
import GUI from 'lil-gui';

let camera, scene, renderer;

const demoJson = {
  "data": [{
    "name": "Test1",
    "color": 0xFF0000,
    "points": [
      { "vertex": [1,1,1] },
      { "vertex": [2,2,2] },
      { "vertex": [3,3,3] }
    ],
    "points_list": [2,2,2,3,3,3]
  },{
    "name": "Test2",
    "color": 0x00FF00,
    "points": [
      { "vertex": [-1,-1,-1] },
      { "vertex": [-2,-2,-2] },
      { "vertex": [-3,-3,-3] }
    ]
  }]
}

init();

function init() {
  // Fetch the example json (Right now it's local but it's same procedure for server)
  // fetch('./models/demo.json')
  //   .then(response => response.json())
  //   .then(json => console.log(json))
  //   .catch(console.log('JSON does not exist!'))

  scene = new THREE.Scene();

  // GUI
  let params = { ellipseColor: 0xFF0000 }
  const gui = new GUI();
  gui.title ('Colors')
  gui.addColor(params, 'ellipseColor').onChange(()=>{ellipse.material.color.set(params.ellipseColor)}) 
  
  // Initialization
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  document.body.appendChild(renderer.domElement);
  THREE.Object3D.DEFAULT_UP.set(0, 0, 1);

  // camera
  camera = new THREE.PerspectiveCamera(40,window.innerWidth / window.innerHeight,1,1000);
  camera.position.set(15, 20, 30);
  scene.add(camera);

  // Camera Controls and Render Settings
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 20;
  controls.maxDistance = 100;
  controls.maxPolarAngle = Math.PI / 2;

  // Lighting
  scene.add(new THREE.AmbientLight(0x666666));
  const light = new THREE.PointLight(0xffffff, 3, 0, 0);
  camera.add(light);

  // Axis (Now with arrow heads)
  // scene.add(new THREE.AxesHelper(10));
  let arrowPos = new THREE.Vector3( 0,0,0 );
  scene.add( new THREE.ArrowHelper( new THREE.Vector3( 1,0,0 ), arrowPos, 10, 0xFF2020, 1, 0.5 ) );
  scene.add( new THREE.ArrowHelper( new THREE.Vector3( 0,1,0 ), arrowPos, 10, 0x00FF00, 1, 0.5 ) );
  scene.add( new THREE.ArrowHelper( new THREE.Vector3( 0,0,1 ), arrowPos, 10, 0x0000FF, 1, 0.5 ) );

  // Sphere
  const sphereGeometry = new THREE.SphereGeometry( 0.5, 20, 10 );
  const sphereMaterial = new THREE.MeshPhongMaterial( { color: 'rgb(255,255,255)', emissive: 0x222222 } );
  let sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
  sphere.position.set( 0, 0, 0);
  scene.add(sphere);

  // Ellipse (Example)
  const curve = new THREE.EllipseCurve(
    -30,  0,            // ax, aY
    40, 20,           // xRadius, yRadius
    0,  2 * Math.PI,  // aStartAngle, aEndAngle
    false,            // aClockwise
    0                 // aRotation
  );
  const ellipsePoints = curve.getPoints( 100 );
  const ellipseGeometry = new THREE.BufferGeometry().setFromPoints( ellipsePoints );
  const ellipseMaterial = new THREE.LineBasicMaterial( { color: params.ellipseColor } );
  const ellipse = new THREE.Line( ellipseGeometry, ellipseMaterial );
  scene.add(ellipse)

  // Points (XYZ)
  // let points
  // const loader = new XYZLoader();
  // loader.load( 'models/points.xyz', function (geometry) {
  //   geometry.center();
  //   const vertexColors = ( geometry.hasAttribute( 'color' ) === true );
  //   const material = new THREE.PointsMaterial( { size: 0.1, vertexColors: vertexColors } );
  //   points = new THREE.Points( geometry, material );
  //   scene.add(points);
  // } );

  // Points (PCD)
  // const loader = new PCDLoader();
  // loader.load( './models/simple.pcd', function ( points ) {
  //   points.geometry.center();
  //   points.geometry.rotateX( Math.PI );
  //   points.name = 'simple.pcd';
  //   points.material = new THREE.PointsMaterial( { size: 0.1, vertexColors: 0xFF0000 } );
  //   scene.add( points );
  // });

  // Points (Buffer load from JSON object)
  Object.values(demoJson.data).forEach((demoJsonObj) => {
    let demoPos = []
    demoJsonObj.points.map((v)=>{demoPos.push(v.vertex[0], v.vertex[1], v.vertex[2])})
    const demoGeometry = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(demoPos, 3))
    const demoMaterial = new THREE.PointsMaterial({color: demoJsonObj.color})
    const demoPoints = new THREE.Points(demoGeometry, demoMaterial)
    scene.add (demoPoints)
  })

  // Resize Scene
  window.addEventListener("resize", onWindowResize);
}

// Window Resize Helper
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Render Loop
function animate() {
  renderer.render(scene, camera);
}