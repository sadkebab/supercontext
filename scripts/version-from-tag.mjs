import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const packagePath = path.join(rootDir, "package.json");

const rawTag = process.argv[2] || process.env.GITHUB_REF_NAME;

if (!rawTag) {
  console.error("Missing tag. Pass a tag as an argument or set GITHUB_REF_NAME.");
  process.exit(1);
}

const version = rawTag.startsWith("v") ? rawTag.slice(1) : rawTag;
const semverPattern = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z-.]+)?(?:\+[0-9A-Za-z-.]+)?$/;

if (!semverPattern.test(version)) {
  console.error(`Tag "${rawTag}" does not map to a valid semver version.`);
  process.exit(1);
}

const pkgRaw = await readFile(packagePath, "utf8");
const pkg = JSON.parse(pkgRaw);
pkg.version = version;

await writeFile(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);

console.log(`Set package version to ${version} from tag ${rawTag}`);
