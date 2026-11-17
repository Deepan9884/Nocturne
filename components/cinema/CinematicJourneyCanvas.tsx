"use client";

import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export interface CinematicJourneyCanvasProps {
  progress: number; // 0.0 to 1.0 continuous scroll
  mousePos: { x: number; y: number };
  activeFilmTitle?: string;
  themeColor?: string;
}

export interface LuxuryCinemaSeatItem {
  pos: THREE.Vector3;
  isSweetSpot: boolean;
  row: number;
  col: number;
  label: string;
}

function LuxuryCinemaSeat({ item }: { item: LuxuryCinemaSeatItem }) {
  const isAisleSeat = item.col === 3 || item.col === 4;

  return (
    <group position={item.pos}>
      {/* 1. Heavy Bronze Cast Circular Anchor Plinth & Mounting Rings */}
      <mesh position={[0, 0.012, 0]}>
        <cylinderGeometry args={[0.18, 0.20, 0.025, 24]} />
        <meshStandardMaterial color="#0c0b0e" metalness={0.92} roughness={0.22} />
      </mesh>
      {/* Polished Champagne Gold Plinth Beveled Ring */}
      <mesh position={[0, 0.025, 0]}>
        <cylinderGeometry args={[0.185, 0.185, 0.008, 24]} />
        <meshStandardMaterial color="#dfc28d" metalness={0.94} roughness={0.14} />
      </mesh>
      {/* Central Flared Column Pedestal */}
      <mesh position={[0, 0.10, 0]}>
        <cylinderGeometry args={[0.055, 0.09, 0.18, 20]} />
        <meshStandardMaterial color="#141318" metalness={0.88} roughness={0.24} />
      </mesh>
      {/* Champagne Gold Mounting Collar */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.095, 0.095, 0.018, 20]} />
        <meshStandardMaterial color="#dfc28d" metalness={0.94} roughness={0.14} />
      </mesh>

      {/* 2. Sculpted Curvaceous Velvet Cushion Foundation */}
      {/* Base Foundation Tier Body (Deep royal oxblood) */}
      <mesh position={[0, 0.23, 0.02]}>
        <boxGeometry args={[0.76, 0.12, 0.58]} />
        <meshStandardMaterial color="#5a101a" roughness={0.62} metalness={0.04} />
      </mesh>
      {/* Foundation Front Waterfall Bullnose Roll */}
      <mesh position={[0, 0.23, -0.27]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.76, 24]} />
        <meshStandardMaterial color="#5a101a" roughness={0.62} metalness={0.04} />
      </mesh>
      {/* Satin Champagne Gold Perimeter Piping Bead */}
      <mesh position={[0, 0.285, 0.02]}>
        <boxGeometry args={[0.78, 0.012, 0.58]} />
        <meshStandardMaterial color="#dfc28d" metalness={0.88} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.285, -0.27]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.008, 0.008, 0.78, 20]} />
        <meshStandardMaterial color="#dfc28d" metalness={0.88} roughness={0.22} />
      </mesh>

      {/* Upper Pillow-Top Cushion - Channel-Tufted Upholstery with Cylindrical Bolster Rolls */}
      <mesh position={[0, 0.325, 0.01]}>
        <boxGeometry args={[0.34, 0.07, 0.56]} />
        <meshStandardMaterial color="#881a29" roughness={0.48} metalness={0.06} />
      </mesh>
      {/* Left Thigh Bolster Cylinder Roll */}
      <mesh position={[-0.24, 0.33, 0.01]}>
        <cylinderGeometry args={[0.065, 0.065, 0.56, 20]} />
        <meshStandardMaterial color="#781422" roughness={0.52} metalness={0.05} />
      </mesh>
      {/* Right Thigh Bolster Cylinder Roll */}
      <mesh position={[0.24, 0.33, 0.01]}>
        <cylinderGeometry args={[0.065, 0.065, 0.56, 20]} />
        <meshStandardMaterial color="#781422" roughness={0.52} metalness={0.05} />
      </mesh>
      {/* Front Comfort Waterfall Velvet Roll */}
      <mesh position={[0, 0.31, -0.27]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.045, 0.045, 0.74, 24]} />
        <meshStandardMaterial color="#881a29" roughness={0.48} metalness={0.06} />
      </mesh>

      {/* Motorized-Style Retractable Rounded Calf-Rest Bolster tucked under front */}
      <mesh position={[0, 0.16, -0.28]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.055, 0.055, 0.70, 24]} />
        <meshStandardMaterial color="#62121e" roughness={0.58} metalness={0.04} />
      </mesh>
      {/* Polished Gold Calf-Rest Rounded Trim Collars */}
      {[-0.35, 0.35].map((x, i) => (
        <mesh key={i} position={[x, 0.16, -0.28]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.058, 0.058, 0.015, 20]} />
          <meshStandardMaterial color="#dfc28d" metalness={0.94} roughness={0.14} />
        </mesh>
      ))}

      {/* 3. Ergonomic Fluted Curvaceous Backrest (Facing -Z toward screen, back at +Z) */}
      <group position={[0, 0.58, 0.24]} rotation={[0.08, 0, 0]}>
        {/* Core Backrest Upholstery Frame */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.74, 0.50, 0.10]} />
          <meshStandardMaterial color="#62111c" roughness={0.58} metalness={0.05} />
        </mesh>
        {/* Fluted Vertical Pillowed Velvet Cushions (Front Face facing Screen) */}
        {/* Center Flute Pillowed Half-Cylinder */}
        <mesh position={[0, 0, -0.055]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.46, 20, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#881a29" roughness={0.48} metalness={0.06} />
        </mesh>
        {/* Left Flute Pillowed Half-Cylinder */}
        <mesh position={[-0.20, 0, -0.05]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.46, 16, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#781422" roughness={0.50} metalness={0.05} />
        </mesh>
        {/* Right Flute Pillowed Half-Cylinder */}
        <mesh position={[0.20, 0, -0.05]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.46, 16, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#781422" roughness={0.50} metalness={0.05} />
        </mesh>
        {/* Left Ergonomic Torso Bolster Cylinder Wing */}
        <mesh position={[-0.34, 0, -0.03]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.48, 16]} />
          <meshStandardMaterial color="#701220" roughness={0.52} metalness={0.05} />
        </mesh>
        {/* Right Ergonomic Torso Bolster Cylinder Wing */}
        <mesh position={[0.34, 0, -0.03]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.48, 16]} />
          <meshStandardMaterial color="#701220" roughness={0.52} metalness={0.05} />
        </mesh>

        {/* 4. Luxury Rear Shell & Amenities (Seen by viewer seated behind) */}
        {/* Curvaceous Sculpted Rear Frame with Rounded Corners & Bullnose Profile */}
        <group position={[0, 0, 0.064]}>
          {/* Central High-Gloss Makassar Ebony Back Shell */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.64, 0.42, 0.018]} />
            <meshStandardMaterial color="#160e0a" roughness={0.24} metalness={0.12} />
          </mesh>

          {/* Semicircular Rounded Fluted Bullnose Side Rails (Left & Right) */}
          {[-0.32, 0.32].map((railX, ri) => (
            <mesh key={`rear-side-${ri}`} position={[railX, 0, 0]}>
              <cylinderGeometry args={[0.028, 0.028, 0.42, 20]} />
              <meshStandardMaterial color="#160e0a" roughness={0.24} metalness={0.12} />
            </mesh>
          ))}

          {/* Semicircular Rounded Top & Bottom Bullnose Rails */}
          {[-0.21, 0.21].map((railY, ri) => (
            <mesh key={`rear-tb-${ri}`} position={[0, railY, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.028, 0.028, 0.64, 20]} />
              <meshStandardMaterial color="#160e0a" roughness={0.24} metalness={0.12} />
            </mesh>
          ))}

          {/* 4 Spherical Rounded Corner Beads connecting the curved rails */}
          {[
            [-0.32, 0.21],
            [0.32, 0.21],
            [-0.32, -0.21],
            [0.32, -0.21],
          ].map(([cx, cy], ci) => (
            <mesh key={`corner-bead-${ci}`} position={[cx, cy, 0]}>
              <sphereGeometry args={[0.028, 16, 16]} />
              <meshStandardMaterial color="#160e0a" roughness={0.24} metalness={0.12} />
            </mesh>
          ))}

          {/* Continuous Polished Champagne Gold Perimeter Accent Piping */}
          <mesh position={[0, 0.22, -0.004]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.009, 0.009, 0.68, 20]} />
            <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.12} />
          </mesh>
          <mesh position={[0, -0.22, -0.004]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.009, 0.009, 0.68, 20]} />
            <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.12} />
          </mesh>
          {[-0.33, 0.33].map((px, pi) => (
            <mesh key={`gold-pipe-${pi}`} position={[px, 0, -0.004]}>
              <cylinderGeometry args={[0.009, 0.009, 0.44, 20]} />
              <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.12} />
            </mesh>
          ))}
          {[
            [-0.33, 0.22],
            [0.33, 0.22],
            [-0.33, -0.22],
            [0.33, -0.22],
          ].map(([gx, gy], gi) => (
            <mesh key={`gold-corner-${gi}`} position={[gx, gy, -0.004]}>
              <sphereGeometry args={[0.010, 16, 16]} />
              <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.12} />
            </mesh>
          ))}

          {/* Inset Fluted Acoustic Velvet Panel with Pillowed Vertical Ribs */}
          <mesh position={[0, 0.02, 0.011]}>
            <boxGeometry args={[0.56, 0.32, 0.01]} />
            <meshStandardMaterial color="#4c0c16" roughness={0.65} metalness={0.04} />
          </mesh>
          {/* Vertical Fluted Velvet Ribs */}
          {[-0.20, -0.10, 0, 0.10, 0.20].map((rx, ri) => (
            <mesh key={`rib-${ri}`} position={[rx, 0.02, 0.016]}>
              <cylinderGeometry args={[0.012, 0.012, 0.31, 12]} />
              <meshStandardMaterial color="#6a121e" roughness={0.55} metalness={0.05} />
            </mesh>
          ))}
        </group>

        {/* Hand-Stitched Saddle Leather VIP Pocket with Sculpted Rounded Bottom */}
        <group position={[0, -0.08, 0.086]}>
          {/* Leather Pouch Body */}
          <mesh>
            <boxGeometry args={[0.50, 0.16, 0.016]} />
            <meshStandardMaterial color="#221612" roughness={0.56} metalness={0.08} />
          </mesh>
          {/* Semicircular Rounded Bottom Leather Roll */}
          <mesh position={[0, -0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.016, 0.016, 0.50, 20]} />
            <meshStandardMaterial color="#221612" roughness={0.56} metalness={0.08} />
          </mesh>
          {/* Rounded Bottom Corner End Finials */}
          {[-0.25, 0.25].map((cx, ci) => (
            <mesh key={`pouch-corner-${ci}`} position={[cx, -0.08, 0]}>
              <sphereGeometry args={[0.016, 16, 16]} />
              <meshStandardMaterial color="#221612" roughness={0.56} metalness={0.08} />
            </mesh>
          ))}
          {/* Champagne Stitched Leather Top Rim with Rounded Bead */}
          <mesh position={[0, 0.08, 0.006]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.008, 0.008, 0.50, 16]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.88} roughness={0.22} />
          </mesh>
          {/* Brass Rivet Accents */}
          {[-0.22, 0.22].map((rx, ri) => (
            <mesh key={`rivet-${ri}`} position={[rx, 0.06, 0.012]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 0.006, 16]} />
              <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.15} />
            </mesh>
          ))}
        </group>

        {/* Architectural Polished Brass Stadium Cartouche (Row & Seat ID) */}
        <group position={[0, 0.13, 0.086]}>
          {/* Center Brass Body */}
          <mesh>
            <boxGeometry args={[0.16, 0.06, 0.01]} />
            <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.14} />
          </mesh>
          {/* Semicircular Rounded Cartouche Ends */}
          {[-0.08, 0.08].map((endX, ei) => (
            <mesh key={ei} position={[endX, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.03, 0.03, 0.01, 20]} />
              <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.14} />
            </mesh>
          ))}
          {/* Dark Oxidized Engraving Inset */}
          <mesh position={[0, 0, 0.006]}>
            <boxGeometry args={[0.16, 0.046, 0.004]} />
            <meshStandardMaterial color="#120d0b" roughness={0.4} metalness={0.2} />
          </mesh>
          {/* Mini Nocturne Shield Crest */}
          <mesh position={[0, 0, 0.009]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.016, 0.016, 0.004]} />
            <meshStandardMaterial color="#ffe2a0" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>
      </group>

      {/* 5. Pillowed Executive Headrest with Voluptuous Arched Silhouette */}
      <group position={[0, 0.88, 0.28]} rotation={[0.05, 0, 0]}>
        {/* Curvaceous Dark Walnut Capsule Rear Shell */}
        <group position={[0, 0, 0.055]}>
          {/* Central Plate */}
          <mesh>
            <boxGeometry args={[0.50, 0.16, 0.018]} />
            <meshStandardMaterial color="#160e0a" roughness={0.25} metalness={0.1} />
          </mesh>
          {/* Semicircular Curvaceous Walnut Ends */}
          {[-0.25, 0.25].map((wx, wi) => (
            <mesh key={`headrest-end-${wi}`} position={[wx, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.08, 0.08, 0.018, 24]} />
              <meshStandardMaterial color="#160e0a" roughness={0.25} metalness={0.1} />
            </mesh>
          ))}
          {/* Inset Fluted Acoustic Velvet Capsule on Rear */}
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[0.42, 0.11, 0.008]} />
            <meshStandardMaterial color="#520d18" roughness={0.65} metalness={0.04} />
          </mesh>
          {[-0.21, 0.21].map((vx, vi) => (
            <mesh key={`velvet-end-${vi}`} position={[vx, 0, 0.01]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.055, 0.055, 0.008, 20]} />
              <meshStandardMaterial color="#520d18" roughness={0.65} metalness={0.04} />
            </mesh>
          ))}
          {/* Polished Brass Nocturne Medallion on Rear Headrest */}
          <mesh position={[0, 0, 0.016]}>
            <cylinderGeometry args={[0.032, 0.032, 0.006, 24]} />
            <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.12} />
          </mesh>
        </group>

        {/* Front Center Voluptuous Pillow-Roll Cushion (Facing Screen) */}
        <mesh position={[0, 0, -0.02]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.075, 0.075, 0.44, 24]} />
          <meshStandardMaterial color="#901e2e" roughness={0.44} metalness={0.06} />
        </mesh>
        {/* Spherical Rounded End Caps on Center Roll */}
        {[-0.22, 0.22].map((endX, ei) => (
          <mesh key={ei} position={[endX, 0, -0.02]}>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshStandardMaterial color="#7e1624" roughness={0.48} metalness={0.05} />
          </mesh>
        ))}

        {/* Front Left Wing Bolster */}
        <mesh position={[-0.28, 0, -0.01]} rotation={[0, -0.18, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.16, 16]} />
          <meshStandardMaterial color="#7e1624" roughness={0.48} metalness={0.05} />
        </mesh>
        {/* Front Right Wing Bolster */}
        <mesh position={[0.28, 0, -0.01]} rotation={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.16, 16]} />
          <meshStandardMaterial color="#7e1624" roughness={0.48} metalness={0.05} />
        </mesh>

        {/* Polished Brass Nocturne Monogram on Front Headrest */}
        <mesh position={[0, 0, -0.096]}>
          <boxGeometry args={[0.09, 0.055, 0.008]} />
          <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.12} />
        </mesh>

        {/* Arched Curvaceous Walnut Crown Roll along Top (Replaces Boxy Plank) */}
        <mesh position={[0, 0.095, 0.01]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.034, 0.034, 0.58, 24]} />
          <meshStandardMaterial color="#160e0a" roughness={0.3} metalness={0.15} />
        </mesh>
        {/* Spherical Crown Finials on Left and Right Ends */}
        {[-0.29, 0.29].map((fx, fi) => (
          <group key={`crown-finial-${fi}`} position={[fx, 0.095, 0.01]}>
            <mesh>
              <sphereGeometry args={[0.035, 16, 16]} />
              <meshStandardMaterial color="#160e0a" roughness={0.3} metalness={0.15} />
            </mesh>
            {/* Polished Gold Collar Ring */}
            <mesh position={[fi === 0 ? 0.02 : -0.02, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.036, 0.006, 12, 24]} />
              <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.12} />
            </mesh>
          </group>
        ))}
        {/* Polished Champagne Gold Inlay Ribbon along Cap Rail */}
        <mesh position={[0, 0.128, 0.01]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.006, 0.006, 0.54, 20]} />
          <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.12} />
        </mesh>
      </group>

      {/* 6. Curvaceous Sculpted VIP Armrest Consoles (Left & Right) */}
      {/* Left Console */}
      <group position={[-0.44, 0.40, 0]}>
        {/* Solid Makassar Wood Main Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.12, 0.30, 0.52]} />
          <meshStandardMaterial color="#160f0c" roughness={0.30} metalness={0.12} />
        </mesh>
        {/* Front Waterfall Rounded Nose Cylinder */}
        <mesh position={[0, 0, -0.26]}>
          <cylinderGeometry args={[0.06, 0.06, 0.30, 24]} />
          <meshStandardMaterial color="#160f0c" roughness={0.30} metalness={0.12} />
        </mesh>
        {/* Rear Bullnose Cylinder */}
        <mesh position={[0, 0, 0.26]}>
          <cylinderGeometry args={[0.06, 0.06, 0.30, 24]} />
          <meshStandardMaterial color="#160f0c" roughness={0.30} metalness={0.12} />
        </mesh>

        {/* Padded Stitched Leather Arm Cap */}
        <mesh position={[0, 0.165, 0]}>
          <boxGeometry args={[0.13, 0.04, 0.52]} />
          <meshStandardMaterial color="#201511" roughness={0.42} metalness={0.08} />
        </mesh>
        {/* Front Rounded Leather Waterfall Roll */}
        <mesh position={[0, 0.165, -0.26]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.065, 0.065, 0.13, 24]} />
          <meshStandardMaterial color="#201511" roughness={0.42} metalness={0.08} />
        </mesh>
        {/* Rear Rounded Leather Roll */}
        <mesh position={[0, 0.165, 0.26]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.065, 0.065, 0.13, 24]} />
          <meshStandardMaterial color="#201511" roughness={0.42} metalness={0.08} />
        </mesh>
        {/* Gold Border Trim under Leather Pad */}
        <mesh position={[0, 0.145, 0]}>
          <boxGeometry args={[0.132, 0.006, 0.52]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.15} />
        </mesh>
      </group>

      {/* Right Console */}
      <group position={[0.44, 0.40, 0]}>
        {/* Solid Makassar Wood Main Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.12, 0.30, 0.52]} />
          <meshStandardMaterial color="#160f0c" roughness={0.30} metalness={0.12} />
        </mesh>
        {/* Front Waterfall Rounded Nose Cylinder */}
        <mesh position={[0, 0, -0.26]}>
          <cylinderGeometry args={[0.06, 0.06, 0.30, 24]} />
          <meshStandardMaterial color="#160f0c" roughness={0.30} metalness={0.12} />
        </mesh>
        {/* Rear Bullnose Cylinder */}
        <mesh position={[0, 0, 0.26]}>
          <cylinderGeometry args={[0.06, 0.06, 0.30, 24]} />
          <meshStandardMaterial color="#160f0c" roughness={0.30} metalness={0.12} />
        </mesh>

        {/* Padded Stitched Leather Arm Cap */}
        <mesh position={[0, 0.165, 0]}>
          <boxGeometry args={[0.13, 0.04, 0.52]} />
          <meshStandardMaterial color="#201511" roughness={0.42} metalness={0.08} />
        </mesh>
        {/* Front Rounded Leather Waterfall Roll */}
        <mesh position={[0, 0.165, -0.26]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.065, 0.065, 0.13, 24]} />
          <meshStandardMaterial color="#201511" roughness={0.42} metalness={0.08} />
        </mesh>
        {/* Rear Rounded Leather Roll */}
        <mesh position={[0, 0.165, 0.26]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.065, 0.065, 0.13, 24]} />
          <meshStandardMaterial color="#201511" roughness={0.42} metalness={0.08} />
        </mesh>
        {/* Gold Border Trim under Leather Pad */}
        <mesh position={[0, 0.145, 0]}>
          <boxGeometry args={[0.132, 0.006, 0.52]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.15} />
        </mesh>

        {/* Inset Champagne Brass Cupholder with Inner Ambient Ring */}
        <group position={[0, 0.19, -0.16]}>
          {/* Beveled Brass Outer Rim */}
          <mesh>
            <cylinderGeometry args={[0.044, 0.044, 0.02, 20]} />
            <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.12} />
          </mesh>
          {/* Dark Felt Well Interior */}
          <mesh position={[0, 0.002, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.02, 20]} />
            <meshStandardMaterial color="#120c0a" roughness={0.7} metalness={0.1} />
          </mesh>
          {/* Illuminated Amber Base Halo */}
          <mesh position={[0, -0.007, 0]}>
            <cylinderGeometry args={[0.033, 0.033, 0.005, 20]} />
            <meshStandardMaterial color="#ffb040" emissive="#ff9420" emissiveIntensity={0.60} />
          </mesh>
        </group>

        {/* VIP Recline & Audio Control Console on Inner Side (facing occupant) */}
        <group position={[-0.061, 0.10, 0.06]}>
          {/* Brushed Brass Beveled Plate */}
          <mesh>
            <boxGeometry args={[0.006, 0.045, 0.13]} />
            <meshStandardMaterial color="#dfc28d" metalness={0.94} roughness={0.15} />
          </mesh>
          {/* Tactile Mini Brass Buttons */}
          <mesh position={[-0.004, 0.010, -0.030]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.006, 0.006, 0.006, 12]} />
            <meshStandardMaterial color="#f0dcb2" metalness={0.96} roughness={0.1} />
          </mesh>
          <mesh position={[-0.004, -0.010, -0.030]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.006, 0.006, 0.006, 12]} />
            <meshStandardMaterial color="#f0dcb2" metalness={0.96} roughness={0.1} />
          </mesh>
          {/* Rotary Volume Dial */}
          <mesh position={[-0.004, 0, 0.022]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.012, 0.012, 0.007, 16]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.95} roughness={0.15} />
          </mesh>
          {/* Tiny Amber Micro-LED status indicator */}
          <mesh position={[-0.005, 0, -0.052]}>
            <sphereGeometry args={[0.0025, 8, 8]} />
            <meshStandardMaterial color="#ffc470" emissive="#ffa430" emissiveIntensity={1.0} />
          </mesh>
        </group>
      </group>

      {/* 7. Sweet Spot (Row F · Seat 07) Outer Brass Plaque & Welcoming Ambient Wash */}
      {item.isSweetSpot && (
        <group position={[0.51, 0.46, 0.10]}>
          {/* Main Brushed Brass Plaque */}
          <mesh>
            <boxGeometry args={[0.014, 0.08, 0.16]} />
            <meshStandardMaterial color="#dfc28d" metalness={0.96} roughness={0.12} />
          </mesh>
          {/* Dark Inlay Plate */}
          <mesh position={[0.008, 0, 0]}>
            <boxGeometry args={[0.004, 0.068, 0.14]} />
            <meshStandardMaterial color="#100c0a" roughness={0.3} metalness={0.2} />
          </mesh>
          {/* Golden Lettering Bar */}
          <mesh position={[0.010, 0, 0]}>
            <boxGeometry args={[0.002, 0.022, 0.10]} />
            <meshStandardMaterial color="#ffdf9e" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* Welcoming Golden Halo Light */}
          <pointLight intensity={0.7} distance={1.2} color="#f5c270" decay={1.8} />
        </group>
      )}

      {/* 8. Under-Seat Footwell Courtesy LED Glow */}
      {isAisleSeat && (
        <pointLight position={[item.col === 4 ? 0.32 : -0.32, 0.05, 0]} intensity={0.3} distance={1.0} color="#f5c270" decay={1.8} />
      )}
    </group>
  );
}

export default function CinematicJourneyCanvas({
  progress,
  mousePos,
  activeFilmTitle = "NOCTURNE · SCREEN 04",
  themeColor = "#e7c28a",
}: CinematicJourneyCanvasProps) {
  const timeRef = useRef(0);
  const screen04Ref = useRef<THREE.Mesh>(null);
  const screen05Ref = useRef<THREE.Mesh>(null);
  const screenCanvas04Ref = useRef<HTMLCanvasElement | null>(null);
  const screenCanvas05Ref = useRef<HTMLCanvasElement | null>(null);
  const screenTexture04Ref = useRef<THREE.CanvasTexture | null>(null);
  const screenTexture05Ref = useRef<THREE.CanvasTexture | null>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const barSpotRef = useRef<THREE.SpotLight>(null);
  const leftDoorRef = useRef<THREE.Group>(null);
  const rightDoorRef = useRef<THREE.Group>(null);
  const doorLightSpillRef = useRef<THREE.MeshBasicMaterial>(null);
  const lookAtRef = useRef(new THREE.Vector3(0, 4.72, -12.5));
  const barMuralRef = useRef<THREE.Mesh>(null);
  const corridorPoster1Ref = useRef<THREE.Mesh>(null);
  const corridorPoster2Ref = useRef<THREE.Mesh>(null);

  // Generate seats in the main auditorium (Zone A) with tiered rake
  const seatsZoneA = useMemo(() => {
    const list: Array<LuxuryCinemaSeatItem> = [];
    const rowLetters = ["Row D", "Row E", "Row F", "Row G", "Row H"];
    for (let r = 0; r < 5; r++) {
      const rowY = (r + 1) * 0.14; // Tiered cinema riser (+14cm per row, resting flush on top surface)
      const z = 2.0 + r * 2.2;
      for (let c = 0; c < 8; c++) {
        const gap = c >= 4 ? 0.75 : -0.75;
        const x = (c - 3.5) * 1.05 + gap * 0.4;
        const isSweetSpot = r === 2 && c === 4; // Row F, Seat 07 (Row 2 at z = 6.4, x = 0.825)
        const seatNum = c < 4 ? c + 1 : c + 3;
        list.push({
          pos: new THREE.Vector3(x, rowY, z),
          isSweetSpot,
          row: r,
          col: c,
          label: `${rowLetters[r]} · ${seatNum < 10 ? "0" : ""}${seatNum}`,
        });
      }
    }
    return list;
  }, []);

  // Floor lights along the center aisle
  const aisleGuideLights = useMemo(() => {
    const arr = new Float32Array(24 * 3);
    for (let i = 0; i < 24; i++) {
      const z = -12 + i * 1.3;
      const side = i % 2 === 0 ? -0.8 : 0.8;
      arr[i * 3] = side;
      arr[i * 3 + 1] = 0.04;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, []);

  // Ambient floating particles
  const particlesData = useMemo(() => {
    const count = 300;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = 0.5 + Math.random() * 8.5;
      arr[i * 3 + 2] = -26 + Math.random() * 45;
    }
    return arr;
  }, []);

  // Load Flow-generated Photorealistic & Veo 3.1 Video Textures
  useEffect(() => {
    const loader = new THREE.TextureLoader();

    // 1. Initial High-Res Film Still Fallbacks
    loader.load("/films/high-porch-bar.jpg", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      if (barMuralRef.current && !barMuralRef.current.userData.hasVideo) {
        barMuralRef.current.material = new THREE.MeshBasicMaterial({
          map: tex,
          side: THREE.DoubleSide,
        });
      }
    });

    // Dedicated high-resolution vertical cinematic marquee posters for the VIP Gallery
    loader.load("/films/poster-cosmic-voyage.jpg", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      if (corridorPoster1Ref.current) {
        corridorPoster1Ref.current.material = new THREE.MeshBasicMaterial({
          map: tex,
          toneMapped: false,
        });
      }
    });

    loader.load("/films/poster-neo-tokyo.jpg", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      if (corridorPoster2Ref.current) {
        corridorPoster2Ref.current.material = new THREE.MeshBasicMaterial({
          map: tex,
          toneMapped: false,
        });
      }
    });

    loader.load("/films/cosmic-voyage.jpg", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.repeat.set(1.0, 0.68);
      tex.offset.set(0.0, 0.16);
      if (screen04Ref.current && !screen04Ref.current.userData.hasVideo) {
        screen04Ref.current.material = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
      }
      if (screen05Ref.current && !screen05Ref.current.userData.hasVideo) {
        screen05Ref.current.material = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          opacity: 0.95,
        });
      }
    });

    // Helper to initialize and play looping muted video texture
    const setupVideo = (src: string, onReady: (vTex: THREE.VideoTexture) => void) => {
      const vid = document.createElement("video");
      vid.src = src;
      vid.crossOrigin = "anonymous";
      vid.loop = true;
      vid.muted = true;
      vid.playsInline = true;
      vid.autoplay = true;

      const vTex = new THREE.VideoTexture(vid);
      vTex.colorSpace = THREE.SRGBColorSpace;
      vTex.minFilter = THREE.LinearFilter;
      vTex.magFilter = THREE.LinearFilter;

      vid.play().then(() => {
        onReady(vTex);
      }).catch(() => {
        const startInteraction = () => {
          vid.play().then(() => onReady(vTex)).catch(() => {});
          window.removeEventListener("scroll", startInteraction);
          window.removeEventListener("click", startInteraction);
          window.removeEventListener("touchstart", startInteraction);
        };
        window.addEventListener("scroll", startInteraction, { passive: true });
        window.addEventListener("click", startInteraction, { passive: true });
        window.addEventListener("touchstart", startInteraction, { passive: true });
      });

      return { vid, vTex };
    };

    // 2. Video 1: Screen 04 Master Trailer (/films/cosmic-voyage.mp4)
    const res04 = setupVideo("/films/cosmic-voyage.mp4", (vTex) => {
      vTex.repeat.set(1.0, 0.68);
      vTex.offset.set(0.0, 0.16);
      if (screen04Ref.current) {
        screen04Ref.current.material = new THREE.MeshBasicMaterial({ map: vTex, side: THREE.DoubleSide });
        screen04Ref.current.userData.hasVideo = true;
      }
    });

    // 3. Video 2: High Porch Provisions Bar Living Mural (/films/high-porch-bar.mp4)
    const resBar = setupVideo("/films/high-porch-bar.mp4", (vTex) => {
      if (barMuralRef.current) {
        barMuralRef.current.material = new THREE.MeshBasicMaterial({
          map: vTex,
          side: THREE.DoubleSide,
        });
        barMuralRef.current.userData.hasVideo = true;
      }
    });

    // 4. Video 3: Screen 05 Premiere Suite Director's Master (/films/neo-tokyo-premiere.mp4)
    const res05 = setupVideo("/films/neo-tokyo-premiere.mp4", (vTex) => {
      if (screen05Ref.current) {
        screen05Ref.current.material = new THREE.MeshBasicMaterial({
          map: vTex,
          transparent: true,
          opacity: 0.98,
        });
        screen05Ref.current.userData.hasVideo = true;
      }
    });

    return () => {
      res04.vid.pause();
      res04.vTex.dispose();
      resBar.vid.pause();
      resBar.vTex.dispose();
      res05.vid.pause();
      res05.vTex.dispose();
    };
  }, []);

  // Paint dynamic 24fps frames on screens
  const updateScreenTextures = () => {
    const t = timeRef.current;

    // Paint Screen 04 (Main Auditorium)
    if (screenCanvas04Ref.current && screenTexture04Ref.current) {
      const c = screenCanvas04Ref.current;
      const ctx = c.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#0c0a08";
        ctx.fillRect(0, 0, c.width, c.height);

        const g = ctx.createRadialGradient(c.width / 2, c.height / 2, 10, c.width / 2, c.height / 2, c.width * 0.45);
        g.addColorStop(0, "rgba(231, 194, 138, 0.28)");
        g.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, c.width, c.height);

        ctx.textAlign = "center";
        ctx.fillStyle = "#c9a86a";
        ctx.font = "600 16px 'Manrope', sans-serif";
        ctx.letterSpacing = "6px";
        ctx.fillText("NOCTURNE · SCREEN 04 · ARCHITECTURAL SALON", c.width / 2, 80);

        ctx.fillStyle = "rgba(241, 233, 219, 0.95)";
        ctx.font = "italic 400 48px 'Cormorant Garamond', serif";
        ctx.fillText(activeFilmTitle, c.width / 2, c.height / 2 + 10);

        ctx.fillStyle = "rgba(201, 168, 106, 0.75)";
        ctx.font = "400 14px 'Manrope', sans-serif";
        ctx.letterSpacing = "4px";
        ctx.fillText("2.39:1 CINEMASCOPE · 4K MASTER · DOLBY ATMOS", c.width / 2, c.height / 2 + 60);

        screenTexture04Ref.current.needsUpdate = true;
      }
    }

    // Paint Screen 05 (Director's VIP Suite)
    if (screenCanvas05Ref.current && screenTexture05Ref.current) {
      const c = screenCanvas05Ref.current;
      const ctx = c.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#0c0a08";
        ctx.fillRect(0, 0, c.width, c.height);

        // Elegant 2.39:1 scope cinematic projection luminescence
        const g = ctx.createRadialGradient(c.width / 2, c.height / 2, 20, c.width / 2, c.height / 2, c.width * 0.55);
        g.addColorStop(0, "rgba(235, 205, 155, 0.45)");
        g.addColorStop(0.35, "rgba(201, 168, 106, 0.22)");
        g.addColorStop(0.7, "rgba(130, 95, 45, 0.08)");
        g.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, c.width, c.height);

        // Scope 2.39:1 subtle gold perimeter frame
        ctx.strokeStyle = "rgba(223, 194, 141, 0.35)";
        ctx.lineWidth = 2;
        ctx.strokeRect(30, 30, c.width - 60, c.height - 60);

        screenTexture05Ref.current.needsUpdate = true;
      }
    }
  };

  useFrame((state, delta) => {
    timeRef.current += delta;

    const cam = state.camera;
    const p = THREE.MathUtils.clamp(progress, 0, 1);

    // Continuous 4-Stage Collision-Free Cinematic Camera Kinematics:
    // Stage 1 (0.00 - 0.25): Foyer -> Center Aisle (X: 0.0, Z: 19.0 -> 12.0)
    // Stage 2 (0.25 - 0.48): Aisle Walkdown to Row F (Z: 12.0 -> 6.45), Sidestep into Seat F-07 (X: 0.0 -> 0.825), Optical Sweet Spot
    // Stage 3 (0.48 - 0.73): Rise from seat, return to aisle, front cross-aisle, step through opening double doors to High Porch
    // Stage 4 (0.73 - 1.00): Glide down Outer VIP Gallery (X: 9.8, Z: 1.1 -> -17.5 past Screen 04), turn left into Screen 05 Suite
    let camTargetX = 0;
    let camTargetY = 1.72;
    let camTargetZ = 19.0;
    let lookTargetX = 0;
    let lookTargetY = 4.72;
    let lookTargetZ = -12.5;

    // Double door animation between auditorium and High Porch mezzanine
    // Doors begin opening at p = 0.50 and are fully swung open by p = 0.60
    const doorProgress = THREE.MathUtils.clamp((p - 0.50) / 0.10, 0, 1);
    const doorEase = doorProgress * doorProgress * (3 - 2 * doorProgress);
    const doorAngle = doorEase * (Math.PI * 0.48); // ~86 degrees outward swing

    if (leftDoorRef.current) {
      leftDoorRef.current.rotation.y = -doorAngle;
    }
    if (rightDoorRef.current) {
      rightDoorRef.current.rotation.y = doorAngle;
    }
    if (doorLightSpillRef.current) {
      doorLightSpillRef.current.opacity = doorEase * 0.32;
    }

    if (p < 0.25) {
      // -------------------------------------------------------------
      // Stage 1 (0.00 - 0.25): Foyer -> Center Aisle Approach
      // Strictly along central aisle (x = 0), looking straight at Screen 04
      // -------------------------------------------------------------
      const t = p / 0.25;
      const ease = t * t * (3 - 2 * t);
      camTargetX = 0.0;
      camTargetY = THREE.MathUtils.lerp(1.72, 1.55, ease);
      camTargetZ = THREE.MathUtils.lerp(19.0, 12.0, ease);
      lookTargetX = 0.0;
      lookTargetY = 4.72;
      lookTargetZ = -12.5;
    } else if (p < 0.48) {
      // -------------------------------------------------------------
      // Stage 2 (0.25 - 0.48): Orchestra Seating & Sweet Spot F-07
      // -------------------------------------------------------------
      if (p < 0.36) {
        // Sub-phase 2A (0.25 - 0.36): Walk down center aisle between Row 4 & Row 3
        // Camera stays strictly in center aisle (x = 0.0) avoiding all seat collision
        const t = (p - 0.25) / (0.36 - 0.25);
        const ease = t * t * (3 - 2 * t);
        camTargetX = 0.0;
        camTargetY = THREE.MathUtils.lerp(1.55, 1.30, ease);
        camTargetZ = THREE.MathUtils.lerp(12.0, 6.45, ease);
        lookTargetX = 0.0;
        lookTargetY = 4.60;
        lookTargetZ = -12.5;
      } else if (p < 0.42) {
        // Sub-phase 2B (0.36 - 0.42): Sidestep smoothly into Seat F-07 and settle into cushion
        const t = (p - 0.36) / (0.42 - 0.36);
        const ease = t * t * (3 - 2 * t);
        camTargetX = THREE.MathUtils.lerp(0.0, 0.825, ease);
        camTargetY = THREE.MathUtils.lerp(1.30, 1.08, ease);
        camTargetZ = 6.45;
        lookTargetX = 0.0;
        lookTargetY = 4.60;
        lookTargetZ = -12.5;
      } else {
        // Sub-phase 2C (0.42 - 0.48): Seated in Seat F-07: The Optical Sweet Spot
        camTargetX = 0.825;
        camTargetY = 1.08;
        camTargetZ = 6.45;
        lookTargetX = 0.0;
        lookTargetY = 4.60;
        lookTargetZ = -12.5;
      }
    } else if (p < 0.73) {
      // -------------------------------------------------------------
      // Stage 3 (0.48 - 0.73): Rise from seat -> Cross-Aisle -> High Porch Veranda
      // Continuous grounded eye-level steadicam navigation
      // -------------------------------------------------------------
      if (p < 0.54) {
        // Sub-phase 3A (0.48 - 0.54): Rise from Seat F-07, step left back into center aisle
        const t = (p - 0.48) / (0.54 - 0.48);
        const ease = t * t * (3 - 2 * t);
        camTargetX = THREE.MathUtils.lerp(0.825, 0.0, ease);
        camTargetY = THREE.MathUtils.lerp(1.08, 1.72, ease);
        camTargetZ = THREE.MathUtils.lerp(6.45, 5.0, ease);
        // Head turns towards the right cinema exit doors
        lookTargetX = THREE.MathUtils.lerp(0.0, 4.6, ease);
        lookTargetY = THREE.MathUtils.lerp(4.60, 1.75, ease);
        lookTargetZ = THREE.MathUtils.lerp(-12.5, 2.0, ease);
      } else if (p < 0.60) {
        // Sub-phase 3B (0.54 - 0.60): Walk down aisle to front apron cross-aisle towards doorway
        // Doors smoothly swing open outward into terrace
        const t = (p - 0.54) / (0.60 - 0.54);
        const ease = t * t * (3 - 2 * t);
        camTargetX = THREE.MathUtils.lerp(0.0, 4.6, ease);
        camTargetY = 1.72;
        camTargetZ = THREE.MathUtils.lerp(5.0, 2.0, ease);
        lookTargetX = THREE.MathUtils.lerp(4.6, 9.5, ease);
        lookTargetY = THREE.MathUtils.lerp(1.75, 1.65, ease);
        lookTargetZ = THREE.MathUtils.lerp(2.0, 1.4, ease);
      } else if (p < 0.66) {
        // Sub-phase 3C (0.60 - 0.66): Glide through open doors across bridge onto High Porch deck at eye level
        const t = (p - 0.60) / (0.66 - 0.60);
        const ease = t * t * (3 - 2 * t);
        camTargetX = THREE.MathUtils.lerp(4.6, 9.5, ease);
        camTargetY = THREE.MathUtils.lerp(1.72, 1.75, ease);
        camTargetZ = THREE.MathUtils.lerp(2.0, 1.4, ease);
        lookTargetX = THREE.MathUtils.lerp(9.5, 13.1, ease);
        lookTargetY = THREE.MathUtils.lerp(1.65, 1.25, ease);
        lookTargetZ = THREE.MathUtils.lerp(1.4, -0.2, ease);
      } else {
        // Sub-phase 3D (0.66 - 0.73): Standing on High Porch Veranda overlooking vintage marble bar
        camTargetX = 9.5;
        camTargetY = 1.75;
        camTargetZ = 1.4;
        lookTargetX = 13.1;
        lookTargetY = 1.25;
        lookTargetZ = -0.2;
      }
    } else {
      // -------------------------------------------------------------
      // Stage 4 (0.73 - 1.00): VIP Gallery Corridor -> Screen 05 Premiere Suite
      // -------------------------------------------------------------
      if (p < 0.84) {
        // Sub-phase 4A (0.73 - 0.84): Walk from High Porch down VIP corridor towards illuminated portal
        const t = (p - 0.73) / (0.84 - 0.73);
        const ease = t * t * (3 - 2 * t);
        camTargetX = 9.8;
        camTargetY = 1.72;
        camTargetZ = THREE.MathUtils.lerp(1.4, -17.5, ease);

        // Gaze turns from bar down the hall, then gracefully angles toward the glowing VIP Suite entrance
        lookTargetX = THREE.MathUtils.lerp(12.0, 0.0, ease);
        lookTargetY = THREE.MathUtils.lerp(1.72, 3.2, ease);
        lookTargetZ = THREE.MathUtils.lerp(0.0, -29.0, ease);
      } else if (p < 0.92) {
        // Sub-phase 4B (0.84 - 0.92): Step through VIP archway into the grand Director's Suite
        const t = (p - 0.84) / (0.92 - 0.84);
        const ease = t * t * (3 - 2 * t);
        camTargetX = THREE.MathUtils.lerp(9.8, 0.0, ease);
        camTargetY = THREE.MathUtils.lerp(1.72, 1.65, ease);
        camTargetZ = THREE.MathUtils.lerp(-17.5, -21.0, ease);

        // Gaze remains locked dead-center onto Screen 05
        lookTargetX = 0.0;
        lookTargetY = 4.72;
        lookTargetZ = -29.0;
      } else {
        // Sub-phase 4C (0.92 - 1.00): Seated in VIP Director's Row facing Screen 05 directly
        camTargetX = 0.0;
        camTargetY = 1.65;
        camTargetZ = -21.0;
        lookTargetX = 0.0;
        lookTargetY = 4.72;
        lookTargetZ = -29.0;
      }
    }

    // Add mouse parallax
    // When seated in the sweet spot (Stage 2: 0.38 - 0.48), gently attenuate mouse sway so viewer stays in their seat
    const isSweetSpotOccupied = p >= 0.38 && p <= 0.48;
    const mouseScaleX = isSweetSpotOccupied ? 0.12 : 0.45;
    const mouseScaleY = isSweetSpotOccupied ? 0.08 : 0.22;
    const mouseInfluenceX = mousePos.x * mouseScaleX;
    const mouseInfluenceY = mousePos.y * mouseScaleY;

    // Fluid steadicam position damping
    cam.position.x += (camTargetX + mouseInfluenceX - cam.position.x) * 0.085;
    cam.position.y += (camTargetY + mouseInfluenceY - cam.position.y) * 0.085;
    cam.position.z += (camTargetZ - cam.position.z) * 0.085;

    // Damped steadicam orientation tracking (eliminates angular snaps)
    lookAtRef.current.lerp(new THREE.Vector3(lookTargetX, lookTargetY, lookTargetZ), 0.085);
    cam.lookAt(lookAtRef.current);

    // Subtle natural banking roll during turns
    const targetRoll = (camTargetX - cam.position.x) * -0.018;
    cam.rotation.z = THREE.MathUtils.lerp(cam.rotation.z, targetRoll, 0.08);

    // Dust particles drift
    if (particlesRef.current) {
      const arr = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < arr.length; i += 3) {
        arr[i + 1] += delta * 0.035;
        arr[i] += Math.sin(timeRef.current * 0.5 + i) * delta * 0.015;
        if (arr[i + 1] > 8.5) arr[i + 1] = 0.5;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      <color attach="background" args={["#050506"]} />

      {/* Atmospheric lighting */}
      <ambientLight intensity={0.4} color="#f0d5b0" />

      {/* Main Screen 04 Projector Spotlight */}
      <spotLight
        position={[0, 9.5, 6]}
        target-position={[0, 4.72, -12.5]}
        intensity={3.5}
        angle={0.7}
        penumbra={0.65}
        color={themeColor}
        distance={40}
      />

      {/* Screen 04 Rim Light */}
      <pointLight position={[0, 4.72, -12]} intensity={1.8} distance={22} color="#e7c28a" />

      {/* Art Deco Architectural Wall Sconces (Left Auditorium Wall) */}
      {[-8.0, -3.0, 2.0, 7.0, 12.0, 17.0].map((zPos, idx) => (
        <group key={`sconce-left-${idx}`} position={[-8.12, 4.2, zPos]}>
          <mesh>
            <boxGeometry args={[0.04, 0.88, 0.16]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.2} />
          </mesh>
          <mesh position={[0.05, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.72, 16]} />
            <meshBasicMaterial color="#ffe3b0" />
          </mesh>
          <mesh position={[0.05, 0.38, 0]}>
            <cylinderGeometry args={[0.058, 0.045, 0.08, 16]} />
            <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.15} />
          </mesh>
          <mesh position={[0.05, -0.38, 0]}>
            <cylinderGeometry args={[0.045, 0.058, 0.08, 16]} />
            <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.15} />
          </mesh>
          <pointLight position={[0.2, 0, 0]} intensity={3.6} distance={7.5} color="#ffa43b" decay={1.5} />
        </group>
      ))}

      {/* Art Deco Architectural Wall Sconces (Right Auditorium Wall, skipping doorway at z = 2.0) */}
      {[-8.0, -3.0, 7.0, 12.0, 17.0].map((zPos, idx) => (
        <group key={`sconce-right-${idx}`} position={[6.08, 4.2, zPos]}>
          <mesh>
            <boxGeometry args={[0.04, 0.88, 0.16]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.2} />
          </mesh>
          <mesh position={[-0.05, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.72, 16]} />
            <meshBasicMaterial color="#ffe3b0" />
          </mesh>
          <mesh position={[-0.05, 0.38, 0]}>
            <cylinderGeometry args={[0.058, 0.045, 0.08, 16]} />
            <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.15} />
          </mesh>
          <mesh position={[-0.05, -0.38, 0]}>
            <cylinderGeometry args={[0.045, 0.058, 0.08, 16]} />
            <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.15} />
          </mesh>
          <pointLight position={[-0.2, 0, 0]} intensity={3.6} distance={7.5} color="#ffa43b" decay={1.5} />
        </group>
      ))}

      {/* Curved Proscenium Stage Footlight Trough below Screen 04 */}
      <group position={[0, 0.08, 13.82]}>
        {/* Curved Proscenium Stage Apron Bullnose Lip */}
        <mesh position={[0, 0.04, 0]} scale={[-1, 1, 1]}>
          <cylinderGeometry args={[26.0, 26.0, 0.08, 48, 1, true, Math.PI - 0.28, 0.56]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.22} side={THREE.DoubleSide} />
        </mesh>
        {[-6.0, -4.0, -2.0, 0, 2.0, 4.0, 6.0].map((xPos, idx) => {
          const zCurved = -26.0 + (xPos * xPos) / 52.0;
          return (
            <group key={idx} position={[xPos, 0.09, zCurved]}>
              <mesh>
                <cylinderGeometry args={[0.11, 0.11, 0.04, 20]} />
                <meshStandardMaterial color="#1a1412" roughness={0.4} />
              </mesh>
              <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.09, 20]} />
                <meshBasicMaterial color="#fff0d0" />
              </mesh>
              <pointLight position={[0, 0.35, 0.08]} intensity={3.4} distance={5.5} color="#ffbe6b" decay={1.4} />
            </group>
          );
        })}
      </group>

      {/* Auditorium Curvaceous Acoustic Barrel Vault Ceiling Structure & Brass Downlights */}
      <group position={[-1.0, -3.0, 4.0]}>
        {/* Curvaceous Plaster Vault Shell spanning the auditorium */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[11.5, 11.5, 33.0, 40, 1, true, Math.PI - 0.65, 1.30]} />
          <meshStandardMaterial color="#080709" roughness={0.90} side={THREE.DoubleSide} />
        </mesh>
        {/* Art Deco Curved Acoustic Rib Arches along the vault */}
        {[-12.0, -6.0, 0, 6.0, 12.0].map((rz, ridx) => (
          <group key={`vault-rib-${ridx}`} position={[0, 0, rz]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[11.38, 11.38, 0.32, 40, 1, true, Math.PI - 0.65, 1.30]} />
              <meshStandardMaterial color="#140f10" roughness={0.75} side={THREE.DoubleSide} />
            </mesh>
            {/* Center Keystone Luminaire on Vault Spine */}
            <group position={[0, 11.42, 0]}>
              <mesh>
                <cylinderGeometry args={[0.14, 0.16, 0.06, 20]} />
                <meshStandardMaterial color="#c9a86a" metalness={0.95} roughness={0.15} />
              </mesh>
              <mesh position={[0, -0.035, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.11, 20]} />
                <meshBasicMaterial color="#ffe2b0" />
              </mesh>
              <pointLight position={[0, -0.3, 0]} intensity={4.2} distance={8.5} color="#ffa43b" decay={1.5} />
            </group>
          </group>
        ))}
        {/* Warm Golden Cove Lights along Springlines washing up into the Barrel Vault */}
        {[-8.0, 0, 8.0].map((cz, ci) => (
          <group key={`cove-${ci}`}>
            <pointLight position={[-6.8, 9.2, cz]} intensity={2.8} distance={7} color="#ffa43b" decay={1.6} />
            <pointLight position={[6.8, 9.2, cz]} intensity={2.8} distance={7} color="#ffa43b" decay={1.6} />
          </group>
        ))}
      </group>

      {/* Fluted Semicircular Acoustic Wall Pilasters (Left Wall at x = -8.08) */}
      {[-5.5, -0.5, 4.5, 9.5, 14.5].map((zPos, idx) => (
        <mesh key={`pilaster-left-${idx}`} position={[-8.08, 4.0, zPos]}>
          <cylinderGeometry args={[0.20, 0.20, 8.0, 20, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#180c10" roughness={0.7} metalness={0.15} />
        </mesh>
      ))}

      {/* Fluted Semicircular Acoustic Wall Pilasters (Right Wall at x = 6.06) */}
      {[-5.5, -0.5, 4.5, 9.5, 14.5].map((zPos, idx) => (
        <mesh key={`pilaster-right-${idx}`} position={[6.06, 4.0, zPos]} rotation={[0, Math.PI, 0]}>
          <cylinderGeometry args={[0.20, 0.20, 8.0, 20, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#180c10" roughness={0.7} metalness={0.15} />
        </mesh>
      ))}

      {/* ============================================================ */}
      {/* ZONE A: THE MAIN AUDITORIUM & SCREEN 04                       */}
      {/* ============================================================ */}

      {/* Screen 04 (Main Panoramic Cinemascope 2.39:1 Curved Screen) */}
      <mesh ref={screen04Ref} position={[0, 4.72, 19.48]} scale={[-1, 1, 1]}>
        <cylinderGeometry args={[32.0, 32.0, 8.1, 64, 1, true, Math.PI - 0.225, 0.45]} />
        <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
      </mesh>

      {/* Screen 04 Acoustic Baffle Curved Back Wall (Safely 10cm behind screen to prevent Z-fighting) */}
      <mesh position={[0, 4.72, 19.78]} scale={[-1, 1, 1]}>
        <cylinderGeometry args={[32.4, 32.4, 8.8, 48, 1, true, Math.PI - 0.24, 0.48]} />
        <meshStandardMaterial color="#040405" roughness={0.95} side={THREE.DoubleSide} />
      </mesh>

      {/* Screen 04 Curvaceous Architectural Masking & Pelmet */}
      <group position={[0, 4.72, 19.48]} scale={[-1, 1, 1]}>
        {/* Top Curved Pelmet Masking Arc */}
        <mesh position={[0, 8.1 / 2 + 0.05, 0]}>
          <cylinderGeometry args={[31.95, 31.95, 0.12, 64, 1, true, Math.PI - 0.228, 0.456]} />
          <meshStandardMaterial color="#0c0a09" metalness={0.2} roughness={0.85} side={THREE.DoubleSide} />
        </mesh>
        {/* Bottom Curved Pelmet Masking Arc */}
        <mesh position={[0, -8.1 / 2 - 0.05, 0]}>
          <cylinderGeometry args={[31.95, 31.95, 0.12, 64, 1, true, Math.PI - 0.228, 0.456]} />
          <meshStandardMaterial color="#0c0a09" metalness={0.2} roughness={0.85} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Fluted Semicircular Art Deco Proscenium Columns flanking Screen 04 */}
      {[-7.35, 7.35].map((colX, cIdx) => (
        <group key={`proscenium-col-${cIdx}`} position={[colX, 4.72, -11.75]}>
          {/* Main Fluted Column Shaft */}
          <mesh>
            <cylinderGeometry args={[0.32, 0.32, 8.35, 24]} />
            <meshStandardMaterial color="#1a0e12" roughness={0.4} metalness={0.2} />
          </mesh>
          {/* Stepped Art Deco Brass Capital */}
          <mesh position={[0, 4.22, 0]}>
            <cylinderGeometry args={[0.42, 0.34, 0.16, 24]} />
            <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.14} />
          </mesh>
          {/* Stepped Art Deco Brass Plinth Base */}
          <mesh position={[0, -4.22, 0]}>
            <cylinderGeometry args={[0.34, 0.42, 0.16, 24]} />
            <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.14} />
          </mesh>
          {/* Column Up/Down Accent Glow */}
          <pointLight position={[0, -3.8, 0.2]} intensity={2.4} distance={4.5} color="#ffa43b" decay={1.5} />
        </group>
      ))}

      {/* Main Velvet Curtains */}
      <mesh position={[-8.2, 0.1, 0.36]}>
        <planeGeometry args={[2.7, 9.4, 32, 1]} />
        <meshStandardMaterial color="#2d0b11" roughness={0.96} metalness={0.03} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[8.2, 0.1, 0.36]}>
        <planeGeometry args={[2.7, 9.4, 32, 1]} />
        <meshStandardMaterial color="#2d0b11" roughness={0.96} metalness={0.03} side={THREE.DoubleSide} />
      </mesh>

      {/* Right Auditorium Enclosing Wall with Grand Cinema Exit Doorway to High Porch */}
      <group position={[6.2, 0, 0]}>
        {/* Front Wall Segment (from z = -14.0 to z = 0.9) */}
        <mesh position={[0, 4.0, -6.55]}>
          <boxGeometry args={[0.26, 8.0, 14.9]} />
          <meshStandardMaterial color="#0a0809" roughness={0.92} />
        </mesh>
        <mesh position={[-0.14, 4.0, -6.55]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[14.9, 8.0]} />
          <meshStandardMaterial color="#26080e" roughness={0.92} metalness={0.05} />
        </mesh>

        {/* Rear Wall Segment (from z = 3.1 to z = 24.0) */}
        <mesh position={[0, 4.0, 13.55]}>
          <boxGeometry args={[0.26, 8.0, 20.9]} />
          <meshStandardMaterial color="#0a0809" roughness={0.92} />
        </mesh>
        <mesh position={[-0.14, 4.0, 13.55]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[20.9, 8.0]} />
          <meshStandardMaterial color="#26080e" roughness={0.92} metalness={0.05} />
        </mesh>

        {/* Top Wall Segment above Doorway (from y = 3.2 to 8.0, z = 0.9 to 3.1) */}
        <mesh position={[0, 5.6, 2.0]}>
          <boxGeometry args={[0.26, 4.8, 2.2]} />
          <meshStandardMaterial color="#0a0809" roughness={0.92} />
        </mesh>

        {/* Doorway Architrave Frame (Dark Mahogany & Polished Brass Trim) */}
        <group position={[-0.14, 0, 2.0]}>
          {/* Top Lintel Architrave */}
          <mesh position={[0, 3.26, 0]}>
            <boxGeometry args={[0.08, 0.16, 2.38]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.2} />
          </mesh>
          {/* Left Jamb Architrave */}
          <mesh position={[0, 1.6, -1.14]}>
            <boxGeometry args={[0.08, 3.2, 0.1]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.2} />
          </mesh>
          {/* Right Jamb Architrave */}
          <mesh position={[0, 1.6, 1.14]}>
            <boxGeometry args={[0.08, 3.2, 0.1]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.2} />
          </mesh>

          {/* Illuminated Exit Marquee Transom Sign */}
          <mesh position={[0.02, 3.48, 0]}>
            <boxGeometry args={[0.06, 0.22, 1.6]} />
            <meshStandardMaterial color="#14100c" roughness={0.4} />
          </mesh>
          <mesh position={[-0.02, 3.48, 0]}>
            <boxGeometry args={[0.02, 0.18, 1.54]} />
            <meshBasicMaterial color="#ffe0a3" />
          </mesh>
          <pointLight position={[-0.2, 3.48, 0]} intensity={1.8} distance={4} color="#ffa43b" />
        </group>

        {/* Left Door Leaf (Hinged at z = 0.9, swings outward into terrace) */}
        <group ref={leftDoorRef} position={[0, 0, 0.9]}>
          <mesh position={[0, 1.575, 0.54]}>
            <boxGeometry args={[0.06, 3.15, 1.08]} />
            <meshStandardMaterial color="#1a0f0a" roughness={0.45} />
          </mesh>
          {/* Inset Oxblood Leather Panel */}
          <mesh position={[-0.035, 1.575, 0.54]}>
            <boxGeometry args={[0.015, 2.65, 0.88]} />
            <meshStandardMaterial color="#300d14" roughness={0.92} />
          </mesh>
          {/* Brass Push Handle */}
          <mesh position={[-0.07, 1.15, 0.6]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.018, 0.018, 0.55, 12]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
          </mesh>
          {/* Brass Kickplate */}
          <mesh position={[-0.035, 0.18, 0.54]}>
            <boxGeometry args={[0.015, 0.32, 0.92]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.88} roughness={0.25} />
          </mesh>
        </group>

        {/* Right Door Leaf (Hinged at z = 3.1, swings outward into terrace) */}
        <group ref={rightDoorRef} position={[0, 0, 3.1]}>
          <mesh position={[0, 1.575, -0.54]}>
            <boxGeometry args={[0.06, 3.15, 1.08]} />
            <meshStandardMaterial color="#1a0f0a" roughness={0.45} />
          </mesh>
          {/* Inset Oxblood Leather Panel */}
          <mesh position={[-0.035, 1.575, -0.54]}>
            <boxGeometry args={[0.015, 2.65, 0.88]} />
            <meshStandardMaterial color="#300d14" roughness={0.92} />
          </mesh>
          {/* Brass Push Handle */}
          <mesh position={[-0.07, 1.15, -0.6]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.018, 0.018, 0.55, 12]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
          </mesh>
          {/* Brass Kickplate */}
          <mesh position={[-0.035, 0.18, -0.54]}>
            <boxGeometry args={[0.015, 0.32, 0.92]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.88} roughness={0.25} />
          </mesh>
        </group>
      </group>

      {/* Volumetric Doorway Floor Light Spill (Brightens when doors swing open) */}
      <mesh position={[5.4, 0.02, 2.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.8, 2.4]} />
        <meshBasicMaterial
          ref={doorLightSpillRef}
          color="#ffa43b"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Seated Area Gentle Overhead Ambient & Low-Floor Tone */}
      <pointLight position={[0.825, 3.2, 6.2]} intensity={1.8} distance={7} color="#ffe2b0" decay={1.6} />
      <pointLight position={[0.32, 0.25, 5.2]} intensity={1.0} distance={3.5} color="#f5c270" decay={1.8} />
      <pointLight position={[1.35, 0.25, 5.2]} intensity={1.0} distance={3.5} color="#f5c270" decay={1.8} />

      {/* Tiered Architectural Risers (Stepped Platforms under Seats) */}
      <group>
        {[0, 1, 2, 3, 4].map((r) => {
          const z = 2.0 + r * 2.2;
          const platformH = (r + 1) * 0.14;
          const topY = platformH;
          const midY = platformH / 2;
          return (
            <group key={r}>
              {/* Left Seat Bank Tier Platform */}
              <mesh position={[-2.75, midY, z]}>
                <boxGeometry args={[3.8, platformH, 2.2]} />
                <meshStandardMaterial color="#0b090a" roughness={0.8} metalness={0.1} />
              </mesh>
              {/* Left Tier Step Brass Bullnose Edge Nosing */}
              <mesh position={[-2.75, topY, z - 1.1]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.016, 0.016, 3.8, 16]} />
                <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.12} />
              </mesh>

              {/* Right Seat Bank Tier Platform */}
              <mesh position={[2.75, midY, z]}>
                <boxGeometry args={[3.8, platformH, 2.2]} />
                <meshStandardMaterial color="#0b090a" roughness={0.8} metalness={0.1} />
              </mesh>
              {/* Right Tier Step Brass Bullnose Edge Nosing */}
              <mesh position={[2.75, topY, z - 1.1]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.016, 0.016, 3.8, 16]} />
                <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.12} />
              </mesh>

              {/* Center Aisle Low-Rise Stepped Terrace */}
              {r > 0 && (
                <group>
                  <mesh position={[0, midY - 0.04, z]}>
                    <boxGeometry args={[1.68, platformH - 0.08, 2.2]} />
                    <meshStandardMaterial color="#090809" roughness={0.85} metalness={0.08} />
                  </mesh>
                  {/* Center Aisle Brass Bullnose Edge Nosing */}
                  <mesh position={[0, platformH - 0.04, z - 1.1]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.014, 0.014, 1.68, 16]} />
                    <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.12} />
                  </mesh>
                </group>
              )}
            </group>
          );
        })}

        {/* Rear Foyer Stepped Risers connecting Entrance (z: 19.0) to Orchestra Back Row (z: 11.9) */}
        {[
          { z: 12.8, h: 0.56, w: 14.0 },
          { z: 14.2, h: 0.38, w: 14.0 },
          { z: 15.6, h: 0.20, w: 14.0 },
        ].map((stp, idx) => (
          <group key={`foyer-step-${idx}`}>
            <mesh position={[0, stp.h / 2, stp.z]}>
              <boxGeometry args={[stp.w, stp.h, 1.4]} />
              <meshStandardMaterial color="#0c0a0c" roughness={0.88} metalness={0.08} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Velvet Luxury Lounger Seats in Orchestra with Tiered Rake */}
      {seatsZoneA.map((item, idx) => (
        <LuxuryCinemaSeat key={idx} item={item} />
      ))}

      {/* Reflective Acoustic Marble Floor */}
      <mesh position={[0, -0.02, 5.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[32, 60]} />
        <meshStandardMaterial color="#050507" roughness={0.32} metalness={0.45} />
      </mesh>

      {/* Central Aisle Plush Velvet Acoustic Carpet Runner (Eliminates Specular Glare) */}
      <mesh position={[0, 0.01, 5.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.65, 30]} />
        <meshStandardMaterial color="#1a060a" roughness={0.96} metalness={0.02} />
      </mesh>

      {/* Aisle LED Guide Lights */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[aisleGuideLights, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.10}
          color="#dfc28d"
          transparent
          opacity={0.95}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Central Aisle Step Runway Luminaires on every Tier Riser */}
      {[
        { z: 2.0, y: 0.14 },
        { z: 4.2, y: 0.28 },
        { z: 6.4, y: 0.42 },
        { z: 8.6, y: 0.56 },
        { z: 10.8, y: 0.70 },
        { z: 12.8, y: 0.56 },
        { z: 14.2, y: 0.38 },
        { z: 15.6, y: 0.20 },
      ].map((step, idx) => (
        <group key={`aisle-step-${idx}`}>
          {/* Left Step Luminaire */}
          <group position={[-0.86, step.y + 0.02, step.z]}>
            <mesh>
              <boxGeometry args={[0.05, 0.035, 0.12]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.2} />
            </mesh>
            <mesh position={[0.028, 0, 0]}>
              <boxGeometry args={[0.008, 0.02, 0.08]} />
              <meshBasicMaterial color="#ffc470" />
            </mesh>
            <pointLight position={[0.12, 0, 0]} intensity={1.4} distance={2.2} color="#ffa43b" decay={1.7} />
          </group>
          {/* Right Step Luminaire */}
          <group position={[0.86, step.y + 0.02, step.z]}>
            <mesh>
              <boxGeometry args={[0.05, 0.035, 0.12]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.2} />
            </mesh>
            <mesh position={[-0.028, 0, 0]}>
              <boxGeometry args={[0.008, 0.02, 0.08]} />
              <meshBasicMaterial color="#ffc470" />
            </mesh>
            <pointLight position={[-0.12, 0, 0]} intensity={1.4} distance={2.2} color="#ffa43b" decay={1.7} />
          </group>
        </group>
      ))}

      {/* Rear Projection Booth Window & Lens Aperture (z = 18.2, y = 8.4) */}
      <group position={[0, 8.4, 18.2]}>
        {/* Polished Brass Projection Port Frame */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.0, 0.55, 0.12]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.2} />
        </mesh>
        {/* Projection Booth Glass */}
        <mesh position={[0, 0, -0.05]}>
          <planeGeometry args={[0.84, 0.42]} />
          <meshStandardMaterial color="#08101a" roughness={0.1} metalness={0.9} transparent opacity={0.8} />
        </mesh>
        {/* Brilliant Master Projector Lens */}
        <mesh position={[0, 0, -0.06]}>
          <circleGeometry args={[0.16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Powerful Lens Core Light */}
        <pointLight position={[0, 0, -0.2]} intensity={7.5} distance={18} color="#eef6ff" decay={1.4} />
      </group>

      {/* Atmospheric 4K Volumetric Projector Beam Cone */}
      <mesh position={[0, 8.5, 3]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[8.4, 25, 32, 1, true]} />
        <meshBasicMaterial
          color="#d8ebff"
          transparent
          opacity={0.055}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ============================================================ */}
      {/* ZONE B: HIGH PORCH VINTAGE PROVISIONS & FOOD VERANDA           */}
      {/* Step seamlessly through the animated cinema exit double doors   */}
      {/* Grounded eye-level architecture with Veo 3.1 live video mural  */}
      {/* ============================================================ */}
      {/* Entry Terrace Walkway connecting Doorway (x: 6.2) to High Porch Deck (x: 8.25) */}
      <mesh position={[7.225, 0.06, 2.0]}>
        <boxGeometry args={[2.05, 0.12, 2.8]} />
        <meshStandardMaterial color="#1a1410" roughness={0.38} metalness={0.15} />
      </mesh>
      {/* Walkway Brass Edge Nosings */}
      <mesh position={[7.225, 0.125, 0.6]}>
        <boxGeometry args={[2.05, 0.012, 0.03]} />
        <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.2} />
      </mesh>
      <mesh position={[7.225, 0.125, 3.4]}>
        <boxGeometry args={[2.05, 0.012, 0.03]} />
        <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.2} />
      </mesh>

      <group position={[12.5, 0, 0.0]}>
        {/* High Porch Solid Teak Floor Deck (Flush +12cm Low Riser outside doors) */}
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[8.5, 0.12, 10.5]} />
          <meshStandardMaterial color="#1a1410" roughness={0.38} metalness={0.15} />
        </mesh>
        {/* Brass Inlay Border around Deck Perimeter */}
        <mesh position={[-4.2, 0.125, 0]}>
          <boxGeometry args={[0.03, 0.012, 10.4]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Art Deco Fluted Columns supporting the Pergola Ceiling */}
        {[-4.5, 4.5].map((zPos, i) => (
          <group key={i} position={[-3.8, 2.15, zPos]}>
            <mesh>
              <cylinderGeometry args={[0.11, 0.13, 4.1, 16]} />
              <meshStandardMaterial color="#141316" metalness={0.85} roughness={0.3} />
            </mesh>
            {/* Brass Fluted Capital */}
            <mesh position={[0, 2.0, 0]}>
              <boxGeometry args={[0.34, 0.14, 0.34]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
            </mesh>
            {/* Brass Base Plinth */}
            <mesh position={[0, -2.0, 0]}>
              <boxGeometry args={[0.34, 0.12, 0.34]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
            </mesh>
          </group>
        ))}

        {/* Vintage Wrought Iron & Brass Balustrade with Open Walkway Portal (z: 0.7 to 3.3) */}
        <group position={[-3.8, 0.12, 0]}>
          {/* North Railing Section (z: -4.8 to 0.7) */}
          <group position={[0, 0, -2.05]}>
            <mesh position={[0, 0.94, 0]}>
              <boxGeometry args={[0.1, 0.08, 5.5]} />
              <meshStandardMaterial color="#2b1a12" roughness={0.3} metalness={0.2} />
            </mesh>
            <mesh position={[0, 0.99, 0]}>
              <boxGeometry args={[0.12, 0.02, 5.5]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
            </mesh>
            <mesh position={[0, 0.06, 0]}>
              <boxGeometry args={[0.08, 0.04, 5.5]} />
              <meshStandardMaterial color="#1b120c" metalness={0.7} roughness={0.3} />
            </mesh>
            {Array.from({ length: 14 }).map((_, i) => (
              <mesh key={i} position={[0, 0.5, -2.5 + i * 0.38]}>
                <cylinderGeometry args={[0.015, 0.015, 0.88, 12]} />
                <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
              </mesh>
            ))}
          </group>

          {/* South Railing Section (z: 3.3 to 4.8) */}
          <group position={[0, 0, 4.05]}>
            <mesh position={[0, 0.94, 0]}>
              <boxGeometry args={[0.1, 0.08, 1.5]} />
              <meshStandardMaterial color="#2b1a12" roughness={0.3} metalness={0.2} />
            </mesh>
            <mesh position={[0, 0.99, 0]}>
              <boxGeometry args={[0.12, 0.02, 1.5]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
            </mesh>
            <mesh position={[0, 0.06, 0]}>
              <boxGeometry args={[0.08, 0.04, 1.5]} />
              <meshStandardMaterial color="#1b120c" metalness={0.7} roughness={0.3} />
            </mesh>
            {Array.from({ length: 4 }).map((_, i) => (
              <mesh key={i} position={[0, 0.5, -0.6 + i * 0.4]}>
                <cylinderGeometry args={[0.015, 0.015, 0.88, 12]} />
                <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
              </mesh>
            ))}
          </group>

          {/* Brass Entrance Newel Posts flanking the entryway */}
          {[0.7, 3.3].map((zPos, i) => (
            <group key={i} position={[0, 0, zPos]}>
              <mesh position={[0, 0.54, 0]}>
                <boxGeometry args={[0.12, 1.08, 0.12]} />
                <meshStandardMaterial color="#1b120c" metalness={0.8} roughness={0.3} />
              </mesh>
              <mesh position={[0, 1.12, 0]}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshStandardMaterial color="#c9a86a" metalness={0.95} roughness={0.15} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Overhead Vintage Timber Pergola Roof (at Y: 4.25) */}
        <group position={[0, 4.25, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[8.4, 0.14, 10.4]} />
            <meshStandardMaterial color="#1a120c" roughness={0.6} />
          </mesh>
          {/* Scalloped Vintage Deep Oxblood Fabric Awning Trim along porch edge */}
          <mesh position={[-3.8, -0.22, 0]}>
            <boxGeometry args={[0.08, 0.38, 9.6]} />
            <meshStandardMaterial color="#380d14" roughness={0.88} />
          </mesh>
          <mesh position={[-3.8, -0.42, 0]}>
            <boxGeometry args={[0.09, 0.03, 9.6]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.85} roughness={0.25} />
          </mesh>
        </group>

        {/* Hanging Vintage Brass Cage Edison Filament Lanterns */}
        {[-3.6, -1.2, 1.2, 3.6].map((zOffset, i) => (
          <group key={i} position={[-0.8, 3.4, zOffset]}>
            {/* Cord */}
            <mesh position={[0, 0.42, 0]}>
              <cylinderGeometry args={[0.006, 0.006, 0.85, 8]} />
              <meshStandardMaterial color="#111113" />
            </mesh>
            {/* Vintage Brass Hood */}
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.1, 0.22, 0.18, 16, 1, true]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} side={THREE.DoubleSide} />
            </mesh>
            {/* Glowing Amber Filament Bulb */}
            <mesh position={[0, -0.06, 0]}>
              <sphereGeometry args={[0.065, 16, 16]} />
              <meshBasicMaterial color="#ffb049" />
            </mesh>
            <pointLight intensity={14} distance={9} color="#ffa43b" decay={1.5} />
          </group>
        ))}

        {/* Warm Vintage Porch Ambient Floodlights */}
        <pointLight position={[0.6, 3.4, 0]} intensity={22} distance={14} color="#ffbe6b" decay={1.3} />
        <pointLight position={[-1.2, 3.2, 0]} intensity={18} distance={12} color="#ffa43b" decay={1.4} />
        <pointLight position={[0.6, 3.4, -2.4]} intensity={16} distance={10} color="#ffdfab" decay={1.3} />
        <pointLight position={[0.6, 3.4, 2.4]} intensity={16} distance={10} color="#ffdfab" decay={1.3} />

        {/* Vintage Calacatta Marble Bar & Food Counter with Curvaceous Semicircular Ends */}
        <group position={[0.6, 0.12, 0]}>
          {/* Fluted Dark Mahogany Counter Base with Rounded Semicircular Ends */}
          <group position={[0, 0.52, 0]}>
            {/* Center Base Box */}
            <mesh>
              <boxGeometry args={[1.35, 1.04, 6.2]} />
              <meshStandardMaterial color="#221510" roughness={0.42} metalness={0.2} />
            </mesh>
            {/* Semicircular Rounded Mahogany Ends */}
            {[-3.1, 3.1].map((endZ, ei) => (
              <mesh key={`bar-end-base-${ei}`} position={[0, 0, endZ]} rotation={[0, ei === 0 ? Math.PI : 0, 0]}>
                <cylinderGeometry args={[0.675, 0.675, 1.04, 28, 1, false, -Math.PI / 2, Math.PI]} />
                <meshStandardMaterial color="#221510" roughness={0.42} metalness={0.2} />
              </mesh>
            ))}
            {/* Vertical Fluted Tambour Reeding Slats on Bar Apron */}
            {Array.from({ length: 18 }).map((_, si) => {
              const slatZ = -2.8 + si * 0.33;
              return (
                <mesh key={`slat-${si}`} position={[-0.68, 0, slatZ]}>
                  <cylinderGeometry args={[0.016, 0.016, 1.02, 12]} />
                  <meshStandardMaterial color="#1a0f0a" roughness={0.5} metalness={0.15} />
                </mesh>
              );
            })}
          </group>

          {/* Calacatta Gold Marble Slab Countertop with Semicircular Bullnose Ends */}
          <group position={[0, 1.07, 0]}>
            {/* Center Marble Slab */}
            <mesh>
              <boxGeometry args={[1.55, 0.07, 6.2]} />
              <meshStandardMaterial color="#f0eae0" roughness={0.2} metalness={0.12} />
            </mesh>
            {/* Semicircular Rounded Marble Ends */}
            {[-3.1, 3.1].map((endZ, ei) => (
              <mesh key={`bar-end-top-${ei}`} position={[0, 0, endZ]} rotation={[0, ei === 0 ? Math.PI : 0, 0]}>
                <cylinderGeometry args={[0.775, 0.775, 0.07, 28, 1, false, -Math.PI / 2, Math.PI]} />
                <meshStandardMaterial color="#f0eae0" roughness={0.2} metalness={0.12} />
              </mesh>
            ))}
            {/* Continuous Polished Brass Bullnose Edge Trim */}
            <mesh position={[-0.78, 0, 0]}>
              <boxGeometry args={[0.025, 0.075, 6.2]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.95} roughness={0.14} />
            </mesh>
          </group>

          {/* Continuous Curved Brass Footrail with Wraparound Semicircular Ends */}
          <group position={[-0.78, 0.2, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 6.2, 16]} />
              <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.15} />
            </mesh>
          </group>

          {/* VINTAGE FOOD DISPLAY: Pastry Cloche, Tiered Stand, Champagne Bucket, Espresso Machine */}
          {/* 1. Glass Pastry Cloche with artisanal cinema confections */}
          <group position={[-0.1, 1.11, 2.2]}>
            <mesh position={[0, 0.015, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 0.025, 24]} />
              <meshStandardMaterial color="#1a1412" roughness={0.3} metalness={0.4} />
            </mesh>
            {/* Cloche Glass Dome */}
            <mesh position={[0, 0.2, 0]}>
              <sphereGeometry args={[0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.4} roughness={0.05} metalness={0.1} />
            </mesh>
            {/* Brass Finial */}
            <mesh position={[0, 0.41, 0]}>
              <sphereGeometry args={[0.025, 12, 12]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.95} roughness={0.1} />
            </mesh>
            {/* Artisanal Truffles inside */}
            {[-0.06, 0.06].map((x, xi) => (
              <mesh key={xi} position={[x, 0.05, 0]}>
                <sphereGeometry args={[0.035, 12, 12]} />
                <meshStandardMaterial color="#2d1016" roughness={0.8} />
              </mesh>
            ))}
          </group>

          {/* 2. Three-Tiered Antique Brass Provisions Stand */}
          <group position={[-0.1, 1.11, 0.6]}>
            <mesh position={[0, 0.01, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 0.015, 24]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.16, 0]}>
              <cylinderGeometry args={[0.16, 0.16, 0.015, 24]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.30, 0]}>
              <cylinderGeometry args={[0.11, 0.11, 0.015, 24]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.18, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.38, 12]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.95} roughness={0.1} />
            </mesh>
          </group>

          {/* 3. Antique Hammered Brass Champagne Bucket with Vintage Brut */}
          <group position={[-0.1, 1.11, -1.0]}>
            <mesh position={[0, 0.14, 0]}>
              <cylinderGeometry args={[0.18, 0.14, 0.28, 20]} />
              <meshStandardMaterial color="#c9a86a" roughness={0.25} metalness={0.88} />
            </mesh>
            {/* Bottles with gold foil necks */}
            {[-0.05, 0.05].map((bx, bi) => (
              <group key={bi} position={[bx, 0.24, 0]} rotation={[0, 0, (bi - 0.5) * 0.15]}>
                <mesh>
                  <cylinderGeometry args={[0.04, 0.04, 0.26, 16]} />
                  <meshStandardMaterial color="#0e2412" roughness={0.15} />
                </mesh>
                <mesh position={[0, 0.14, 0]}>
                  <cylinderGeometry args={[0.018, 0.024, 0.1, 16]} />
                  <meshStandardMaterial color="#dfc28d" roughness={0.2} metalness={0.85} />
                </mesh>
              </group>
            ))}
          </group>

          {/* 4. Classic Vintage Art Deco Brass Espresso & Concessions Machine */}
          <group position={[-0.1, 1.11, -2.6]}>
            {/* Machine Sculpted Cylindrical Boiler Body */}
            <mesh position={[0, 0.22, 0]}>
              <cylinderGeometry args={[0.22, 0.24, 0.44, 28]} />
              <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.15} />
            </mesh>
            {/* Polished Brass Beveled Base Plinth Ring */}
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.26, 0.27, 0.04, 28]} />
              <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.12} />
            </mesh>
            {/* Antique Dome Top */}
            <mesh position={[0, 0.44, 0]}>
              <sphereGeometry args={[0.22, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.1} />
            </mesh>
            {/* Art Deco Crown Finial on top */}
            <mesh position={[0, 0.66, 0]}>
              <sphereGeometry args={[0.035, 16, 16]} />
              <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.1} />
            </mesh>
            {/* Dual Brass Portafilters */}
            {[-0.12, 0.12].map((pz, pi) => (
              <mesh key={pi} position={[-0.24, 0.16, pz]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.02, 0.02, 0.12, 12]} />
                <meshStandardMaterial color="#1a1412" roughness={0.3} />
              </mesh>
            ))}
          </group>
        </group>

        {/* Vintage Swivel Barstools with Oxblood Leather (along porch counter) */}
        {[-2.0, 0.0, 2.0].map((zPos, i) => (
          <group key={i} position={[-0.6, 0.12, zPos]}>
            {/* Circular Tufted Oxblood Leather Cushion */}
            <mesh position={[0, 0.65, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 0.1, 24]} />
              <meshStandardMaterial color="#54121a" roughness={0.62} metalness={0.08} />
            </mesh>
            {/* Brass Nailhead Trim Ring */}
            <mesh position={[0, 0.69, 0]}>
              <cylinderGeometry args={[0.23, 0.23, 0.015, 24]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Swivel Stem */}
            <mesh position={[0, 0.32, 0]}>
              <cylinderGeometry args={[0.03, 0.04, 0.64, 12]} />
              <meshStandardMaterial color="#161414" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Brass Circular Foot Ring */}
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.18, 0.18, 0.02, 16, 1, true]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Heavy Cast Iron Base */}
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.2, 0.22, 0.04, 20]} />
              <meshStandardMaterial color="#141416" metalness={0.85} roughness={0.25} />
            </mesh>
          </group>
        ))}

        {/* Vintage Mahogany Back-Bar Cabinet with Backlit Mirrors & Live Veo 3.1 Video Mural */}
        <group position={[2.1, 0.12, 0]}>
          <mesh position={[0, 1.45, 0]}>
            <boxGeometry args={[0.45, 2.9, 7.8]} />
            <meshStandardMaterial color="#1a120e" roughness={0.4} metalness={0.2} />
          </mesh>
          {/* Photorealistic High Porch Back-Bar Live Veo 3.1 Moving Video Mural (Mounted on Front Face) */}
          <mesh ref={barMuralRef} position={[-0.235, 1.45, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[7.4, 2.6]} />
            <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
          </mesh>
          {/* Amber Ambient Cabinet Glow */}
          <pointLight position={[-0.4, 1.6, 0]} intensity={3.2} distance={8} color="#ffa947" />
        </group>
      </group>

      {/* ============================================================ */}
      {/* ZONE B: VIP GALLERY CORRIDOR (High Porch to Screen 05)       */}
      {/* Located at x: 9.8, running from z: -5.25 down to z: -18.25   */}
      {/* Safely connects the north end of the High Porch to Screen 05 */}
      {/* Does NOT block the High Porch doorway entrance at z: 2.0!     */}
      {/* ============================================================ */}
      <group position={[9.8, 0, -11.75]}>
        {/* Gallery Corridor Floor Runner in Dark Herringbone Terrazzo (z: -5.25 to -18.25) */}
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[3.2, 0.16, 13.0]} />
          <meshStandardMaterial color="#0e0c0b" roughness={0.35} metalness={0.3} />
        </mesh>

        {/* Polished Brass Floor Inlay Borders */}
        <mesh position={[-1.5, 0.17, 0]}>
          <boxGeometry args={[0.04, 0.02, 13.0]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
        </mesh>
        <mesh position={[1.5, 0.17, 0]}>
          <boxGeometry args={[0.04, 0.02, 13.0]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
        </mesh>

        {/* Outer Fluted Timber Wall along x: 11.4 (relative x: +1.6) */}
        <mesh position={[1.6, 3.1, 0]}>
          <boxGeometry args={[0.2, 6.2, 13.0]} />
          <meshStandardMaterial color="#161210" roughness={0.5} metalness={0.15} />
        </mesh>

        {/* Art Deco Brass Mouldings on Outer Wall */}
        <mesh position={[1.49, 1.1, 0]}>
          <boxGeometry args={[0.03, 0.04, 13.0]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
        </mesh>
        <mesh position={[1.49, 3.6, 0]}>
          <boxGeometry args={[0.03, 0.04, 13.0]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
        </mesh>

        {/* Inner Dividing Wall along x: 8.2 (relative x: -1.6) separating Corridor from Auditorium */}
        {/* Main Solid Wall Segment from relative z = +6.5 down to -3.8 (length 10.3, world z: -5.25 to -15.55) */}
        {/* Stays strictly between z: -5.25 and -15.55 - NEVER reaches the food area doorway at z: 2.0! */}
        <mesh position={[-1.6, 3.1, 1.35]}>
          <boxGeometry args={[0.2, 6.2, 10.3]} />
          <meshStandardMaterial color="#161210" roughness={0.5} metalness={0.15} />
        </mesh>

        {/* Art Deco Brass Mouldings on Inner Wall */}
        <mesh position={[-1.49, 1.1, 1.35]}>
          <boxGeometry args={[0.03, 0.04, 10.3]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
        </mesh>
        <mesh position={[-1.49, 3.6, 1.35]}>
          <boxGeometry args={[0.03, 0.04, 10.3]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
        </mesh>

        {/* Wall Transom above VIP Entrance Archway (relative z: -3.8 to -6.5) */}
        <mesh position={[-1.6, 4.8, -5.15]}>
          <boxGeometry args={[0.22, 2.8, 2.7]} />
          <meshStandardMaterial color="#161210" roughness={0.5} metalness={0.15} />
        </mesh>

        {/* Corridor End Wall (relative z: -6.5, world z: -18.25) closing off the gallery end */}
        <mesh position={[0, 3.1, -6.5]}>
          <boxGeometry args={[3.2, 6.2, 0.2]} />
          <meshStandardMaterial color="#161210" roughness={0.5} metalness={0.15} />
        </mesh>

        {/* Gallery Architectural Coffered Ceiling */}
        <mesh position={[0, 6.2, 0]}>
          <boxGeometry args={[3.4, 0.2, 13.0]} />
          <meshStandardMaterial color="#0d0a08" roughness={0.6} />
        </mesh>

        {/* Warm Downlights along the VIP Gallery Ceiling */}
        {[4.5, 1.5, -1.5, -4.5].map((zPos, idx) => (
          <group key={idx} position={[0, 5.8, zPos]}>
            <mesh>
              <cylinderGeometry args={[0.12, 0.15, 0.08, 16]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.95} roughness={0.15} />
            </mesh>
            <mesh position={[0, -0.04, 0]}>
              <circleGeometry args={[0.09, 16]} />
              <meshBasicMaterial color="#ffe2b0" />
            </mesh>
            <pointLight position={[0, -0.2, 0]} intensity={6.5} distance={5.5} color="#ffa43b" decay={1.5} />
          </group>
        ))}

        {/* Wall Sconces with warm upward/downward luminescence (Outer Wall) */}
        {[3.5, -0.5, -4.5].map((zPos, idx) => (
          <group key={idx} position={[1.47, 2.4, zPos]}>
            <mesh>
              <boxGeometry args={[0.04, 0.45, 0.12]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.2} />
            </mesh>
            <pointLight intensity={2.2} distance={3.8} color="#ffa43b" decay={1.6} />
          </group>
        ))}

        {/* Wall Sconces with warm luminescence (Inner Wall) */}
        {[4.0, 0.0].map((zPos, idx) => (
          <group key={idx} position={[-1.47, 2.4, zPos]}>
            <mesh>
              <boxGeometry args={[0.04, 0.45, 0.12]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.2} />
            </mesh>
            <pointLight intensity={2.2} distance={3.8} color="#ffa43b" decay={1.6} />
          </group>
        ))}

        {/* Living Video Marquee Poster 1 (Cosmic Voyage Veo 3.1) */}
        <group position={[1.46, 2.2, 2.2]} rotation={[0, -Math.PI / 2, 0]}>
          {/* Ebony Mounting Backplate (flush against wall, non-reflective) */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.44, 2.08, 0.016]} />
            <meshStandardMaterial color="#110e0c" roughness={0.7} metalness={0.2} />
          </mesh>

          {/* Bespoke Vertical Marquee Poster Plane */}
          <mesh ref={corridorPoster1Ref} position={[0, 0, 0.020]}>
            <planeGeometry args={[1.30, 1.94]} />
            <meshBasicMaterial
              color="#1a1410"
              toneMapped={false}
            />
          </mesh>

          {/* Art Deco 3D Polished Brass Bevelled Outer Frame (4 distinct borders framing the poster) */}
          <mesh position={[0, 1.005, 0.024]}>
            <boxGeometry args={[1.44, 0.07, 0.032]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.88} roughness={0.3} />
          </mesh>
          <mesh position={[0, -1.005, 0.024]}>
            <boxGeometry args={[1.44, 0.07, 0.032]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.88} roughness={0.3} />
          </mesh>
          <mesh position={[-0.685, 0, 0.024]}>
            <boxGeometry args={[0.07, 1.94, 0.032]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.88} roughness={0.3} />
          </mesh>
          <mesh position={[0.685, 0, 0.024]}>
            <boxGeometry args={[0.07, 1.94, 0.032]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.88} roughness={0.3} />
          </mesh>

          {/* Art Deco Brass Crest Plaque on top */}
          <mesh position={[0, 1.06, 0.030]}>
            <boxGeometry args={[0.42, 0.04, 0.04]} />
            <meshStandardMaterial color="#dfc28d" metalness={0.92} roughness={0.25} />
          </mesh>

          {/* Dedicated Gallery Picture Downlight */}
          <pointLight position={[0, 1.08, 0.20]} intensity={1.5} distance={3.0} color="#ffe2b0" decay={1.8} />
        </group>

        {/* Living Video Marquee Poster 2 (Neo-Tokyo Premiere Veo 3.1) */}
        <group position={[1.46, 2.2, -1.8]} rotation={[0, -Math.PI / 2, 0]}>
          {/* Ebony Mounting Backplate (flush against wall, non-reflective) */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.44, 2.08, 0.016]} />
            <meshStandardMaterial color="#110e0c" roughness={0.7} metalness={0.2} />
          </mesh>

          {/* Bespoke Vertical Marquee Poster Plane */}
          <mesh ref={corridorPoster2Ref} position={[0, 0, 0.020]}>
            <planeGeometry args={[1.30, 1.94]} />
            <meshBasicMaterial
              color="#1a1410"
              toneMapped={false}
            />
          </mesh>

          {/* Art Deco 3D Polished Brass Bevelled Outer Frame (4 distinct borders framing the poster) */}
          <mesh position={[0, 1.005, 0.024]}>
            <boxGeometry args={[1.44, 0.07, 0.032]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.88} roughness={0.3} />
          </mesh>
          <mesh position={[0, -1.005, 0.024]}>
            <boxGeometry args={[1.44, 0.07, 0.032]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.88} roughness={0.3} />
          </mesh>
          <mesh position={[-0.685, 0, 0.024]}>
            <boxGeometry args={[0.07, 1.94, 0.032]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.88} roughness={0.3} />
          </mesh>
          <mesh position={[0.685, 0, 0.024]}>
            <boxGeometry args={[0.07, 1.94, 0.032]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.88} roughness={0.3} />
          </mesh>

          {/* Art Deco Brass Crest Plaque on top */}
          <mesh position={[0, 1.06, 0.030]}>
            <boxGeometry args={[0.42, 0.04, 0.04]} />
            <meshStandardMaterial color="#dfc28d" metalness={0.92} roughness={0.25} />
          </mesh>

          {/* Dedicated Gallery Picture Downlight */}
          <pointLight position={[0, 1.08, 0.20]} intensity={1.5} distance={3.0} color="#dfc28d" decay={1.8} />
        </group>

        {/* VIP Suite Entrance Portal Opening into Screen 05 (relative z: -5.15) */}
        <group position={[-1.5, 0, -5.15]}>
          {/* Portal Architrave Frame */}
          <mesh position={[0, 3.45, 0]}>
            <boxGeometry args={[0.26, 0.16, 2.8]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 1.7, -1.35]}>
            <boxGeometry args={[0.26, 3.4, 0.14]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 1.7, 1.35]}>
            <boxGeometry args={[0.26, 3.4, 0.14]} />
            <meshStandardMaterial color="#c9a86a" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Illuminated VIP Portal Sign */}
          <mesh position={[0.1, 3.65, 0]}>
            <boxGeometry args={[0.08, 0.24, 2.0]} />
            <meshStandardMaterial color="#120f0c" roughness={0.4} />
          </mesh>
          <pointLight position={[0.2, 3.65, 0]} intensity={14} distance={6} color="#dfc28d" decay={1.4} />
        </group>
      </group>

      {/* ============================================================ */}
      {/* ZONE C: SCREEN 05 (THE DIRECTOR'S VIP SUITE)                  */}
      {/* Fully enclosed 360-degree architectural private screening suite */}
      {/* Oxblood acoustic fabric baffle, mahogany fluted side walls,   */}
      {/* coffered ceiling, plush cinema carpet & massive 4K Screen 05   */}
      {/* ============================================================ */}
      <group position={[0, 0, 0]}>
        {/* 1. Front Screen Wall (at z: -29.4) */}
        <mesh position={[0, 3.8, -29.4]}>
          <boxGeometry args={[30.0, 7.6, 0.4]} />
          <meshStandardMaterial color="#1a060c" roughness={0.95} />
        </mesh>

        {/* Massive Screen 05 */}
        <mesh ref={screen05Ref} position={[0, 4.72, -28.9]} scale={[16.0, 9.0, 1]}>
          <planeGeometry />
        </mesh>

        {/* Screen 05 Architectural Cinema Masking */}
        <group position={[0, 4.72, -28.88]}>
          <mesh position={[0, 9.0 / 2 + 0.04, 0]}>
            <boxGeometry args={[16.08, 0.08, 0.06]} />
            <meshStandardMaterial color="#141110" metalness={0.2} roughness={0.8} />
          </mesh>
          <mesh position={[0, -9.0 / 2 - 0.04, 0]}>
            <boxGeometry args={[16.08, 0.08, 0.06]} />
            <meshStandardMaterial color="#141110" metalness={0.2} roughness={0.8} />
          </mesh>
          <mesh position={[-16.0 / 2 - 0.04, 0, 0]}>
            <boxGeometry args={[0.08, 9.08, 0.06]} />
            <meshStandardMaterial color="#141110" metalness={0.2} roughness={0.8} />
          </mesh>
          <mesh position={[16.0 / 2 + 0.04, 0, 0]}>
            <boxGeometry args={[0.08, 9.08, 0.06]} />
            <meshStandardMaterial color="#141110" metalness={0.2} roughness={0.8} />
          </mesh>
        </group>

        {/* Screen 05 Velvet Drapes flanking the screen */}
        <mesh position={[-9.5, 4.2, -28.2]}>
          <planeGeometry args={[3.6, 9.2, 32, 1]} />
          <meshStandardMaterial color="#220810" roughness={0.96} metalness={0.03} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[9.5, 4.2, -28.2]}>
          <planeGeometry args={[3.6, 9.2, 32, 1]} />
          <meshStandardMaterial color="#220810" roughness={0.96} metalness={0.03} side={THREE.DoubleSide} />
        </mesh>

        {/* Screen 05 Stage Apron & Plinth */}
        <mesh position={[0, 0.22, -28.2]}>
          <boxGeometry args={[20.0, 0.44, 2.0]} />
          <meshStandardMaterial color="#120e0c" roughness={0.4} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.44, -27.2]}>
          <boxGeometry args={[20.0, 0.03, 0.05]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
        </mesh>

        {/* Screen 05 Ambient Glow & Stage Uplighting */}
        <pointLight position={[0, 4.72, -27.5]} intensity={18} distance={32} color="#ffe2b0" decay={1.2} />
        <pointLight position={[0, 0.6, -26.8]} intensity={8} distance={10} color="#ffb049" decay={1.4} />

        {/* 2. Right Enclosing Wall of Screen 05 Suite (Flushed with corridor outer wall at x: +11.4) */}
        <mesh position={[11.4, 3.6, -22.75]}>
          <boxGeometry args={[0.4, 7.2, 13.5]} />
          <meshStandardMaterial color="#1c1410" roughness={0.45} metalness={0.15} />
        </mesh>
        {/* Right Wall Mouldings & Sconces */}
        <mesh position={[11.19, 1.1, -22.75]}>
          <boxGeometry args={[0.03, 0.04, 13.5]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
        </mesh>
        <mesh position={[11.19, 3.6, -22.75]}>
          <boxGeometry args={[0.03, 0.04, 13.5]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
        </mesh>
        {[-18.5, -22.5, -26.5].map((zPos, idx) => (
          <group key={idx} position={[11.15, 2.6, zPos]}>
            <mesh>
              <boxGeometry args={[0.08, 0.5, 0.16]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.2} />
            </mesh>
            <pointLight intensity={14} distance={8} color="#ffa43b" decay={1.4} />
          </group>
        ))}

        {/* 3. Left Enclosing Wall of Screen 05 Suite (Symmetrical at x: -11.4) */}
        <mesh position={[-11.4, 3.6, -22.75]}>
          <boxGeometry args={[0.4, 7.2, 13.5]} />
          <meshStandardMaterial color="#1c1410" roughness={0.45} metalness={0.15} />
        </mesh>
        {/* Left Wall Mouldings & Sconces */}
        <mesh position={[-11.19, 1.1, -22.75]}>
          <boxGeometry args={[0.03, 0.04, 13.5]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
        </mesh>
        <mesh position={[-11.19, 3.6, -22.75]}>
          <boxGeometry args={[0.03, 0.04, 13.5]} />
          <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.18} />
        </mesh>
        {[-18.5, -22.5, -26.5].map((zPos, idx) => (
          <group key={idx} position={[-11.15, 2.6, zPos]}>
            <mesh>
              <boxGeometry args={[0.08, 0.5, 0.16]} />
              <meshStandardMaterial color="#c9a86a" metalness={0.92} roughness={0.2} />
            </mesh>
            <pointLight intensity={14} distance={8} color="#ffa43b" decay={1.4} />
          </group>
        ))}

        {/* 4. Back Wall of Screen 05 Suite (at z: -16.0) */}
        {/* Left back section from x: -11.4 to x: +8.2 (length: 19.6) */}
        <mesh position={[-1.6, 3.6, -16.0]}>
          <boxGeometry args={[19.6, 7.2, 0.4]} />
          <meshStandardMaterial color="#1c1410" roughness={0.45} metalness={0.15} />
        </mesh>

        {/* 5. Complete Cinema Floor Carpet */}
        <mesh position={[0, 0.05, -22.75]}>
          <boxGeometry args={[23.2, 0.1, 13.5]} />
          <meshStandardMaterial color="#1a060d" roughness={0.96} />
        </mesh>

        {/* 6. Complete Coffered Cinema Ceiling */}
        <mesh position={[0, 7.2, -22.75]}>
          <boxGeometry args={[23.2, 0.2, 13.5]} />
          <meshStandardMaterial color="#0d0908" roughness={0.6} />
        </mesh>

        {/* Ceiling Downlights illuminating the VIP Suite */}
        <pointLight position={[0, 6.5, -22.5]} intensity={18} distance={18} color="#ffe2b0" decay={1.3} />
        <pointLight position={[5.0, 5.0, -20.0]} intensity={14} distance={12} color="#ffa43b" decay={1.3} />
        <pointLight position={[-5.0, 5.0, -20.0]} intensity={14} distance={12} color="#ffa43b" decay={1.3} />

        {/* Screen 05 VIP Art Deco Curvaceous Barrel Tub Club Armchairs */}
        {[-3.6, -1.2, 1.2, 3.6].map((xPos, idx) => (
          <group key={idx} position={[xPos, 0, -22.5]}>
            {/* 1. Cast-Bronze Circular Swivel Plinth Base */}
            <mesh position={[0, 0.03, 0]}>
              <cylinderGeometry args={[0.44, 0.48, 0.06, 28]} />
              <meshStandardMaterial color="#dfc28d" metalness={0.94} roughness={0.14} />
            </mesh>

            {/* 2. Sculpted Circular Imperial Oxblood Velvet Seat Cushion */}
            <mesh position={[0, 0.22, 0]}>
              <cylinderGeometry args={[0.50, 0.50, 0.24, 28]} />
              <meshStandardMaterial color="#5c101c" roughness={0.58} metalness={0.05} />
            </mesh>
            {/* Front Comfort Waterfall Lip Roll */}
            <mesh position={[0, 0.22, -0.48]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.05, 0.05, 0.65, 20]} />
              <meshStandardMaterial color="#781422" roughness={0.52} metalness={0.05} />
            </mesh>

            {/* 3. Wrap-Around Curvaceous Dark Walnut Barrel Tub Shell */}
            <mesh position={[0, 0.58, 0]}>
              <cylinderGeometry args={[0.55, 0.55, 0.64, 36, 1, true, -Math.PI * 0.85, Math.PI * 1.7]} />
              <meshStandardMaterial color="#160e0a" roughness={0.26} metalness={0.12} side={THREE.DoubleSide} />
            </mesh>

            {/* 4. Fluted Vertical Inner Velvet Pleating along the Horseshoe Arc */}
            {Array.from({ length: 9 }).map((_, vi) => {
              const angle = -Math.PI * 0.78 + (vi / 8) * (Math.PI * 1.56);
              const px = 0.48 * Math.cos(angle);
              const pz = 0.48 * Math.sin(angle);
              return (
                <mesh key={`flute-${vi}`} position={[px, 0.58, pz]}>
                  <cylinderGeometry args={[0.055, 0.055, 0.62, 16]} />
                  <meshStandardMaterial color="#781422" roughness={0.50} metalness={0.05} />
                </mesh>
              );
            })}

            {/* 5. Continuous Curved Polished Champagne Brass Bullnose Crown Rim */}
            <mesh position={[0, 0.90, 0]} rotation={[Math.PI / 2, 0, -Math.PI * 0.85]}>
              <torusGeometry args={[0.55, 0.022, 16, 36, Math.PI * 1.7]} />
              <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.12} />
            </mesh>

            {/* 6. Rounded Leather Arm Bolster Terminals on Left and Right Ends */}
            {[-0.52, 0.52].map((armX, ai) => (
              <group key={`arm-term-${ai}`} position={[armX, 0.62, 0.16]}>
                <mesh>
                  <cylinderGeometry args={[0.065, 0.065, 0.46, 20]} />
                  <meshStandardMaterial color="#221612" roughness={0.45} metalness={0.08} />
                </mesh>
                <mesh position={[0, 0.23, 0]}>
                  <sphereGeometry args={[0.065, 16, 16]} />
                  <meshStandardMaterial color="#221612" roughness={0.45} metalness={0.08} />
                </mesh>
                <mesh position={[0, 0.23, 0]}>
                  <torusGeometry args={[0.066, 0.008, 12, 20]} />
                  <meshStandardMaterial color="#dfc28d" metalness={0.95} roughness={0.12} />
                </mesh>
              </group>
            ))}
          </group>
        ))}
      </group>

      {/* Floating Dust Particles throughout all zones */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlesData, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#f4d9a6"
          transparent
          opacity={0.5}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}
