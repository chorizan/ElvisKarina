import { ContactShadows, Environment, Html, Lightformer, OrbitControls } from '@react-three/drei'
import { useMemo, useState } from 'react'
import * as THREE from 'three'
import { ALL_ARCH, getToothTransform } from '@/lib/tooth-3d-layout'
import { getToothAnatomy } from '@/lib/tooth-anatomy'
import { getToothGeometry } from '@/lib/tooth-geometry'
import { getToothState, isAffected } from '@/lib/odontogram-utils'
import { TOOTH_STATES } from '@/lib/tooth-states'
import type { OdontogramaEntrada } from '@/types/consultation'

const NEUTRAL = new THREE.Color('#ffffff')

/** Mezcla el color diagnostico con blanco para no perder el matiz del esmalte */
function tintFor(color: string) {
  return new THREE.Color(color).lerp(NEUTRAL, 0.45)
}

function ToothMesh({
  pieza,
  entries,
  selected,
  onSelect,
  showLabels,
}: {
  pieza: number
  entries: OdontogramaEntrada[]
  selected?: number | null
  onSelect?: (pieza: number) => void
  showLabels?: boolean
}) {
  const [hovered, setHovered] = useState(false)

  const transform = getToothTransform(pieza)
  const anat = getToothAnatomy(pieza)
  const { crown, roots } = useMemo(() => getToothGeometry(pieza), [pieza])

  const state = getToothState(pieza, entries)
  const affected = isAffected(state)
  const isSelected = selected === pieza
  const isMissing = state === 'ausente' || state === 'extraccion'
  const markColor = TOOTH_STATES[state].color

  const enamelTint = useMemo(
    () => (affected ? tintFor(markColor) : NEUTRAL.clone()),
    [affected, markColor],
  )

  if (!transform || isMissing) return null

  const highlight = isSelected || hovered
  const emissive = isSelected ? '#0ea5e9' : hovered ? '#38bdf8' : markColor
  const emissiveIntensity = isSelected ? 0.35 : hovered ? 0.22 : affected ? 0.08 : 0

  return (
    <group position={transform.position} rotation={[0, transform.rotationY, 0]}>
      <group rotation={[transform.tiltX, 0, 0]}>
        <group rotation={[0, 0, transform.isUpper ? Math.PI : 0]}>
          <mesh
            geometry={crown}
            castShadow
            receiveShadow
            onClick={(e) => {
              e.stopPropagation()
              onSelect?.(pieza)
            }}
            onPointerOver={(e) => {
              e.stopPropagation()
              setHovered(true)
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
              setHovered(false)
              document.body.style.cursor = 'auto'
            }}
          >
            <meshPhysicalMaterial
              vertexColors
              color={enamelTint}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity}
              roughness={0.16}
              metalness={0}
              clearcoat={1}
              clearcoatRoughness={0.05}
              reflectivity={0.55}
              sheen={0.3}
              sheenColor="#fff6e8"
              ior={1.6}
              envMapIntensity={0.9}
            />
          </mesh>

          {roots.map((root, i) => (
            <mesh key={i} geometry={root.geometry} position={root.offset} castShadow>
              <meshStandardMaterial
                vertexColors
                color={affected ? enamelTint : NEUTRAL}
                roughness={0.62}
                metalness={0}
                envMapIntensity={0.35}
              />
            </mesh>
          ))}
        </group>
      </group>

      {showLabels && affected && (
        <Html
          position={[0, transform.isUpper ? 0.12 : -0.12, anat.bl * 0.62]}
          center
          distanceFactor={6}
          style={{ pointerEvents: 'none' }}
          zIndexRange={[20, 0]}
        >
          <div
            className="rounded-md px-2 py-0.5 text-xs font-bold shadow-md"
            style={{ background: markColor, color: '#fff', border: '2px solid white' }}
          >
            {pieza}
          </div>
        </Html>
      )}

      {highlight && (
        <mesh position={[0, transform.isUpper ? -anat.crownH * 0.5 : anat.crownH * 0.5, 0]}>
          <sphereGeometry args={[Math.max(anat.md, anat.crownH) * 0.62, 18, 14]} />
          <meshBasicMaterial
            color={isSelected ? '#0ea5e9' : '#7dd3fc'}
            wireframe
            transparent
            opacity={0.28}
          />
        </mesh>
      )}
    </group>
  )
}

export interface DentalMouth3DProps {
  entries: OdontogramaEntrada[]
  selectedTooth?: number | null
  onToothSelect?: (pieza: number) => void
  showLabels?: boolean
  autoRotate?: boolean
}

export function DentalMouth3D({
  entries,
  selectedTooth,
  onToothSelect,
  showLabels = true,
  autoRotate = false,
}: DentalMouth3DProps) {
  return (
    <>
      <color attach="background" args={['#eef2f6']} />
      <fog attach="fog" args={['#eef2f6', 9, 20]} />

      {/* Entorno generado en local: sin descargas externas, funciona offline */}
      <Environment resolution={128}>
        <Lightformer intensity={2.4} position={[0, 3.5, 2]} scale={[8, 4, 1]} />
        <Lightformer intensity={1.1} position={[-4, 1.5, 2]} scale={[4, 5, 1]} />
        <Lightformer intensity={1.1} position={[4, 1.5, 2]} scale={[4, 5, 1]} />
        <Lightformer intensity={0.7} position={[0, -2, -3]} scale={[8, 4, 1]} />
      </Environment>

      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 7, 5]} intensity={1.15} castShadow />
      <directionalLight position={[-4, 4, 3]} intensity={0.45} color="#fffaf2" />
      <directionalLight position={[0, -3, 4]} intensity={0.25} color="#eaf2ff" />
      <spotLight position={[0, 6, 3]} angle={0.5} penumbra={0.9} intensity={0.5} />

      {ALL_ARCH.map((pieza) => (
        <ToothMesh
          key={pieza}
          pieza={pieza}
          entries={entries}
          selected={selectedTooth}
          onSelect={onToothSelect}
          showLabels={showLabels}
        />
      ))}

      <ContactShadows position={[0, -1.18, 0]} opacity={0.3} scale={9} blur={2.4} far={3} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
        <circleGeometry args={[6, 64]} />
        <meshStandardMaterial color="#f4f7fa" roughness={1} />
      </mesh>

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        autoRotate={autoRotate}
        autoRotateSpeed={0.4}
        minDistance={2.2}
        maxDistance={9}
        minPolarAngle={Math.PI * 0.08}
        maxPolarAngle={Math.PI * 0.85}
        target={[0, 0, 0]}
      />
    </>
  )
}
