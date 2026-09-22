import { useEffect, useRef } from "react"
import * as THREE from "three"
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js"

const COLORS = [
    "#e63946",
    "#457b9d",
    "#f4a261",
    "#2a9d8f",
    "#9b5de5",
    "#f15bb5",
    "#f2f1ed",
    "#222222",
]

function random(min: number, max: number) {
    return Math.random() * (max - min) + min
}

function createTaperedRoundedBox({
    width = 2,
    height = 0.6,
    depth = 2,
    radius = 0.2,
    segments = 6,
    topScale = 0.88,
}) {
    const geometry = new RoundedBoxGeometry(
        width,
        height,
        depth,
        segments,
        radius,
    )

    const positions = geometry.attributes.position

    const bottomY = -height / 2
    const topY = height / 2

    for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i)
        const y = positions.getY(i)
        const z = positions.getZ(i)

        const t = (y - bottomY) / (topY - bottomY)

        const scale = THREE.MathUtils.lerp(
            1,
            topScale,
            t,
        )

        positions.setX(i, x * scale)
        positions.setZ(i, z * scale)
    }

    positions.needsUpdate = true
    geometry.computeVertexNormals()

    return geometry
}

interface KeycapState {
    position: THREE.Vector3
    rotation: THREE.Euler
    spin: THREE.Vector3
    scale: number
}

export default function KeycapRain() {
    const mountRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const mount = mountRef.current

        if (!mount) return

        // =========================
        // SETTINGS
        // =========================

        const count = 10

        const spreadX = 14
        const spreadY = 16
        const spreadZ = 3

        const centerGap = 3
        const spacing = 3.5

        const fallSpeed = 0.5

        // Important performance setting
        const targetFPS = 30
        const frameInterval = 1000 / targetFPS


        // =========================
        // SCENE
        // =========================

        const scene = new THREE.Scene()

        const camera = new THREE.PerspectiveCamera(
            36,
            mount.clientWidth / mount.clientHeight,
            0.1,
            100,
        )

        camera.position.set(0, 0, 12)


        // =========================
        // RENDERER
        // =========================

        const renderer = new THREE.WebGLRenderer({
            antialias: false,
            alpha: true,
            powerPreference: "high-performance",
        })

        // Keep the background inexpensive
        renderer.setPixelRatio(1)

        renderer.setSize(
            mount.clientWidth,
            mount.clientHeight,
        )

        renderer.setClearColor(0xffffff, 0)

        renderer.outputColorSpace =
            THREE.SRGBColorSpace

        mount.appendChild(renderer.domElement)


        // =========================
        // LIGHTS
        // =========================

        const ambientLight =
            new THREE.AmbientLight(
                0xffffff,
                1.6,
            )

        const directionalLight =
            new THREE.DirectionalLight(
                0xffffff,
                1.5,
            )

        directionalLight.position.set(
            3,
            5,
            4,
        )

        scene.add(
            ambientLight,
            directionalLight,
        )


        // =========================
        // KEYCAP GEOMETRY
        // =========================

        const skirtGeometry =
            createTaperedRoundedBox({
                width: 2.1,
                height: 0.65,
                depth: 2.1,
                radius: 0.2,
                segments: 6,
                topScale: 0.88,
            })

        const topGeometry =
            new RoundedBoxGeometry(
                1.28,
                0.42,
                1.28,
                6,
                0.16,
            )


        // =========================
        // MATERIALS
        // =========================

        const skirtMaterial =
            new THREE.MeshStandardMaterial({
                color: "#ffffff",
                roughness: 0.75,
                metalness: 0,
            })

        const topMaterial =
            new THREE.MeshStandardMaterial({
                color: "#ffffff",
                roughness: 0.7,
                metalness: 0,
            })


        // =========================
        // INSTANCES
        // =========================

        const skirts =
            new THREE.InstancedMesh(
                skirtGeometry,
                skirtMaterial,
                count,
            )

        const tops =
            new THREE.InstancedMesh(
                topGeometry,
                topMaterial,
                count,
            )

        skirts.instanceMatrix.setUsage(
            THREE.DynamicDrawUsage,
        )

        tops.instanceMatrix.setUsage(
            THREE.DynamicDrawUsage,
        )

        scene.add(skirts)
        scene.add(tops)


        // =========================
        // KEYCAP STATE
        // =========================

        const keycaps: KeycapState[] = []

        const halfX = spreadX / 2

        for (let i = 0; i < count; i++) {
            const onLeft = i % 2 === 0

            const x = onLeft
                ? random(-halfX, -centerGap)
                : random(centerGap, halfX)

            const y =
                spreadY / 2 - i * spacing

            const z = random(
                -spreadZ / 2,
                spreadZ / 2,
            )

            const color =
                new THREE.Color(
                    COLORS[i % COLORS.length],
                )

            const state: KeycapState = {
                position: new THREE.Vector3(
                    x,
                    y,
                    z,
                ),

                rotation: new THREE.Euler(
                    random(0, Math.PI * 2),
                    random(0, Math.PI * 2),
                    random(0, Math.PI * 2),
                ),

                spin: new THREE.Vector3(
                    random(-0.25, 0.25),
                    random(-0.35, 0.35),
                    random(-0.2, 0.2),
                ),

                scale: random(0.22, 0.32),
            }

            keycaps.push(state)

            skirts.setColorAt(i, color)
            tops.setColorAt(i, color)
        }

        if (skirts.instanceColor) {
            skirts.instanceColor.needsUpdate = true
        }

        if (tops.instanceColor) {
            tops.instanceColor.needsUpdate = true
        }


        // =========================
        // MATRIX HELPERS
        // =========================

        const quaternion =
            new THREE.Quaternion()

        const baseMatrix =
            new THREE.Matrix4()

        const skirtMatrix =
            new THREE.Matrix4()

        const topMatrix =
            new THREE.Matrix4()

        const scaleVector =
            new THREE.Vector3()

        const skirtOffset =
            new THREE.Matrix4().makeTranslation(
                0,
                -0.08,
                0,
            )

        const topOffset =
            new THREE.Matrix4().makeTranslation(
                0,
                0.26,
                0,
            )

        function updateInstance(index: number) {
            const keycap = keycaps[index]

            quaternion.setFromEuler(
                keycap.rotation,
            )

            scaleVector.setScalar(
                keycap.scale,
            )

            baseMatrix.compose(
                keycap.position,
                quaternion,
                scaleVector,
            )

            skirtMatrix.multiplyMatrices(
                baseMatrix,
                skirtOffset,
            )

            topMatrix.multiplyMatrices(
                baseMatrix,
                topOffset,
            )

            skirts.setMatrixAt(
                index,
                skirtMatrix,
            )

            tops.setMatrixAt(
                index,
                topMatrix,
            )
        }

        for (let i = 0; i < count; i++) {
            updateInstance(i)
        }

        skirts.instanceMatrix.needsUpdate = true
        tops.instanceMatrix.needsUpdate = true


        // =========================
        // TAB VISIBILITY
        // =========================

        let pageVisible = !document.hidden

        function handleVisibilityChange() {
            pageVisible = !document.hidden
        }

        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange,
        )


        // =========================
        // ANIMATION
        // =========================

        let animationFrameId = 0
        let lastFrameTime = 0

        function animate(time: number) {
            animationFrameId =
                requestAnimationFrame(animate)

            if (!pageVisible) {
                return
            }

            // 30 FPS cap
            if (
                time - lastFrameTime <
                frameInterval
            ) {
                return
            }

            const delta = Math.min(
                (time - lastFrameTime) /
                1000,
                0.05,
            )

            lastFrameTime = time

            for (let i = 0; i < count; i++) {
                const keycap = keycaps[i]

                // Fall
                keycap.position.y -=
                    fallSpeed * delta

                // Rotate
                keycap.rotation.x +=
                    keycap.spin.x * delta

                keycap.rotation.y +=
                    keycap.spin.y * delta

                keycap.rotation.z +=
                    keycap.spin.z * delta

                // Recycle at top
                if (
                    keycap.position.y <
                    -spreadY / 2
                ) {
                    let highestY = -Infinity

                    for (
                        let j = 0;
                        j < count;
                        j++
                    ) {
                        if (
                            j !== i &&
                            keycaps[j].position.y >
                            highestY
                        ) {
                            highestY =
                                keycaps[j].position.y
                        }
                    }

                    keycap.position.y =
                        highestY + spacing

                    const onLeft =
                        i % 2 === 0

                    keycap.position.x =
                        onLeft
                            ? random(
                                -halfX,
                                -centerGap,
                            )
                            : random(
                                centerGap,
                                halfX,
                            )

                    keycap.position.z =
                        random(
                            -spreadZ / 2,
                            spreadZ / 2,
                        )
                }

                updateInstance(i)
            }

            skirts.instanceMatrix.needsUpdate =
                true

            tops.instanceMatrix.needsUpdate =
                true

            renderer.render(
                scene,
                camera,
            )
        }

        animationFrameId =
            requestAnimationFrame(animate)


        // =========================
        // RESIZE
        // =========================

        const resizeObserver =
            new ResizeObserver(() => {
                const width =
                    mount.clientWidth

                const height =
                    mount.clientHeight

                if (!width || !height) {
                    return
                }

                camera.aspect =
                    width / height

                camera.updateProjectionMatrix()

                renderer.setSize(
                    width,
                    height,
                )
            })

        resizeObserver.observe(mount)


        // =========================
        // CLEANUP
        // =========================

        return () => {
            cancelAnimationFrame(
                animationFrameId,
            )

            resizeObserver.disconnect()

            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            )

            skirtGeometry.dispose()
            topGeometry.dispose()

            skirtMaterial.dispose()
            topMaterial.dispose()

            renderer.dispose()

            if (
                mount.contains(
                    renderer.domElement,
                )
            ) {
                mount.removeChild(
                    renderer.domElement,
                )
            }
        }
    }, [])

    return (
        <div
            ref={mountRef}
            className="keycap-rain"
        />
    )
}