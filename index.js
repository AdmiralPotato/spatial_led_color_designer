const canvas = document.getElementById('eyyyyy')
const renderer = new THREE.WebGLRenderer({
	canvas,
	alpha: true,
	antialias: true
})
const camera = new THREE.PerspectiveCamera(
	45,
	window.innerWidth / window.innerHeight,
	0.1,
	10000
)
const scene = new THREE.Scene()

const directionalLight = new THREE.DirectionalLight(0xffffff, .5)
directionalLight.position.set(-2, 2, 2)
directionalLight.castShadow = true
scene.add(directionalLight)

const light = new THREE.HemisphereLight( 0xcefeff, 0xb3eaf0, .5 )
scene.add( light )
scene.fog = new THREE.Fog('#262626', 7, 9)

camera.position.set(8, 0, 0)
camera.lookAt(new THREE.Vector3(0,0,0))
camera.rotation.z = Math.PI


let width
let height
let square
let center = new THREE.Vector2()
const deg = Math.PI / 180
const resize = () => {
	const clientWidth = canvas.clientWidth
	const clientHeight = canvas.clientHeight
	const dpr = window.devicePixelRatio
	width = clientWidth * dpr
	height = clientHeight * dpr
	square = Math.min(width, height)
	if (
		canvas.width !== width ||
		canvas.height !== height
	) {
		const aspect = width / height
		const desiredMinimumFov = Math.PI / 4 //90 deg
		// this ensures that I always have a 90deg square in the center of both landscape and portrait viewports
		camera.fov = (
			aspect >= 1 ? desiredMinimumFov : 2 * Math.atan(Math.tan(desiredMinimumFov / 2) / aspect)
		) / deg
		camera.aspect = aspect
		camera.updateProjectionMatrix()
		renderer.setPixelRatio(dpr)
		renderer.setSize(
			clientWidth,
			clientHeight,
			false
		)
		center.set(width / 2, height / 2)
	}
}

let geometry = new THREE.SphereGeometry( 0.05, 4, 2)
let material = new THREE.MeshBasicMaterial( { color: 0xffff00 } )
const sphere = new THREE.Mesh( geometry, material )
sphere.position.set(1,0,0)
const group = new THREE.Group()
scene.add(group)
group.add(sphere)

let vertProcessingFunction = null
let go = true
const loop = (time) => {
	if (go) {
		requestAnimationFrame(loop)
		resize()
		group.rotation.set(0, 0, time * 0.001)
		if (vertProcessingFunction) {
			group.children.forEach((mesh) => {
				mesh.material.color.fromArray(vertProcessingFunction({
					position: mesh.position,
					time: time * 0.001,
				}))
			})
		}
		renderer.render(scene, camera)
	}
}
requestAnimationFrame(loop)


const app = Vue.createApp({
	data () {
		return {
			verts: [],
			file: null,
			equation: `return [
  Math.cos(((position.z + position.y) * 1) + (time * 4)) * 0.5 + 0.5,
  0,
  Math.cos(((position.x + position.y) * 0.5) + (time * 2)) * 0.5 + 0.5
]`,
		}
	},
	computed: {
		vertCount () {
			return this.verts.length
		},
	},
	methods: {
		setFile (event) {
			const file = event.target.files[0]
			file.text().then(this.processObjText)
		},
		processObjText (text) {
			geometry = new THREE.SphereGeometry( 1, 4, 2 )
			// ...is this really the best way to empty the group?
			group.children = []
			this.verts = []
			const lines = text.replace(/\r/g, '').split('\n')
			lines.forEach((line) => {
				const segments = line.split(' ')
				if (segments[0] === 'v') {
					const vert = [
						segments[1] * 1,
						segments[2] * 1,
						segments[3] * 1
					]
					this.verts.push(vert)
					// a unique material per object because that's the easiest way for each shape to have its own color
					material = new THREE.MeshBasicMaterial( { color: 0xffff00 } )
					const sphere = new THREE.Mesh( geometry, material )
					sphere.position.set(vert[0], vert[1], vert[2])
					group.add(sphere)
				}
			})
			const min = this.verts[0].slice()
			const max = this.verts[0].slice()
			this.verts.forEach((vert) => {
				min[0] = Math.min(min[0], vert[0])
				min[1] = Math.min(min[1], vert[1])
				min[2] = Math.min(min[2], vert[2])
				max[0] = Math.max(max[0], vert[0])
				max[1] = Math.max(max[1], vert[1])
				max[2] = Math.max(max[2], vert[2])
			})
			const scale = 2 / Math.max(
				Math.abs(min[0]),
				Math.abs(min[1]),
				Math.abs(min[2]),
				Math.abs(max[0]),
				Math.abs(max[1]),
				Math.abs(max[2])
			)
			const vertScale = 1 / scale / 20
			geometry.scale(vertScale, vertScale, vertScale)
			group.scale.set(scale, scale, scale)
		},
		handleSubmit () {
			console.log(this.file)
		},
		submitEquation () {
			try {
				vertProcessingFunction = new Function('config', `
					const { position, time } = config
					${this.equation}
				`)
			} catch (e) {
				vertProcessingFunction = null
				console.error(e)
			}
		}
	}
})

const appComponent = app.mount('#controls')

// add goat
appComponent.processObjText(window.defaultShape)
appComponent.submitEquation()

// TODO: Add https://www.theatrejs.com/ for timeline control or something
