import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const sets = JSON.parse(await readFile(path.join(root, "lib", "angle-sets.json"), "utf8"));
const outDir = path.join(root, "public", "images", "angles");
await mkdir(outDir, { recursive: true });

const planned = [];
const counters = {};
for (const set of sets) {
  if (!set.ids || set.ids.length < 3) continue;
  counters[set.group] = (counters[set.group] || 0) + 1;
  const n = String(counters[set.group]).padStart(2, "0");
  const shots = set.ids.slice(0, 4).map((id, index) => ({
    id: String(id),
    file: path.join(outDir, `${set.group}-${n}-${index + 1}.jpg`),
    publicPath: `/images/angles/${set.group}-${n}-${index + 1}.jpg`,
  }));
  planned.push({ group: set.group, shots });
}

async function download(shot) {
  const url = `https://images.pexels.com/photos/${shot.id}/pexels-photo-${shot.id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!response.ok) continue;
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length > 8_000 && bytes[0] === 0xff && bytes[1] === 0xd8) {
        await writeFile(shot.file, bytes);
        return true;
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
    }
  }
  return false;
}

const queue = planned.flatMap((item) => item.shots);
let cursor = 0;
let saved = 0;
const failed = [];

async function worker() {
  while (cursor < queue.length) {
    const shot = queue[cursor];
    cursor += 1;
    const ok = await download(shot);
    if (ok) saved += 1;
    else failed.push(shot.id);
  }
}

await Promise.all(Array.from({ length: 8 }, () => worker()));

const galleries = {};
for (const item of planned) {
  const ready = item.shots.filter((shot) => !failed.includes(shot.id));
  if (ready.length < 3) continue;
  if (!galleries[item.group]) galleries[item.group] = [];
  galleries[item.group].push(ready.map((shot) => shot.publicPath));
}

await writeFile(path.join(root, "lib", "galleries.json"), `${JSON.stringify(galleries, null, 2)}\n`);
console.log("saved", saved, "of", queue.length, "failed", failed.length);
for (const [group, list] of Object.entries(galleries)) {
  const min = Math.min(...list.map((shots) => shots.length));
  console.log(group, list.length, "min", min);
}
if (failed.length) console.log(failed.slice(0, 20).join(","));
