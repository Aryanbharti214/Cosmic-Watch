import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function Asteroid3D({ asteroids }) {
  const mountRef = useRef(null)

  const sceneRef = useRef()
  const cameraRef = useRef()
  const rendererRef = useRef()
  const controlsRef = useRef()
  const animationRef = useRef()

  const earthRef = useRef()
  const asteroidObjectsRef = useRef([])
  const orbitRingsRef = useRef([])

  const speedRef = useRef(1)
  const pauseRef = useRef(false)

  const [speed, setSpeed] = useState(1)
  const [isPaused, setIsPaused] = useState(false)
  const [hovered, setHovered] = useState(null)
  const [selectedId, setSelectedId] = useState("")

  useEffect(() => { speedRef.current = speed }, [speed])
  useEffect(() => { pauseRef.current = isPaused }, [isPaused])

  /* ================= INITIALIZE SCENE ================= */

  useEffect(() => {
    if (!mountRef.current) return

    const width = mountRef.current.clientWidth
    const height = 650

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 3000)
    camera.position.set(0, 40, 120)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.target.set(0, 0, 0)
    controls.update()
    controlsRef.current = controls

    /* LIGHTING */
    scene.add(new THREE.AmbientLight(0xffffff, 1.3))

    const light = new THREE.PointLight(0xffffff, 3)
    light.position.set(50, 50, 50)
    scene.add(light)

    /* STARS */
    const starGeo = new THREE.BufferGeometry()
    const starVertices = []

    for (let i = 0; i < 5000; i++) {
      starVertices.push(
        THREE.MathUtils.randFloatSpread(2000),
        THREE.MathUtils.randFloatSpread(2000),
        THREE.MathUtils.randFloatSpread(2000)
      )
    }

    starGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starVertices, 3)
    )

    scene.add(
      new THREE.Points(
        starGeo,
        new THREE.PointsMaterial({ color: 0xffffff })
      )
    )

    /* EARTH */
    const loader = new THREE.TextureLoader()

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(15, 64, 64),
      new THREE.MeshStandardMaterial({
        roughness: 1,
        metalness: 0
      })
    )

    scene.add(earth)
    earthRef.current = earth

    loader.load("/textures/earth.jpg", texture => {
      texture.colorSpace = THREE.SRGBColorSpace
      earth.material.map = texture
      earth.material.needsUpdate = true
    })

    /* RAYCASTER */
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onMouseMove = event => {
      const rect = renderer.domElement.getBoundingClientRect()

      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)

      const intersects = raycaster.intersectObjects(
        asteroidObjectsRef.current
      )

      asteroidObjectsRef.current.forEach(obj => {
        obj.material.emissive.setHex(0x000000)
      })

      if (intersects.length > 0) {
        const obj = intersects[0].object
        obj.material.emissive.setHex(0x444444)
        setHovered(obj.userData.asteroid)
      } else {
        setHovered(null)
      }
    }

    renderer.domElement.addEventListener("mousemove", onMouseMove)

    /* ANIMATION */
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)

      if (!pauseRef.current && earthRef.current) {
        earthRef.current.rotation.y += 0.002 * speedRef.current

        asteroidObjectsRef.current.forEach(obj => {
          obj.userData.angle += obj.userData.baseSpeed * speedRef.current

          const { distance, inclination } = obj.userData

          obj.position.x =
            Math.cos(obj.userData.angle) * distance
          obj.position.z =
            Math.sin(obj.userData.angle) * distance
          obj.position.y =
            Math.sin(obj.userData.angle) * inclination
        })
      }

      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationRef.current)
      renderer.dispose()
    }
  }, [])

  /* ================= BUILD ASTEROIDS ================= */

  useEffect(() => {
    if (!sceneRef.current) return

    const scene = sceneRef.current

    asteroidObjectsRef.current.forEach(obj => scene.remove(obj))
    orbitRingsRef.current.forEach(ring => scene.remove(ring))

    asteroidObjectsRef.current = []
    orbitRingsRef.current = []

    const visibleAsteroids = selectedId
      ? asteroids.filter(a => a.id === selectedId)
      : asteroids.slice(0, 20)

    visibleAsteroids.forEach((a, index) => {
      const distance = 40 + index * 10
      const inclination = Math.random() * 8

      /* ORBIT */
      const orbit = new THREE.Mesh(
        new THREE.RingGeometry(distance - 0.3, distance + 0.3, 128),
        new THREE.MeshBasicMaterial({
          color: 0x444444,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.4
        })
      )

      orbit.rotation.x = Math.PI / 2
      scene.add(orbit)
      orbitRingsRef.current.push(orbit)

      /* ASTEROID */
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(3, 32, 32),
        new THREE.MeshStandardMaterial({
          color: a.is_potentially_hazardous_asteroid
            ? 0xff4444
            : 0x00ffaa,
          emissive: 0x000000
        })
      )

      mesh.userData = {
        angle: Math.random() * Math.PI * 2,
        distance,
        baseSpeed: 0.0005 + Math.random() * 0.001,
        inclination,
        asteroid: a
      }

      scene.add(mesh)
      asteroidObjectsRef.current.push(mesh)
    })
  }, [asteroids, selectedId])

  const selectedAsteroid = asteroids.find(a => a.id === selectedId)

  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="relative rounded-3xl border border-purple-700 overflow-hidden shadow-xl">

        {/* CONTROLS */}
        <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-xl border border-purple-600 p-4 rounded-2xl space-y-3 text-sm">

          <button
            onClick={() => setIsPaused(prev => !prev)}
            className="bg-purple-600 px-4 py-1 rounded-lg"
          >
            {isPaused ? "▶ Play" : "⏸ Pause"}
          </button>

          <div>
            <label className="text-xs">Speed</label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={speed}
              onChange={e => setSpeed(parseFloat(e.target.value))}
            />
            <div className="text-purple-400 text-xs">
              {speed.toFixed(1)}x
            </div>
          </div>

          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            className="bg-black border border-purple-600 rounded px-2 py-1 w-full"
          >
            <option value="">Select Asteroid</option>
            {asteroids.slice(0, 20).map(a => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>

        </div>

        {/* HOVER DETAILS */}
        {hovered && (
          <div className="absolute top-4 right-4 bg-black/80 border border-purple-600 p-4 rounded-xl text-sm w-72">
            <p className="text-purple-400 font-semibold">
              {hovered.name}
            </p>
            <p>ID: {hovered.id}</p>

            <p>
              Velocity:{" "}
              {hovered.close_approach_data?.[0]?.relative_velocity
                ?.kilometers_per_hour
                ? parseFloat(
                    hovered.close_approach_data[0]
                      .relative_velocity.kilometers_per_hour
                  ).toLocaleString()
                : "230.01"} km/h
            </p>

            <p>
              Miss Distance:{" "}
              {hovered.close_approach_data?.[0]?.miss_distance
                ?.kilometers
                ? parseFloat(
                    hovered.close_approach_data[0]
                      .miss_distance.kilometers
                  ).toLocaleString()
                : "780"} km
            </p>

            <p
              className={
                hovered.is_potentially_hazardous_asteroid
                  ? "text-red-400"
                  : "text-green-400"
              }
            >
              {hovered.is_potentially_hazardous_asteroid
                ? "Hazardous"
                : "Safe"}
            </p>
          </div>
        )}

        <div ref={mountRef} className="w-full h-[650px]" />
      </div>
    </div>
  )
}
