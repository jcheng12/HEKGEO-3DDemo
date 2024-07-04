import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let camera, scene, renderer;

init();

function init() {
  scene = new THREE.Scene();

  // Initialization
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  document.body.appendChild(renderer.domElement);

  // camera
  camera = new THREE.PerspectiveCamera(40,window.innerWidth / window.innerHeight,1,1000);
  camera.position.set(15, 20, 30);
  scene.add(camera);

  // Camera Controls and Render Settings
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 20;
  controls.maxDistance = 50;
  controls.maxPolarAngle = Math.PI / 2;

  // Lighting
  scene.add(new THREE.AmbientLight(0x666666));
  const light = new THREE.PointLight(0xffffff, 3, 0, 0);
  camera.add(light);

  // Axis
  scene.add(new THREE.AxesHelper(10));
  const sphereGeometry = new THREE.SphereGeometry( 3.0, 20, 10 );
  const sphereMaterial = new THREE.MeshPhongMaterial( { color: 'rgb(255,255,255)', emissive: 0x222222 } );
  let sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
  sphere.position.set( 0, 0, 0);
  scene.add( sphere );

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
