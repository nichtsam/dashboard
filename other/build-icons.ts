import { mkdirSync, rmdirSync } from "fs";
import { readFile, readdir, writeFile } from "fs/promises";
import { basename, dirname, resolve } from "path";

import { format } from "prettier";
import { parse } from "node-html-parser";

const __filename = import.meta.filename;
const __dirname = dirname(__filename);
const __rootname = resolve(__dirname, "../");
const root = (...paths: string[]) => resolve(__rootname, ...paths);

const inputDir = root("other", "svg-icons");
const outputDir = root("app", "components", "ui", "icons");
mkdirSync(outputDir, { recursive: true });

const files = await readdir(inputDir).catch(() => [] as string[]);

if (files.length === 0) {
  console.log(`No SVG files found in ${inputDir}`);
  rmdirSync(outputDir);
} else {
  await generateIconFiles();
}

async function generateIconFiles() {
  await Promise.all([
    generateSprite(files),
    generateType(files),
    generateReadme(),
  ]);
}

async function generateSprite(files: string[]) {
  const symbols = await Promise.all(
    files.map(async (file) => {
      const input = await readFile(resolve(inputDir, file), "utf-8");
      const root = parse(input);
      const svg = root.querySelector("svg");
      if (!svg) throw new Error("No SVG element found");

      svg.tagName = "symbol";
      svg.setAttribute("id", basename(file, ".svg"));
      svg.removeAttribute("xmlns");
      svg.removeAttribute("xmlns:xlink");
      svg.removeAttribute("version");
      svg.removeAttribute("width");
      svg.removeAttribute("height");

      return svg.toString().trim();
    }),
  );

  const spriteOutputPath = resolve(outputDir, "sprite.svg");
  const spriteOutputContent = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<!-- Generated by pnpm build:icons -->`,
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0">`,
    `<defs>`,
    ...symbols,
    `</defs>`,
    `</svg>`,
  ].join("\n");

  await writeFile(spriteOutputPath, spriteOutputContent);
}

async function generateType(files: string[]) {
  const iconNames = files.map((file) => JSON.stringify(basename(file, ".svg")));
  const typeOutputPath = resolve(outputDir, "name.ts");
  const typeOutputContent = await format(
    [
      "// Generated by pnpm build:icons",
      "\n",
      `export type IconName = ${iconNames.join("|")}`,
    ].join("\n"),
    { parser: "typescript" },
  );

  await writeFile(typeOutputPath, typeOutputContent);
}

async function generateReadme() {
  const readmeOutputPath = resolve(outputDir, "README.md");
  const readmeOutputContent = await format(
    [
      "# Icons",
      "This directory contains SVG icons that are used by the app.",
      "Everything in this directory is generated by `pnpm build:icons`.",
    ].join("\n"),
    { parser: "markdown" },
  );

  await writeFile(readmeOutputPath, readmeOutputContent);
}