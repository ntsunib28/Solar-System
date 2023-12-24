import * as THREE from './Three JS/build/three.module.js'
import { OrbitControls } from './Three JS/examples/jsm/controls/OrbitControls.js'

const aspect = window.innerWidth / window.innerHeight
const cam = new THREE.PerspectiveCamera(70,aspect,1,1000)
cam.position.set(-18, 28, 28)
cam.lookAt(0,0,0)

const scene = new THREE.Scene()
scene.background = new THREE.TextureLoader().load("./assets/stars_milky_way.jpg")
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(innerWidth,innerHeight)
let controls
controls = new OrbitControls(cam, renderer.domElement)
controls.enableZoom = false
controls.update()
document.body.appendChild(renderer.domElement)

const ambientLight = new THREE.AmbientLight('white',1)
scene.add(ambientLight);

function createPlanet(map, size, x, planetName) {
    const texture = new THREE.TextureLoader().load(map)
    const geo = new THREE.SphereGeometry(size, 30, 30)
    const mat = new THREE.MeshStandardMaterial({
        map: texture
    })
    const mesh = new THREE.Mesh(geo, mat)
    scene.add(mesh)
    const obj = new THREE.Object3D()
    obj.add(mesh)

    mesh.position.x = x
    mesh.name = planetName

    scene.add(obj)

    return { mesh: mesh, obj: obj }
}

const mars = createPlanet("./assets/mars.jpg", 6, 0, 'Mars');

function createSatelite(size, x, y, z, map) {
    const sateliteTexture = new THREE.TextureLoader().load(map)
    const sateliteGeo = new THREE.SphereGeometry(size, 30, 30)
    const sateliteMat = new THREE.MeshStandardMaterial({
        map: sateliteTexture
    })
    const sateliteMesh = new THREE.Mesh(sateliteGeo, sateliteMat)
    scene.add(sateliteMesh)
    const sateliteObj = new THREE.Object3D()
    sateliteObj.add(sateliteMesh)

    sateliteMesh.position.set(x, y, z)
    mars.obj.add(sateliteObj)

    return { mesh: sateliteMesh, obj: sateliteObj }
}

const deimos = createSatelite(1, 15, 0, 0, './assets/deimos.jpg');
const phobos = createSatelite(1, 10, 0, 0, '/assets/phobos.jpg');

function render() {
    mars.mesh.rotateY(0.002)
    mars.mesh.rotateX(0.0002)

    deimos.mesh.rotateY(-0.001)
    deimos.mesh.rotateX(0.0005)
    deimos.obj.rotateY(0.001)

    phobos.mesh.rotateY(0.001)
    phobos.mesh.rotateX(-0.0005)
    phobos.obj.rotateY(0.002)
    renderer.render(scene, cam)
}

renderer.setAnimationLoop(render)

function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight)
    cam.aspect = window.innerWidth / window.innerHeight
    cam.updateProjectionMatrix()
}
window.addEventListener("resize", resize)

function init(){
    render()
    resize()
    document.getElementById('backBtn').addEventListener('click', function() {
        window.location.href = '/index.html';
    });
}

init()