import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {MeshSurfaceSampler} from 'three/examples/jsm/math/MeshSurfaceSampler'

// Create an empty, needed for the renderer
const scene = new THREE.Scene();
// Create a camera and translate it
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 1.5);

// Create a WebGL renderer and enable the antialias effect
const renderer = new THREE.WebGLRenderer({ antialias: true });
// Define the size and append the <canvas> in our document
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add OrbitControls to allow the user to move in the scene
const controls = new OrbitControls(camera, renderer.domElement);

const group = new THREE.Group();
scene.add(group);

// Create a cube with basic geometry & material
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0x66ccff,
  wireframe: true
});
const cube = new THREE.Mesh(geometry, material);
group.add(cube);

// Instantiate a sampler so we can use it later
const sampler = new MeshSurfaceSampler(cube).build();

// Define the basic geometry of the spheres
const sphereGeometry = new THREE.SphereGeometry(0.05, 6, 6);
// Define the basic material of the spheres
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: 0xffa0e6
});
const spheres = new THREE.InstancedMesh(sphereGeometry, sphereMaterial, 300);
group.add(spheres);

// Create a dummy Vector to store the sampled coordinates
const tempPosition = new THREE.Vector3();
// Create a dummy 3D object to generate the Matrix of each sphere
const tempObject = new THREE.Object3D();
// Loop as many spheres we have
for (let i = 0; i < 300; i++) {
  // Sample a random point on the surface of the cube
  sampler.sample(tempPosition);
  // Store that point coordinates in the dummy object
  tempObject.position.set(tempPosition.x, tempPosition.y, tempPosition.z);
  // Define a random scale
  tempObject.scale.setScalar(Math.random() * 0.5 + 0.5);
  // Update the matrix of the object
  tempObject.updateMatrix();
  // Insert the object udpated matrix into our InstancedMesh Matrix
  spheres.setMatrixAt(i, tempObject.matrix);
}

/// Render the scene on each frame
function render () {  
  // Rotate the cube a little on each frame
  group.rotation.y += 0.01;
  
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(render);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);