import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const src = path.join(root, "src");
fs.mkdirSync(src, { recursive: true });

let main = fs.readFileSync(path.join(root, "main.jsx"), "utf8");

// ConversionEditor opens a React Fragment with <> and must close it with </>.
const broken = "<TargetCalculator cost={cost}/></aside></div>\n}";
const fixed = "<TargetCalculator cost={cost}/></aside></div></>\n}";
if (main.includes(broken)) main = main.replace(broken, fixed);

fs.writeFileSync(path.join(src, "main.jsx"), main, "utf8");
fs.copyFileSync(path.join(root, "styles.css"), path.join(src, "styles.css"));
console.log("Prepared src/main.jsx and src/styles.css for Vite build.");
