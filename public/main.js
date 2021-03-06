var scene, camera, canvas, context, renderer, light;
var clock, ambient, geometry, material, sphere;
var mouseX = 0,
  mouseY = 0;


function init() {
  // Update text in case a pull/get random code request has been made
  document.getElementById('code_text').value = frag_code;

  // set up scene
  scene = new THREE.Scene();
  clock = new THREE.Clock();
  scene.background = new THREE.Color('#cce6ff');

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 4;

  // create a lighting source:
  // var spotLight = new THREE.SpotLight(0xff0000);
  // spotLight.position.set(0, 100, 1);
  // spotLight.castShadow = true;
  // scene.add(spotLight);

  // create geometry; diam is based on num users in the room
  let diam = 1.25 + nusers * 0.1;
  geometry = new THREE.SphereGeometry(diam, 32, 32);
  // console.log(diam);

  // declare uniform and set on materials:
  uniform1 = {
    time: { value: 1.0 },
    mouse: { value: new Three.Vector2(0,0)},
    resolution: { value: new THREE.Vector2(window.innerWidth,window.innerHeight)}
  };

  material = new THREE.ShaderMaterial({
    uniforms: uniform1,
    fog: true,
    vertexShader: document.getElementById('vs').textContent.trim(),
    fragmentShader: frag_code,
  });
  sphere = new THREE.Mesh(geometry, material);
  sphere.castShadow = true; //default is false
  sphere.receiveShadow = false; //default

  scene.add(sphere);
}

function createRend() {
  //create webGL renderer
  canvas = document.createElement('canvas');
  context = canvas.getContext('webgl2', { alpha: false });
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    context: context,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  render();
}

function render() {
  var delta = clock.getDelta();
  uniform1['time'].value += delta * 5;

}

// Resizes canvas
window.addEventListener('resize', onResize, false);
function onResize() {
  uniform1['resolution'].value = new THREE.Vector2(window.innerWidth,window.innerHeight)

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('mousemove', event=>{
  mouseX = event.clientX;
  mouseY = event.clientY;

  uniform1['mouse'].value = new THREE.Vector2(mouseX, mouseY);
})

init();
createRend();
animate();
