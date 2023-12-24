import * as THREE from './Three JS/build/three.module.js'

const aspect = window.innerWidth / window.innerHeight
const cam = new THREE.PerspectiveCamera(70,aspect,1,1000)
cam.position.set(-18, 28, 40)
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
    innerRadius: 7,
    outerRadius: 10,
    texture: "./assets/saturn_ring.png"
})

function createSatelite(map, x, y, z, size) {
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
    saturn.obj.add(sateliteObj)

    return { mesh: sateliteMesh, obj: sateliteObj }
}

const titan = createSatelite('./assets/titan.jpg', 10, 0, 0, 2);
const rhea = createSatelite('./assets/rhea.jpg', 15, 0, 0, 2);
const iapetus = createSatelite('./assets/iapetus.jpg', 20, 0, 0, 2);
const dione = createSatelite('./assets/dione.jpg', 25, 0, 0, 2);
const tethys = createSatelite('./assets/tethys.jpg', 30, 0, 0, 2);
const marsMimas = createSatelite('./assets/mimas.jpg', 35, 0, 0, 0.362);
const marsEnceladus = createSatelite('./assets/enceladus.jpg', 40, 0, 0, 0.526);
const marsHyperion = createSatelite('./assets/hyperion.jpg', 45, 0, 0, 0.798);

function render() {
    saturn.mesh.rotateY(0.002)
    saturn.mesh.rotateX(0.0002)

    titan.mesh.rotateY(-0.001)
    titan.mesh.rotateX(0.0005)
    titan.obj.rotateY(0.008)

    rhea.mesh.rotateY(-0.001)
    rhea.mesh.rotateX(0.0005)
    rhea.obj.rotateY(0.006)

    iapetus.mesh.rotateY(-0.001)
    iapetus.mesh.rotateX(0.0005)
    iapetus.obj.rotateY(0.005)

    dione.mesh.rotateY(-0.001)
    dione.mesh.rotateX(0.0005)
    dione.obj.rotateY(0.003)

    tethys.mesh.rotateY(-0.001)
    tethys.mesh.rotateX(0.0005)
    tethys.obj.rotateY(0.002)

    marsMimas.mesh.rotateY(-0.001)
    marsMimas.mesh.rotateX(0.0005)
    marsMimas.obj.rotateY(0.001)

    marsEnceladus.mesh.rotateY(-0.001)
    marsEnceladus.mesh.rotateX(0.0005)
    marsEnceladus.obj.rotateY(0.0009)

    marsHyperion.mesh.rotateY(-0.001)
    marsHyperion.mesh.rotateX(0.0005)
    marsHyperion.obj.rotateY(0.0008)

    renderer.render(scene, cam)
}

renderer.setAnimationLoop(render)

function init(){
    render()
}

init()