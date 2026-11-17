"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { AvatarConfig } from "./types";

interface Avatar3DCharacterProps {
  config: AvatarConfig;
  mousePos?: { x: number; y: number };
  isSpinning?: boolean;
}

export default function Avatar3DCharacter({
  config,
  mousePos = { x: 0, y: 0 },
  isSpinning = false,
}: Avatar3DCharacterProps) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);

  // Parse color hex strings safely
  const skinColor = useMemo(() => new THREE.Color(config.skinTone), [config.skinTone]);
  const hairColor = useMemo(() => new THREE.Color(config.hairColor), [config.hairColor]);
  const eyeColor = useMemo(() => new THREE.Color(config.eyeColor), [config.eyeColor]);
  const outfitColor = useMemo(() => new THREE.Color(config.outfitColor), [config.outfitColor]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (rootGroupRef.current) {
      // Gentle idle breathing
      rootGroupRef.current.position.y = Math.sin(t * 1.6) * 0.02;

      if (isSpinning) {
        rootGroupRef.current.rotation.y += delta * 0.75;
      }
    }

    if (headGroupRef.current && !isSpinning) {
      // Smooth look-at tracking towards mouse
      const targetRotY = mousePos.x * 0.45;
      const targetRotX = -mousePos.y * 0.25;
      headGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        headGroupRef.current.rotation.y,
        targetRotY,
        0.08
      );
      headGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        headGroupRef.current.rotation.x,
        targetRotX,
        0.08
      );
    }
  });

  return (
    <group ref={rootGroupRef} position={[0, 0, 0]}>
      {/* ============================================================ */}
      {/* 0. CINEMA PEDESTAL / TURNTABLE STAGE                          */}
      {/* ============================================================ */}
      <group position={[0, -1.62, 0]}>
        {/* Brushed Obsidian Base Plate */}
        <mesh position={[0, -0.04, 0]}>
          <cylinderGeometry args={[0.92, 0.98, 0.08, 36]} />
          <meshStandardMaterial color="#0b0a0e" roughness={0.4} metalness={0.8} />
        </mesh>
        {/* Champagne Gold Glowing Stage Perimeter Ring */}
        <mesh position={[0, 0.005, 0]}>
          <torusGeometry args={[0.92, 0.018, 16, 48]} />
          <meshStandardMaterial
            color="#e3c995"
            emissive="#c9a86a"
            emissiveIntensity={1.8}
            toneMapped={false}
          />
        </mesh>
        {/* Soft Contact Shadow beneath shoes */}
        <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0, 0.65, 32]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.35} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 1. FOOTWEAR (Left & Right Oxford Dress Shoes)                 */}
      {/* ============================================================ */}
      <group position={[0, 0, 0]}>
        {/* Left Shoe */}
        <group position={[-0.15, -1.54, 0.04]}>
          {/* Sole with Champagne Edge */}
          <mesh position={[0, -0.04, 0.04]}>
            <boxGeometry args={[0.13, 0.024, 0.26]} />
            <meshStandardMaterial color="#1a1816" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.035, 0.04]}>
            <boxGeometry args={[0.132, 0.008, 0.262]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Polished Leather Upper */}
          <mesh position={[0, 0.01, 0.04]}>
            <boxGeometry args={[0.12, 0.075, 0.24]} />
            <meshStandardMaterial color="#09080c" roughness={0.2} metalness={0.6} />
          </mesh>
          {/* Toe Cap Curve */}
          <mesh position={[0, 0, 0.13]} scale={[1, 0.8, 1]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#09080c" roughness={0.2} metalness={0.6} />
          </mesh>
        </group>

        {/* Right Shoe */}
        <group position={[0.15, -1.54, 0.04]}>
          {/* Sole with Champagne Edge */}
          <mesh position={[0, -0.04, 0.04]}>
            <boxGeometry args={[0.13, 0.024, 0.26]} />
            <meshStandardMaterial color="#1a1816" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.035, 0.04]}>
            <boxGeometry args={[0.132, 0.008, 0.262]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Polished Leather Upper */}
          <mesh position={[0, 0.01, 0.04]}>
            <boxGeometry args={[0.12, 0.075, 0.24]} />
            <meshStandardMaterial color="#09080c" roughness={0.2} metalness={0.6} />
          </mesh>
          {/* Toe Cap Curve */}
          <mesh position={[0, 0, 0.13]} scale={[1, 0.8, 1]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#09080c" roughness={0.2} metalness={0.6} />
          </mesh>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 2. LEGS & TROUSERS (Left & Right)                             */}
      {/* ============================================================ */}
      <group position={[0, 0, 0]}>
        {/* Left Leg */}
        <group position={[-0.15, -1.08, 0]}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.085, 0.075, 0.82, 20]} />
            <meshStandardMaterial
              color={config.outfit === "tuxedo" ? "#121118" : outfitColor}
              roughness={0.65}
            />
          </mesh>
          {/* Satin Side Stripe for Tuxedo */}
          {config.outfit === "tuxedo" && (
            <mesh position={[-0.082, 0, 0]}>
              <boxGeometry args={[0.01, 0.82, 0.02]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.8} roughness={0.2} />
            </mesh>
          )}
        </group>

        {/* Right Leg */}
        <group position={[0.15, -1.08, 0]}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.085, 0.075, 0.82, 20]} />
            <meshStandardMaterial
              color={config.outfit === "tuxedo" ? "#121118" : outfitColor}
              roughness={0.65}
            />
          </mesh>
          {/* Satin Side Stripe for Tuxedo */}
          {config.outfit === "tuxedo" && (
            <mesh position={[0.082, 0, 0]}>
              <boxGeometry args={[0.01, 0.82, 0.02]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.8} roughness={0.2} />
            </mesh>
          )}
        </group>

        {/* Pelvis / Waist Transition */}
        <mesh position={[0, -0.66, 0]}>
          <cylinderGeometry args={[0.22, 0.20, 0.16, 24]} />
          <meshStandardMaterial
            color={config.outfit === "tuxedo" ? "#121118" : outfitColor}
            roughness={0.6}
          />
        </mesh>
        {/* Gold Belt Buckle */}
        <mesh position={[0, -0.61, 0.19]}>
          <boxGeometry args={[0.06, 0.035, 0.02]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.9} roughness={0.15} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 3. UPPER TORSO & JACKET                                      */}
      {/* ============================================================ */}
      <group position={[0, -0.25, 0]}>
        {/* Chest & Body Taper */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.34, 0.24, 0.65, 28]} />
          <meshStandardMaterial
            color={outfitColor}
            roughness={config.outfit === "tuxedo" ? 0.35 : 0.65}
            metalness={config.outfit === "cyberJacket" ? 0.45 : 0.08}
          />
        </mesh>

        {/* Tuxedo Details: Satin Lapels & White Pleated Shirt */}
        {config.outfit === "tuxedo" && (
          <group position={[0, 0.04, 0.18]}>
            {/* White Dress Shirt V */}
            <mesh position={[0, 0.12, -0.02]}>
              <boxGeometry args={[0.14, 0.32, 0.02]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </mesh>
            {/* Left Satin Shawl Lapel */}
            <mesh position={[-0.1, 0.06, 0]} rotation={[0, 0, -0.22]}>
              <boxGeometry args={[0.07, 0.38, 0.03]} />
              <meshStandardMaterial color="#0a090e" roughness={0.2} metalness={0.6} />
            </mesh>
            {/* Right Satin Shawl Lapel */}
            <mesh position={[0.1, 0.06, 0]} rotation={[0, 0, 0.22]}>
              <boxGeometry args={[0.07, 0.38, 0.03]} />
              <meshStandardMaterial color="#0a090e" roughness={0.2} metalness={0.6} />
            </mesh>
            {/* Champagne Gold Director Lapel Pin */}
            <mesh position={[-0.11, 0.18, 0.02]}>
              <boxGeometry args={[0.02, 0.04, 0.015]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.95} roughness={0.15} />
            </mesh>
            {/* Black Velvet Bowtie */}
            <mesh position={[0, 0.22, 0.01]}>
              <boxGeometry args={[0.08, 0.035, 0.02]} />
              <meshStandardMaterial color="#0b0a0f" roughness={0.3} />
            </mesh>
          </group>
        )}

        {/* Cyber / Director Jacket Details */}
        {config.outfit === "cyberJacket" && (
          <group position={[0, 0.12, 0]}>
            {/* High Structured Collar */}
            <mesh position={[0, 0.18, 0]}>
              <cylinderGeometry args={[0.18, 0.22, 0.14, 24, 1, true]} />
              <meshStandardMaterial color="#161413" metalness={0.8} roughness={0.25} />
            </mesh>
            {/* Champagne Gold Glowing Rim Piping */}
            <mesh position={[0, 0.24, 0]}>
              <torusGeometry args={[0.18, 0.012, 12, 32]} />
              <meshStandardMaterial
                color="#e3c995"
                emissive="#c9a86a"
                emissiveIntensity={1.8}
                toneMapped={false}
              />
            </mesh>
            {/* Gold Zipper Seam */}
            <mesh position={[0, -0.08, 0.26]}>
              <boxGeometry args={[0.015, 0.44, 0.01]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        )}

        {/* Hoodie Details */}
        {config.outfit === "hoodie" && (
          <group position={[0, 0.1, 0]}>
            {/* Draped Hood Rim */}
            <mesh position={[0, 0.16, -0.06]}>
              <torusGeometry args={[0.19, 0.065, 16, 24]} />
              <meshStandardMaterial color={outfitColor} roughness={0.85} />
            </mesh>
            {/* White Drawstrings */}
            <mesh position={[-0.05, -0.06, 0.26]}>
              <cylinderGeometry args={[0.007, 0.007, 0.22, 8]} />
              <meshStandardMaterial color="#ffffff" roughness={0.5} />
            </mesh>
            <mesh position={[0.05, -0.06, 0.26]}>
              <cylinderGeometry args={[0.007, 0.007, 0.22, 8]} />
              <meshStandardMaterial color="#ffffff" roughness={0.5} />
            </mesh>
          </group>
        )}

        {/* Kimono Overlap */}
        {config.outfit === "kimono" && (
          <group position={[0, 0.06, 0.22]}>
            <mesh position={[-0.06, 0.02, 0]} rotation={[0, 0, -0.35]}>
              <boxGeometry args={[0.12, 0.38, 0.02]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.4} roughness={0.3} />
            </mesh>
            <mesh position={[0.06, 0.02, -0.01]} rotation={[0, 0, 0.35]}>
              <boxGeometry args={[0.12, 0.38, 0.02]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.4} roughness={0.3} />
            </mesh>
          </group>
        )}
      </group>

      {/* ============================================================ */}
      {/* 4. ARMS & HANDS (Seamless Organic Rigging & Sculpted Hands)  */}
      {/* ============================================================ */}
      <group position={[0, -0.22, 0]}>
        {/* Left Arm: Hanging Naturally with Continuous Ball-Joints */}
        <group position={[-0.34, 0.2, 0]}>
          {/* Shoulder Joint Sphere */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.082, 20, 20]} />
            <meshStandardMaterial color={outfitColor} roughness={0.6} />
          </mesh>

          {/* Upper Arm Sleeve */}
          <group rotation={[0.05, 0, 0.12]}>
            <mesh position={[0, -0.12, 0]}>
              <cylinderGeometry args={[0.075, 0.065, 0.24, 20]} />
              <meshStandardMaterial color={outfitColor} roughness={0.6} />
            </mesh>

            {/* Seamless Elbow Joint Sphere */}
            <group position={[0, -0.24, 0]}>
              <mesh>
                <sphereGeometry args={[0.066, 20, 20]} />
                <meshStandardMaterial color={outfitColor} roughness={0.6} />
              </mesh>

              {/* Forearm Sleeve */}
              <group rotation={[0.14, 0, 0.06]}>
                <mesh position={[0, -0.11, 0]}>
                  <cylinderGeometry args={[0.065, 0.054, 0.22, 20]} />
                  <meshStandardMaterial color={outfitColor} roughness={0.6} />
                </mesh>

                {/* Crisp White Shirt Cuff */}
                <mesh position={[0, -0.22, 0]}>
                  <cylinderGeometry args={[0.05, 0.05, 0.024, 20]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.3} />
                </mesh>

                {/* Champagne Gold Cufflink */}
                <mesh position={[-0.046, -0.22, 0]}>
                  <sphereGeometry args={[0.008, 12, 12]} />
                  <meshStandardMaterial color="#c9a86a" metalness={0.95} roughness={0.15} />
                </mesh>

                {/* Smooth Wrist Bridge */}
                <mesh position={[0, -0.235, 0]}>
                  <sphereGeometry args={[0.038, 16, 16]} />
                  <meshStandardMaterial color={skinColor} roughness={0.55} />
                </mesh>

                {/* Sculpted Hand (Palm + Thumb + Natural Relaxed Fingers) */}
                <group position={[0, -0.265, 0]}>
                  {/* Palm */}
                  <mesh position={[0, -0.025, 0]} scale={[0.85, 1.05, 0.55]}>
                    <capsuleGeometry args={[0.026, 0.028, 12, 16]} />
                    <meshStandardMaterial color={skinColor} roughness={0.55} />
                  </mesh>
                  {/* Naturally Positioned Thumb */}
                  <mesh position={[0.028, -0.012, 0.016]} rotation={[0.25, 0.1, -0.42]}>
                    <capsuleGeometry args={[0.01, 0.026, 8, 12]} />
                    <meshStandardMaterial color={skinColor} roughness={0.55} />
                  </mesh>
                  {/* Relaxed Curled Fingers */}
                  <mesh position={[0, -0.054, 0.006]} scale={[0.8, 0.75, 0.45]}>
                    <capsuleGeometry args={[0.023, 0.02, 10, 14]} />
                    <meshStandardMaterial color={skinColor} roughness={0.55} />
                  </mesh>
                </group>
              </group>
            </group>
          </group>
        </group>

        {/* Right Arm: Cradling Popcorn Bucket OR Symmetrical Relaxed Posture */}
        {config.accessory === "popcorn" ? (
          <group position={[0.34, 0.2, 0]}>
            {/* Shoulder Joint Sphere */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.082, 20, 20]} />
              <meshStandardMaterial color={outfitColor} roughness={0.6} />
            </mesh>

            {/* Upper Arm Angled Forward & Slightly Inward */}
            <group rotation={[-0.45, 0.1, -0.15]}>
              <mesh position={[0, -0.12, 0]}>
                <cylinderGeometry args={[0.075, 0.065, 0.24, 20]} />
                <meshStandardMaterial color={outfitColor} roughness={0.6} />
              </mesh>

              {/* Seamless Elbow Joint Sphere */}
              <group position={[0, -0.24, 0]}>
                <mesh>
                  <sphereGeometry args={[0.066, 20, 20]} />
                  <meshStandardMaterial color={outfitColor} roughness={0.6} />
                </mesh>

                {/* Forearm Bent Upward Cradling Bucket */}
                <group rotation={[-0.85, -0.2, 0.25]}>
                  <mesh position={[0, -0.11, 0]}>
                    <cylinderGeometry args={[0.065, 0.054, 0.22, 20]} />
                    <meshStandardMaterial color={outfitColor} roughness={0.6} />
                  </mesh>

                  {/* Shirt Cuff */}
                  <mesh position={[0, -0.22, 0]}>
                    <cylinderGeometry args={[0.05, 0.05, 0.024, 20]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.3} />
                  </mesh>

                  {/* Gold Cufflink */}
                  <mesh position={[0.046, -0.22, 0]}>
                    <sphereGeometry args={[0.008, 12, 12]} />
                    <meshStandardMaterial color="#c9a86a" metalness={0.95} roughness={0.15} />
                  </mesh>

                  {/* Wrist Bridge */}
                  <mesh position={[0, -0.235, 0]}>
                    <sphereGeometry args={[0.038, 16, 16]} />
                    <meshStandardMaterial color={skinColor} roughness={0.55} />
                  </mesh>

                  {/* Right Hand: Palm Underneath Supporting Popcorn */}
                  <group position={[0, -0.265, 0]} rotation={[0.2, 0, 0.1]}>
                    {/* Palm */}
                    <mesh position={[0, -0.02, 0]} scale={[0.85, 1.05, 0.55]}>
                      <capsuleGeometry args={[0.026, 0.028, 12, 16]} />
                      <meshStandardMaterial color={skinColor} roughness={0.55} />
                    </mesh>
                    {/* Thumb gripping edge */}
                    <mesh position={[-0.028, -0.01, 0.016]} rotation={[0.2, -0.1, 0.42]}>
                      <capsuleGeometry args={[0.01, 0.026, 8, 12]} />
                      <meshStandardMaterial color={skinColor} roughness={0.55} />
                    </mesh>
                    {/* Fingers wrapped under bucket */}
                    <mesh position={[0, -0.048, 0.01]} scale={[0.8, 0.75, 0.45]}>
                      <capsuleGeometry args={[0.023, 0.02, 10, 14]} />
                      <meshStandardMaterial color={skinColor} roughness={0.55} />
                    </mesh>
                  </group>

                  {/* Popcorn Bucket Securely Nested In Arm */}
                  <group position={[0.02, -0.18, 0.16]} rotation={[0.2, -0.15, 0]}>
                    {/* Striped Bucket Body */}
                    <mesh>
                      <cylinderGeometry args={[0.13, 0.09, 0.22, 20]} />
                      <meshStandardMaterial color="#b91c1c" roughness={0.4} />
                    </mesh>
                    {/* Cream Stripes */}
                    <mesh position={[0, 0.01, 0]}>
                      <cylinderGeometry args={[0.132, 0.092, 0.06, 20]} />
                      <meshStandardMaterial color="#fffbeb" roughness={0.5} />
                    </mesh>
                    {/* Fluffy Butter Popcorn Kernels */}
                    {[-0.04, 0, 0.04].map((x, i) => (
                      <mesh key={i} position={[x, 0.12 + (i % 2) * 0.02, (i - 1) * 0.025]}>
                        <sphereGeometry args={[0.046, 12, 12]} />
                        <meshStandardMaterial color="#fef08a" roughness={0.7} />
                      </mesh>
                    ))}
                    <mesh position={[0.015, 0.15, 0.01]}>
                      <sphereGeometry args={[0.042, 12, 12]} />
                      <meshStandardMaterial color="#fde047" roughness={0.8} />
                    </mesh>
                  </group>
                </group>
              </group>
            </group>
          </group>
        ) : (
          <group position={[0.34, 0.2, 0]}>
            {/* Shoulder */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.082, 20, 20]} />
              <meshStandardMaterial color={outfitColor} roughness={0.6} />
            </mesh>

            {/* Upper Arm Sleeve */}
            <group rotation={[0.05, 0, -0.12]}>
              <mesh position={[0, -0.12, 0]}>
                <cylinderGeometry args={[0.075, 0.065, 0.24, 20]} />
                <meshStandardMaterial color={outfitColor} roughness={0.6} />
              </mesh>

              {/* Seamless Elbow Joint Sphere */}
              <group position={[0, -0.24, 0]}>
                <mesh>
                  <sphereGeometry args={[0.066, 20, 20]} />
                  <meshStandardMaterial color={outfitColor} roughness={0.6} />
                </mesh>

                {/* Forearm Sleeve */}
                <group rotation={[0.14, 0, -0.06]}>
                  <mesh position={[0, -0.11, 0]}>
                    <cylinderGeometry args={[0.065, 0.054, 0.22, 20]} />
                    <meshStandardMaterial color={outfitColor} roughness={0.6} />
                  </mesh>

                  {/* Shirt Cuff */}
                  <mesh position={[0, -0.22, 0]}>
                    <cylinderGeometry args={[0.05, 0.05, 0.024, 20]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.3} />
                  </mesh>

                  {/* Gold Cufflink */}
                  <mesh position={[0.046, -0.22, 0]}>
                    <sphereGeometry args={[0.008, 12, 12]} />
                    <meshStandardMaterial color="#c9a86a" metalness={0.95} roughness={0.15} />
                  </mesh>

                  {/* Wrist Bridge */}
                  <mesh position={[0, -0.235, 0]}>
                    <sphereGeometry args={[0.038, 16, 16]} />
                    <meshStandardMaterial color={skinColor} roughness={0.55} />
                  </mesh>

                  {/* Sculpted Hand */}
                  <group position={[0, -0.265, 0]}>
                    <mesh position={[0, -0.025, 0]} scale={[0.85, 1.05, 0.55]}>
                      <capsuleGeometry args={[0.026, 0.028, 12, 16]} />
                      <meshStandardMaterial color={skinColor} roughness={0.55} />
                    </mesh>
                    <mesh position={[-0.028, -0.012, 0.016]} rotation={[0.25, -0.1, 0.42]}>
                      <capsuleGeometry args={[0.01, 0.026, 8, 12]} />
                      <meshStandardMaterial color={skinColor} roughness={0.55} />
                    </mesh>
                    <mesh position={[0, -0.054, 0.006]} scale={[0.8, 0.75, 0.45]}>
                      <capsuleGeometry args={[0.023, 0.02, 10, 14]} />
                      <meshStandardMaterial color={skinColor} roughness={0.55} />
                    </mesh>
                  </group>
                </group>
              </group>
            </group>
          </group>
        )}
      </group>

      {/* VIP Director Badge Accessory */}
      {config.accessory === "directorBadge" && (
        <group position={[0, -0.22, 0.26]}>
          <mesh position={[0, 0.12, -0.04]} rotation={[0.4, 0, 0]}>
            <torusGeometry args={[0.18, 0.008, 8, 20, Math.PI]} />
            <meshStandardMaterial color="#c9a86a" />
          </mesh>
          <mesh position={[0, -0.06, 0]}>
            <boxGeometry args={[0.11, 0.15, 0.01]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.9} roughness={0.15} />
          </mesh>
        </group>
      )}

      {/* ============================================================ */}
      {/* 5. NECK & HEAD (Head Group tracks mouse smoothly)             */}
      {/* ============================================================ */}
      {/* Neck */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.11, 0.13, 0.18, 20]} />
        <meshStandardMaterial color={skinColor} roughness={0.55} />
      </mesh>

      <group ref={headGroupRef} position={[0, 0.52, 0]}>
        {/* Stylized Head Geometry */}
        <mesh position={[0, 0, 0]} scale={[0.88, 1.02, 0.94]}>
          <sphereGeometry args={[0.34, 32, 32]} />
          <meshStandardMaterial color={skinColor} roughness={0.48} metalness={0.04} />
        </mesh>

        {/* Stylized Ears */}
        <mesh position={[-0.34, 0, -0.02]} scale={[0.08, 0.16, 0.1]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
        <mesh position={[0.34, 0, -0.02]} scale={[0.08, 0.16, 0.1]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>

        {/* Eyes (Left & Right) */}
        {/* Left Eye */}
        <group position={[-0.12, 0.03, 0.3]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.052, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} />
          </mesh>
          {/* Iris */}
          <mesh position={[0, 0, 0.046]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.03, 20]} />
            <meshStandardMaterial
              color={eyeColor}
              emissive={eyeColor}
              emissiveIntensity={config.eyeGlow ? 1.6 : 0.2}
              toneMapped={false}
            />
          </mesh>
          {/* Pupil */}
          <mesh position={[0, 0, 0.049]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.015, 16]} />
            <meshBasicMaterial color="#050308" />
          </mesh>
          {/* Shine Catchlight */}
          <mesh position={[0.01, 0.012, 0.051]}>
            <circleGeometry args={[0.007, 10]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* Right Eye */}
        <group position={[0.12, 0.03, 0.3]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.052, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} />
          </mesh>
          {/* Iris */}
          <mesh position={[0, 0, 0.046]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.03, 20]} />
            <meshStandardMaterial
              color={eyeColor}
              emissive={eyeColor}
              emissiveIntensity={config.eyeGlow ? 1.6 : 0.2}
              toneMapped={false}
            />
          </mesh>
          {/* Pupil */}
          <mesh position={[0, 0, 0.049]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.015, 16]} />
            <meshBasicMaterial color="#050308" />
          </mesh>
          {/* Shine Catchlight */}
          <mesh position={[0.01, 0.012, 0.051]}>
            <circleGeometry args={[0.007, 10]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* Eyebrows */}
        <mesh position={[-0.12, 0.12, 0.3]} rotation={[0, 0, 0.06]}>
          <boxGeometry args={[0.09, 0.018, 0.015]} />
          <meshStandardMaterial color={hairColor} roughness={0.6} />
        </mesh>
        <mesh position={[0.12, 0.12, 0.3]} rotation={[0, 0, -0.06]}>
          <boxGeometry args={[0.09, 0.018, 0.015]} />
          <meshStandardMaterial color={hairColor} roughness={0.6} />
        </mesh>

        {/* Subtle Stylized Nose */}
        <mesh position={[0, -0.02, 0.33]} scale={[0.8, 1.2, 0.9]}>
          <coneGeometry args={[0.026, 0.08, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>

        {/* Refined Gentle Smile Line */}
        <mesh position={[0, -0.13, 0.3]} rotation={[0.08, 0, 0]}>
          <torusGeometry args={[0.055, 0.009, 8, 16, Math.PI * 0.7]} />
          <meshStandardMaterial color="#993d4a" roughness={0.4} />
        </mesh>

        {/* ============================================================ */}
        {/* 6. EYEWEAR (Accurately Proportioned to Head)                 */}
        {/* ============================================================ */}
        {config.eyewear === "cinema3d" && (
          <group position={[0, 0.03, 0.32]}>
            {/* Sleek Black/White Frame */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.42, 0.12, 0.02]} />
              <meshStandardMaterial color="#0c0b0e" roughness={0.3} />
            </mesh>
            {/* Left Cyan Anaglyph Lens */}
            <mesh position={[-0.12, 0, 0.012]}>
              <boxGeometry args={[0.13, 0.08, 0.008]} />
              <meshStandardMaterial
                color="#00f5d4"
                emissive="#00f5d4"
                emissiveIntensity={0.6}
                transparent
                opacity={0.65}
                roughness={0.1}
              />
            </mesh>
            {/* Right Crimson Anaglyph Lens */}
            <mesh position={[0.12, 0, 0.012]}>
              <boxGeometry args={[0.13, 0.08, 0.008]} />
              <meshStandardMaterial
                color="#f43f5e"
                emissive="#f43f5e"
                emissiveIntensity={0.6}
                transparent
                opacity={0.65}
                roughness={0.1}
              />
            </mesh>
            {/* Temples */}
            <mesh position={[-0.21, 0, -0.16]} rotation={[0, 0.15, 0]}>
              <boxGeometry args={[0.015, 0.03, 0.32]} />
              <meshStandardMaterial color="#0c0b0e" roughness={0.3} />
            </mesh>
            <mesh position={[0.21, 0, -0.16]} rotation={[0, -0.15, 0]}>
              <boxGeometry args={[0.015, 0.03, 0.32]} />
              <meshStandardMaterial color="#0c0b0e" roughness={0.3} />
            </mesh>
          </group>
        )}

        {config.eyewear === "cyberVisor" && (
          <group position={[0, 0.03, 0.32]}>
            <mesh>
              <cylinderGeometry args={[0.35, 0.35, 0.09, 28, 1, true, -Math.PI / 2.5, Math.PI / 1.25]} />
              <meshStandardMaterial
                color="#e3c995"
                emissive="#c9a86a"
                emissiveIntensity={1.8}
                transparent
                opacity={0.8}
                roughness={0.1}
                metalness={0.8}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        )}

        {config.eyewear === "shades" && (
          <group position={[0, 0.03, 0.32]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.4, 0.11, 0.02]} />
              <meshStandardMaterial color="#0c0b0e" roughness={0.1} metalness={0.9} />
            </mesh>
            <mesh position={[-0.11, 0, 0.012]}>
              <boxGeometry args={[0.13, 0.075, 0.008]} />
              <meshStandardMaterial color="#141318" roughness={0.1} metalness={0.9} />
            </mesh>
            <mesh position={[0.11, 0, 0.012]}>
              <boxGeometry args={[0.13, 0.075, 0.008]} />
              <meshStandardMaterial color="#141318" roughness={0.1} metalness={0.9} />
            </mesh>
            {/* Gold temple accents */}
            <mesh position={[-0.2, 0.01, 0]}>
              <boxGeometry args={[0.03, 0.02, 0.03]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.95} roughness={0.15} />
            </mesh>
            <mesh position={[0.2, 0.01, 0]}>
              <boxGeometry args={[0.03, 0.02, 0.03]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.95} roughness={0.15} />
            </mesh>
          </group>
        )}

        {config.eyewear === "goldFrames" && (
          <group position={[0, 0.03, 0.32]}>
            <mesh position={[-0.12, 0, 0]}>
              <torusGeometry args={[0.06, 0.008, 12, 24]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.95} roughness={0.15} />
            </mesh>
            <mesh position={[0.12, 0, 0]}>
              <torusGeometry args={[0.06, 0.008, 12, 24]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.95} roughness={0.15} />
            </mesh>
            <mesh position={[0, 0.02, 0]}>
              <boxGeometry args={[0.08, 0.008, 0.008]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.95} roughness={0.15} />
            </mesh>
          </group>
        )}

        {/* Headphones Accessory */}
        {config.accessory === "headphones" && (
          <group position={[0, 0.04, 0]}>
            <mesh position={[0, 0.34, 0]}>
              <torusGeometry args={[0.35, 0.03, 12, 28, Math.PI]} />
              <meshStandardMaterial color="#161413" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Left Earcup */}
            <group position={[-0.38, -0.02, 0]}>
              <mesh>
                <cylinderGeometry args={[0.11, 0.11, 0.06, 20]} />
                <meshStandardMaterial color="#0f0e0d" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh position={[-0.03, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <torusGeometry args={[0.08, 0.01, 12, 20]} />
                <meshStandardMaterial
                  color="#c9a86a"
                  emissive="#c9a86a"
                  emissiveIntensity={1.8}
                  toneMapped={false}
                />
              </mesh>
            </group>
            {/* Right Earcup */}
            <group position={[0.38, -0.02, 0]}>
              <mesh>
                <cylinderGeometry args={[0.11, 0.11, 0.06, 20]} />
                <meshStandardMaterial color="#0f0e0d" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh position={[0.03, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <torusGeometry args={[0.08, 0.01, 12, 20]} />
                <meshStandardMaterial
                  color="#c9a86a"
                  emissive="#c9a86a"
                  emissiveIntensity={1.8}
                  toneMapped={false}
                />
              </mesh>
            </group>
          </group>
        )}

        {/* ============================================================ */}
        {/* 7. HAIRSTYLES (Scaled Proportionally to Head)                */}
        {/* ============================================================ */}
        {config.hairStyle === "slick" && (
          <group position={[0, 0.2, -0.04]}>
            <mesh position={[0, 0.08, 0]} scale={[0.92, 0.65, 1.05]}>
              <sphereGeometry args={[0.35, 24, 24]} />
              <meshStandardMaterial color={hairColor} roughness={0.3} metalness={0.2} />
            </mesh>
            <mesh position={[0, 0.15, 0.18]} rotation={[-0.3, 0, 0]} scale={[0.78, 0.35, 0.5]}>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshStandardMaterial color={hairColor} roughness={0.3} metalness={0.2} />
            </mesh>
          </group>
        )}

        {config.hairStyle === "pompadour" && (
          <group position={[0, 0.26, 0.04]}>
            <mesh position={[0, 0.14, 0.08]} rotation={[-0.25, 0, 0]} scale={[0.75, 0.7, 0.95]}>
              <sphereGeometry args={[0.32, 20, 20]} />
              <meshStandardMaterial color={hairColor} roughness={0.35} metalness={0.15} />
            </mesh>
            <mesh position={[0, 0.02, -0.12]} scale={[0.9, 0.55, 0.8]}>
              <sphereGeometry args={[0.34, 18, 18]} />
              <meshStandardMaterial color={hairColor} roughness={0.4} metalness={0.1} />
            </mesh>
          </group>
        )}

        {config.hairStyle === "spiky" && (
          <group position={[0, 0.24, 0]}>
            <mesh position={[0, 0.06, -0.04]} scale={[0.92, 0.6, 0.95]}>
              <sphereGeometry args={[0.34, 18, 18]} />
              <meshStandardMaterial color={hairColor} roughness={0.5} />
            </mesh>
            {[
              { pos: [0, 0.26, 0.06], rot: [0.2, 0, 0], scale: 0.13 },
              { pos: [-0.14, 0.23, 0.04], rot: [0.1, 0, -0.3], scale: 0.11 },
              { pos: [0.14, 0.23, 0.04], rot: [0.1, 0, 0.3], scale: 0.11 },
              { pos: [-0.09, 0.26, -0.07], rot: [-0.2, 0, -0.2], scale: 0.12 },
              { pos: [0.09, 0.26, -0.07], rot: [-0.2, 0, 0.2], scale: 0.12 },
            ].map((spike, idx) => (
              <mesh
                key={idx}
                position={spike.pos as [number, number, number]}
                rotation={spike.rot as [number, number, number]}
              >
                <coneGeometry args={[spike.scale * 0.7, spike.scale * 1.8, 6]} />
                <meshStandardMaterial color={hairColor} roughness={0.4} />
              </mesh>
            ))}
          </group>
        )}

        {config.hairStyle === "bob" && (
          <group position={[0, 0.18, -0.02]}>
            <mesh position={[0, 0.1, 0]} scale={[0.96, 0.65, 1.05]}>
              <sphereGeometry args={[0.35, 20, 20]} />
              <meshStandardMaterial color={hairColor} roughness={0.35} />
            </mesh>
            <mesh position={[-0.32, -0.1, 0.08]} rotation={[0, 0, 0.1]}>
              <boxGeometry args={[0.08, 0.36, 0.32]} />
              <meshStandardMaterial color={hairColor} roughness={0.35} />
            </mesh>
            <mesh position={[0.32, -0.1, 0.08]} rotation={[0, 0, -0.1]}>
              <boxGeometry args={[0.08, 0.36, 0.32]} />
              <meshStandardMaterial color={hairColor} roughness={0.35} />
            </mesh>
            <mesh position={[0, 0.06, 0.29]}>
              <boxGeometry args={[0.4, 0.1, 0.1]} />
              <meshStandardMaterial color={hairColor} roughness={0.35} />
            </mesh>
          </group>
        )}

        {config.hairStyle === "afro" && (
          <group position={[0, 0.25, -0.03]}>
            <mesh scale={[1.15, 1.15, 1.1]}>
              <sphereGeometry args={[0.38, 24, 24]} />
              <meshStandardMaterial color={hairColor} roughness={0.92} metalness={0.02} />
            </mesh>
          </group>
        )}

        {config.hairStyle === "wavy" && (
          <group position={[0, 0.19, 0]}>
            <mesh position={[0, 0.12, -0.02]} scale={[0.98, 0.7, 1.05]}>
              <sphereGeometry args={[0.35, 20, 20]} />
              <meshStandardMaterial color={hairColor} roughness={0.4} />
            </mesh>
            <mesh position={[-0.24, 0.02, 0.2]} rotation={[0.2, 0, -0.2]}>
              <capsuleGeometry args={[0.06, 0.18, 8, 14]} />
              <meshStandardMaterial color={hairColor} roughness={0.4} />
            </mesh>
            <mesh position={[0.24, 0.02, 0.2]} rotation={[0.2, 0, 0.2]}>
              <capsuleGeometry args={[0.06, 0.18, 8, 14]} />
              <meshStandardMaterial color={hairColor} roughness={0.4} />
            </mesh>
          </group>
        )}

        {config.hairStyle === "buzz" && (
          <group position={[0, 0.18, -0.01]}>
            <mesh scale={[0.92, 0.68, 0.98]}>
              <sphereGeometry args={[0.36, 20, 20]} />
              <meshStandardMaterial color={hairColor} roughness={0.95} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
}
