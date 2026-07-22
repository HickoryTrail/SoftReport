import { cpSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const sourceDir = resolve(root, "fonts");
const targetDir = resolve(root, "dist", "fonts");
const requiredFonts = [
  "HarmonyOS_Sans_SC_Regular.ttf",
  "HarmonyOS_Sans_SC_Medium.ttf",
  "HarmonyOS_Sans_SC_Bold.ttf",
];

rmSync(targetDir, { recursive: true, force: true });
mkdirSync(targetDir, { recursive: true });

for (const font of requiredFonts) {
  cpSync(resolve(sourceDir, font), resolve(targetDir, font));
}
