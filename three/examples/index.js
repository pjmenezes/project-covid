import * as THREE from "../build/three.module.js";
/*  */
let camera, scene, renderer, sphere, clock;


init();
animate();

function init() {
  let container = document.getElementById("container");

  clock = new THREE.Clock();

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x101010);

  let light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  scene.add(camera);

  // Create the panoramic sphere geometery
  let panoSphereGeo = new THREE.SphereBufferGeometry(6, 256, 256);

  // Create the panoramic sphere material
  let panoSphereMat = new THREE.MeshStandardMaterial({
    side: THREE.BackSide,
    displacementScale: -4.0
  });

  sphere = new THREE.Mesh(panoSphereGeo, panoSphereMat);

  // Load and assign the texture and depth map
  let manager = new THREE.LoadingManager();
  let loader = new THREE.TextureLoader(manager);

  loader.load(
    "https://cdn.glitch.com/48664c52-5883-4696-9f8c-4527b79e49d2%2Fvirus-4937553.jpg?v=1590786816007",
    function(texture) {
      texture.minFilter = THREE.NearestFilter;
      texture.generateMipmaps = false;
      sphere.material.map = texture;
    }
  );

  manager.onLoad = function() {
    scene.add(sphere);
  };

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType("local");
  container.appendChild(renderer.domElement);

  /*      document.body.appendChild(VRButton.createButton(renderer)); */
  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
  renderer.setAnimationLoop(render);
}

function render() {
  if (renderer.xr.isPresenting === false) {
    let time = clock.getElapsedTime();

    sphere.rotation.y += 0.001;
    sphere.position.x = Math.sin(time) * 0.2;
    sphere.position.z = Math.cos(time) * 0.2;
  }

  renderer.render(scene, camera);
}
