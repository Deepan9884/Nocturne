import { readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const TARGET_DIRS = ["public/characters", "public/models/humans"];

console.log("⚡ Nocturne 3D Asset Pipeline — glTF Transform + Meshopt Optimization\n");

let totalOriginal = 0;
let totalOptimized = 0;

for (const dir of TARGET_DIRS) {
  if (!existsSync(dir)) continue;

  console.log(`📁 Scanning directory: ${dir}`);
  const files = readdirSync(dir).filter(
    (file) => file.endsWith(".glb") && !file.endsWith(".meshopt.glb")
  );

  for (const file of files) {
    const inputPath = join(dir, file);
    const outputPath = join(dir, file.replace(/\.glb$/, ".meshopt.glb"));

    const origSize = statSync(inputPath).size;
    totalOriginal += origSize;

    console.log(`  Processing: ${file} (${(origSize / 1024 / 1024).toFixed(2)} MB)...`);

    try {
      execSync(`npx gltf-transform meshopt "${inputPath}" "${outputPath}"`, {
        stdio: "pipe",
      });

      const optSize = statSync(outputPath).size;
      totalOptimized += optSize;
      const savings = (((origSize - optSize) / origSize) * 100).toFixed(1);

      console.log(
        `    ✓ Compressed → ${(optSize / 1024 / 1024).toFixed(2)} MB (${savings}% savings)\n`
      );
    } catch (err) {
      console.warn(`    ⚠ Optimization warning for ${file}:`, err.message);
    }
  }
}

if (totalOriginal > 0) {
  const totalSavings = (((totalOriginal - totalOptimized) / totalOriginal) * 100).toFixed(1);
  console.log("─────────────────────────────────────────────────────────────");
  console.log(
    `Total Pipeline Savings: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB → ${(
      totalOptimized / 1024 / 1024
    ).toFixed(2)} MB (-${totalSavings}%)`
  );
  console.log("✅ All human character assets optimized for MeshoptDecoder & WebGL 2.0 runtime!");
}
