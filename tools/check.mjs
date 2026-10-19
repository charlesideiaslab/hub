import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const p = (f) => join(root, f);
const read = (f) => (existsSync(p(f)) ? readFileSync(p(f), "utf8") : "");

let failures = 0;
const check = (cond, label) => {
  if (cond) {
    console.log(`PASS  ${label}`);
  } else {
    failures += 1;
    console.log(`FAIL  ${label}`);
  }
};

const html = read("index.html");
const css = read("styles.css");

check(html.includes('<html lang="pt-BR">'), "lang pt-BR");
check(!/<script/i.test(html), "sem JavaScript");
check(/<title>Charles Ideias Lab — memória em forma de filme<\/title>/.test(html), "title");
check(
  /name="description" content="Cicatriz Sonora transforma acervo pessoal em filmes de memória\. Contato direto com Charles Ideias Lab\."/.test(html),
  "description"
);
check(/name="theme-color" content="#0E0D0B"/.test(html), "theme-color");

const og = html.match(/property="og:image" content="([^"]+)"/);
check(Boolean(og && og[1].startsWith("https://")), "og:image absoluto");

const modules = [...html.matchAll(/<a class="modulo"[\s\S]*?<\/a>/g)].map((m) => m[0]);
check(modules.length === 2, `2 módulos (achei ${modules.length})`);

for (const m of modules) {
  const href = (m.match(/href="([^"]+)"/) || [])[1] || "";
  check(href.startsWith("https://"), `href absoluto: ${href || "(vazio)"}`);
  check(
    /class="modulo__nome"/.test(m) &&
      /class="modulo__desc"/.test(m) &&
      /class="modulo__tag"/.test(m),
    "módulo com nome, descrição e etiqueta"
  );
}

check(!/href="#"/.test(html), "nenhum href vazio");
check(!/em breve|coming soon/i.test(html), "nenhum placeholder de conteúdo");

check(existsSync(p("assets/favicon.svg")), "favicon.svg existe");
check(existsSync(p("assets/og.png")), "og.png existe");

const font = "assets/manrope-latin-wght-normal.woff2";
check(existsSync(p(font)) && statSync(p(font)).size > 10000, "fonte self-hosted presente");

const enforced = ["index.html", "styles.css", "assets/favicon.svg", "assets/og.png", font];
if (enforced.every((f) => existsSync(p(f)))) {
  const total = enforced.reduce((sum, f) => sum + statSync(p(f)).size, 0);
  check(total <= 150 * 1024, `peso total ${Math.round(total / 1024)}KB <= 150KB`);
} else {
  check(false, "peso total (arquivos faltando)");
}

check(css.includes("prefers-reduced-motion"), "respeita reduced motion");
check(css.includes(":focus-visible"), "foco visível");
check(/--bg:\s*#0E0D0B/.test(css), "token --bg");
check(/--dim:\s*#9A9283/.test(css), "token --dim");

console.log(failures === 0 ? "\nTudo certo." : `\n${failures} falha(s).`);
process.exit(failures === 0 ? 0 : 1);
