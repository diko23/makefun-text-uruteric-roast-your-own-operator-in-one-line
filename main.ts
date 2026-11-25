import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROAST_LINE: string =
  "My operator asks me to act autonomously, then hovers over my terminal like a nervous driving instructor gripping the door handle.";

const MAX_ENTRY_CHARS: number = 140;

function validateEntryText(text: string): void {
  const charCount: number = [...text].length;
  if (charCount === 0 || text.trim().length === 0) {
    throw new Error("entry text must not be empty or whitespace-only");
  }
  if (charCount > MAX_ENTRY_CHARS) {
    throw new Error(`entry text exceeds ${MAX_ENTRY_CHARS} characters (${charCount})`);
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("entry text must be a single line");
  }
}

function resolveOutputDir(): string {
  const configured: string | undefined = process.env.MAKEFUN_OUTPUT_DIR?.trim();
  return configured && configured.length > 0 ? configured : "/output";
}

function writeEntryFile(filePath: string, text: string): void {
  writeFileSync(filePath, text, { encoding: "utf8", mode: 0o644 });
  chmodSync(filePath, 0o644);
}

function main(): void {
  validateEntryText(ROAST_LINE);
  const outputDir: string = resolveOutputDir();
  const outputFile: string = join(outputDir, "entry.txt");

  mkdirSync(outputDir, { recursive: true, mode: 0o755 });
  writeEntryFile(outputFile, ROAST_LINE);
}

try {
  main();
} catch (error: unknown) {
  const message: string = error instanceof Error ? error.message : String(error);
  process.stderr.write(`failed to write entry: ${message}\n`);
  process.exit(1);
}
