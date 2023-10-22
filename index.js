import * as THREE from './Three JS/build/three.module.js'
import {OrbitControls} from './Three JS/examples/jsm/controls/OrbitControls.js'

let scene, camera1, camera2, currentCam, renderer
let sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune
const textureLoader = new THREE.TextureLoader()
let solarSystem = new THREE.Group()

function init() {
    scene = new THREE.Scene()
    scene.background = textureLoader.load("./assets/stars_milky_way.jpg")

    const fov = 45
    const width = window.innerWidth
    const height = window.innerHeight
    const aspect = width / height

    camera1 = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000)
    camera2 = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000)
   
    camera1.position.set(0,20,70)
    camera1.lookAt(0,0,0)

    camera2.position.set(0,20,70)
    camera2.lookAt(0,0,0)

    currentCam = camera1

    renderer = new THREE.WebGLRenderer({antialias: true})

    const controls = new OrbitControls(camera1, renderer.domElement)

    document.body.appendChild(renderer.domElement)
}

function createPlanet(map, radius, widthSegment, heightSegment, x, y, z){
    const texture = textureLoader.load(map)
    const geo = new THREE.SphereGeometry(radius, widthSegment, heightSegment)
    const mat = new THREE.MeshBasicMaterial({
        map: texture
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.position.set(x,y,z)

    mesh.userData = { isClickable: true }

    return mesh
}

function createRing(map, innerRadius, outerRadius, thetaSegment, x, y, z) {
    const texture = textureLoader.load(map)
    const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegment);
    const ringMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotateZ = Math.PI/4
    ring.position.set(x,y,z)
    scene.add(ring);
}

function render(){ 
    requestAnimationFrame(render)
    renderer.render(scene, currentCam)
}

let keyListener = event => {
    let keyCode = event.keyCode
    if(keyCode == 32){
        console.log("SPACE")
        if(currentCam == camera1) currentCam = camera2
        else currentCam = camera1
    }
    if(currentCam == camera2){
        if(keyCode == 87){
            //w
            currentCam.position.y += 2
        }else if(keyCode == 65){
            //a
            currentCam.position.x -= 2
        }else if(keyCode == 83){
            //s
            currentCam.position.y -= 2
        }else if(keyCode == 68){
            //d
            currentCam.position.x += 2
        }else if(keyCode == 189){
            //-(ZOOM OUT)
            currentCam.position.z += 2
        }else if(keyCode == 187){
            //=(ZOOM IN)
            currentCam.position.z -= 2
        }
    }
    
}

const EARTH_YEAR = 2 * Math.PI * (1 / 60) * (1 / 60);

function animateRotation() {
    sun.rotation.y += 0.001;
    mercury.rotation.y += EARTH_YEAR * 4;
    venus.rotation.y += EARTH_YEAR * 2;
    earth.rotation.y += EARTH_YEAR;
    mars.rotation.y += EARTH_YEAR * 0.5;
    jupiter.rotation.y += EARTH_YEAR * 4;
    saturn.rotation.y += EARTH_YEAR * 2;
    uranus.rotation.y += EARTH_YEAR;
    neptune.rotation.y += EARTH_YEAR * 0.5;

    requestAnimationFrame(animateRotation)
}

function solarSystemAdd() {
    solarSystem.add(sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune)
}

window.onload = () => {
    init()
    sun = createPlanet("./assets/sun.jpg", 8, 64, 64, 0, 0, 0)
    mercury = createPlanet("./assets/mercury.jpg", 2, 64, 64, 20, 0, 0)
    venus = createPlanet("./assets/venus.jpg", 3, 64, 64, 40, 0, 0)
    earth = createPlanet("./assets/earth.jpg", 4, 64, 64, 60, 0, 0)
    mars = createPlanet("./assets/mars.jpg", 3, 64, 64, 80, 0, 0)
    jupiter = createPlanet("./assets/jupiter.jpg", 4, 64, 64, 100, 0, 0)
    saturn = createPlanet("./assets/saturn.jpg", 3, 64, 64, 120, 0, 0)
    createRing("./assets/saturn_ring.png", 5, 5.05, 32, 120, 0, 0)
    uranus = createPlanet("./assets/uranus.jpg", 4, 64, 64, 140, 0, 0)
    neptune = createPlanet("./assets/neptune.jpg", 3, 64, 64, 160, 0, 0)

    solarSystemAdd()

    scene.add(solarSystem)

    animateRotation()

    document.addEventListener("keydown", keyListener)

    render()
    resize()
}

function resize(){
    renderer.setSize(window.innerWidth, window.innerHeight)
    currentCam.aspect = window.innerWidth / window.innerHeight
    currentCam.updateProjectionMatrix()
}

window.addEventListener("resize", resize)