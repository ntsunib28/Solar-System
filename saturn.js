import * as THREE from './Three JS/build/three.module.js'

const aspect = window.innerWidth / window.innerHeight
const cam = new THREE.PerspectiveCamera(70,aspect,1,1000)
cam.position.set(0, 0, 20)
cam.lookAt(0,0,0)

const scene = new THREE.Scene()
scene.background = textureLoader.load("./assets/stars_milky_way.jpg")
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(innerWidth,innerHeight)
document.body.appendChild(renderer.domElement)

const ambientLight = new THREE.AmbientLight('white',1)
scene.add(ambientLight);

const textureLoader = new THREE.TextureLoader()

function createPlanet(map, size, x, ring) {
    const texture = textureLoader.load(map)
    const geo = new THREE.SphereGeometry(size, 30, 30)
    const mat = new THREE.MeshStandardMaterial({
        map: texture
    })
    const mesh = new THREE.Mesh(geo, mat)
    const obj = new THREE.Object3D()
    obj.add(mesh)

    if (ring) {
        const ringGeo = new THREE.RingGeometry(
            ring.innerRadius,
            ring.outerRadius,
            32);
        const ringMat = new THREE.MeshStandardMaterial({
            map: textureLoader.load(ring.texture),
            side: THREE.DoubleSide
        });
        ringMat.transparent = true;
        ringMat.blending = THREE.AdditiveBlending;
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        obj.add(ringMesh);
        ringMesh.position.set(0, 0, 0);
        ringMesh.rotation.x = -0.501 * Math.PI
    }
    mesh.position.x = x
    scene.add(obj)

    return { mesh: mesh, obj: obj }
}

const saturn = createPlanet("./assets/saturn.jpg", 6, 0, {
    innerRadius: 10,
    outerRadius: 15,
    texture: "./assets/saturn_ring.png"
})

function render() {
    saturn.mesh.rotateY(0.002)
    saturn.mesh.rotateX(0.0002)
    renderer.render(scene, cam)
}

renderer.setAnimationLoop(render)

function init(){
    render()
}

init()