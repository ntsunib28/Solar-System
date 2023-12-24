import * as THREE from './Three JS/build/three.module.js'
import { OrbitControls } from './Three JS/examples/jsm/controls/OrbitControls.js'

const aspect = window.innerWidth / window.innerHeight
const cam = new THREE.PerspectiveCamera(70,aspect,1,1000)
cam.position.set(0, 0, 20)
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

function createPlanet(map, size, x) {
    const texture = new THREE.TextureLoader().load(map)
    const geo = new THREE.SphereGeometry(size, 30, 30)
    const mat = new THREE.MeshStandardMaterial({
        map: texture
    })
    const mesh = new THREE.Mesh(geo, mat)
    scene.add(mesh)
    mesh.position.x = x

    return {mesh: mesh}
}

const uranus = createPlanet("./assets/uranus.jpg", 6, 0);

function render() {
    uranus.mesh.rotateY(0.002)
    uranus.mesh.rotateX(0.0002)
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
}

init()