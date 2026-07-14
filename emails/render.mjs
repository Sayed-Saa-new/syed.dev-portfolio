#!/usr/bin/env node
// Render an MJML template + JSON vars → HTML
// Usage: node emails/render.mjs templates/blog-post.mjml vars/blog-post.json > out.html
import fs from "node:fs";
import path from "node:path";
import mjml2html from "mjml";

const [, , tplPath, varsPath] = process.argv;
if (!tplPath) {
  console.error("Usage: node emails/render.mjs <template.mjml> [vars.json]");
  process.exit(1);
}

let mjml = fs.readFileSync(path.resolve(tplPath), "utf8");
if (varsPath && fs.existsSync(varsPath)) {
  const vars = JSON.parse(fs.readFileSync(varsPath, "utf8"));
  for (const [k, v] of Object.entries(vars)) {
    mjml = mjml.replaceAll(`{{${k}}}`, String(v));
  }
}
const { html, errors } = mjml2html(mjml, { validationLevel: "soft" });
if (errors?.length) console.error(errors);
process.stdout.write(html);
