"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { DoubleSide, Group, ShaderMaterial } from "three";
import { mythicMotionState } from "./scene-state";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uEmboss;
  uniform float uBookOpen;
  uniform float uPageTurn;
  uniform float uThreadTension;
  varying vec2 vUv;
  varying float vRelief;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  void main() {
    vUv = uv;
    vec3 displaced = position;
    float horizontal = uv.x * 2.0 - 1.0;
    float fibre = (noise(uv * 68.0) - .5) * .012;
    float centreCrease = exp(-abs(horizontal) * 13.0) * -.04 * uBookOpen;
    float broadFold = (1.0 - horizontal * horizontal) * .075 * uBookOpen;
    float turnPhase = 1.0 - uPageTurn;
    float pageZone = smoothstep(.34, 1.0, uv.x);
    float pageCurl = pageZone * pageZone * turnPhase * .42;
    float quietBreath = (noise(vec2(uv.x * 7.0 + uTime * .018, uv.y * 9.0)) - .5) * .006;

    vRelief = fibre * (1.0 + uThreadTension * .3)
      + centreCrease
      + broadFold
      + pageCurl
      + quietBreath * uEmboss;
    displaced.z += vRelief;
    displaced.x *= mix(.82, 1.0, uBookOpen);
    displaced.x -= pageZone * turnPhase * .12;
    displaced.y += pageZone * turnPhase * (uv.y - .5) * .06;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uLightX;
  uniform float uLightY;
  uniform float uFocus;
  uniform float uThreadTension;
  varying vec2 vUv;
  varying float vRelief;

  float grain(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float segmentRelief(vec2 p, vec2 a, vec2 b, float width) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return 1.0 - smoothstep(width, width + .006, length(pa - ba * h));
  }

  float treeRelief(vec2 p) {
    float relief = segmentRelief(p, vec2(.50, .16), vec2(.50, .64), .008);
    relief += segmentRelief(p, vec2(.50, .43), vec2(.34, .69), .005);
    relief += segmentRelief(p, vec2(.50, .48), vec2(.67, .74), .005);
    relief += segmentRelief(p, vec2(.50, .55), vec2(.42, .79), .004);
    relief += segmentRelief(p, vec2(.50, .58), vec2(.58, .84), .004);
    relief += segmentRelief(p, vec2(.50, .62), vec2(.51, .88), .003);
    relief += segmentRelief(p, vec2(.50, .17), vec2(.38, .08), .004);
    relief += segmentRelief(p, vec2(.50, .17), vec2(.63, .07), .004);
    return clamp(relief, 0.0, 1.0);
  }

  void main() {
    vec3 paper = vec3(.941, .933, .905);
    float fibreGrain = (grain(vUv * 730.0) - .5) * .024;
    float edge = smoothstep(.0, .045, vUv.x) * smoothstep(.0, .045, 1.0 - vUv.x)
               * smoothstep(.0, .04, vUv.y) * smoothstep(.0, .04, 1.0 - vUv.y);
    float sideLight = (vUv.x - .5) * uLightX * .036 + (vUv.y - .5) * uLightY * .026;
    float roots = treeRelief(vUv);
    vec3 blueInk = vec3(.149, .243, .388);
    vec3 colour = paper + fibreGrain + sideLight + vRelief * 1.8;
    colour = mix(colour, blueInk, roots * (.035 + uThreadTension * .025 + uFocus * .012));
    gl_FragColor = vec4(colour, edge * .97);
  }
`;

export function MythicPaperScene() {
  const group = useRef<Group>(null);
  const material = useRef<ShaderMaterial>(null);
  const { size } = useThree();
  const segments = size.width < 640 ? 28 : 56;
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uEmboss: { value: mythicMotionState.emboss },
      uBookOpen: { value: mythicMotionState.book.open },
      uPageTurn: { value: mythicMotionState.book.pageTurn },
      uThreadTension: { value: mythicMotionState.threads.tension },
      uLightX: { value: mythicMotionState.lightX },
      uLightY: { value: mythicMotionState.lightY },
      uFocus: { value: Number(mythicMotionState.threads.focus) },
    }),
    [],
  );

  useFrame(({ clock }, delta) => {
    if (!material.current) return;

    const ease = Math.min(1, delta * 3.2);
    const values = material.current.uniforms;
    values.uTime.value = clock.elapsedTime;
    values.uEmboss.value += (mythicMotionState.emboss - values.uEmboss.value) * ease;
    values.uBookOpen.value += (mythicMotionState.book.open - values.uBookOpen.value) * ease;
    values.uPageTurn.value += (mythicMotionState.book.pageTurn - values.uPageTurn.value) * ease;
    values.uThreadTension.value +=
      (mythicMotionState.threads.tension - values.uThreadTension.value) * ease;
    values.uLightX.value += (mythicMotionState.lightX - values.uLightX.value) * ease;
    values.uLightY.value += (mythicMotionState.lightY - values.uLightY.value) * ease;
    values.uFocus.value +=
      (Number(mythicMotionState.threads.focus) - values.uFocus.value) * ease;

    if (group.current) {
      const targetRotation = (mythicMotionState.progress - .5) * .014;
      const targetY = (.5 - mythicMotionState.progress) * .1;
      group.current.rotation.z += (targetRotation - group.current.rotation.z) * ease;
      group.current.position.y += (targetY - group.current.position.y) * ease;
    }
  });

  return (
    <group ref={group} rotation={[-0.055, 0.09, -0.008]}>
      <mesh>
        <planeGeometry args={[7.2, 8.8, segments, segments]} />
        <shaderMaterial
          ref={material}
          args={[{ vertexShader, fragmentShader, uniforms, transparent: true, side: DoubleSide }]}
        />
      </mesh>
      <mesh position={[.28, -.2, -.075]} rotation={[0, 0, .016]}>
        <planeGeometry args={[6.34, 7.68, 1, 1]} />
        <meshBasicMaterial color="#f7f5ef" transparent opacity={0.1} side={DoubleSide} />
      </mesh>
    </group>
  );
}
