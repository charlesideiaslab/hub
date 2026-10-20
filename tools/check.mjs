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
check(/<title>Charles Ideias Lab<\/title>/.test(html), "title");
check(
  /name="description" content="Filmes, música e histórias que precisam existir\."/.test(html),
  "description"
);
check(/name="theme-color" content="#050505"/.test(html), "theme-color");

const og = html.match(/property="og:image" content="([^"]+)"/);
check(Boolean(og && og[1].startsWith("https://")), "og:image absoluto");

const links = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
const externos = links.filter((h) => !h.startsWith("#"));
check(!links.includes(""), "nenhum href vazio");
check(
  externos.every((h) => /^(https:\/\/|mailto:|assets\/|styles\.css$|bio\.html$|contato\.html$|index\.html$)/.test(h)),
  `links seguros (${externos.length})`
);

check(html.includes('href="bio.html"'), "link bio presente");
check(html.includes('href="contato.html"'), "link contato presente");

check(existsSync(p("assets/favicon.svg")), "favicon.svg existe");
check(existsSync(p("assets/og.png")), "og.png existe");

const fontes = ["assets/archivo-latin.woff2"];
check(fontes.every((f) => existsSync(p(f))), "fonte self-hosted presente");

const enforced = ["index.html", "styles.css", "assets/favicon.svg", "assets/og.png", ...fontes];
if (enforced.every((f) => existsSync(p(f)))) {
  const total = enforced.reduce((sum, f) => sum + statSync(p(f)).size, 0);
  check(total <= 120 * 1024, `peso total ${Math.round(total / 1024)}KB <= 120KB`);
} else {
  check(false, "peso total (arquivos faltando)");
}

check(css.includes("prefers-reduced-motion"), "respeita reduced motion");
check(css.includes(":focus-visible"), "foco visível");
check(/--bg:\s*#050505/.test(css), "token --bg");
check(css.includes("Archivo"), "tipografia presente");
check(css.includes("fundo-video"), "fundo de vídeo presente");
check(css.includes("backdrop-filter"), "glass effect presente");

const bio = read("bio.html");
const contato = read("contato.html");
check(bio.includes("Bio"), "bio.html existe");
check(contato.includes("Contato"), "contato.html existe");

console.log(failures === 0 ? "\nTudo certo." : `\n${failures} falha(s).`);
process.exit(failures === 0 ? 0 : 1);
