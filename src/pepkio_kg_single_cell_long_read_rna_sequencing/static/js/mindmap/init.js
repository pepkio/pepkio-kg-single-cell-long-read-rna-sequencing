import { Transformer } from "https://cdn.jsdelivr.net/npm/markmap-lib@0.18.9/+esm";
import { Markmap } from "https://cdn.jsdelivr.net/npm/markmap-view@0.18.9/+esm";

let markmapInstance = null;

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, "").trim();
}

export function initMindmap(container, markdown, registry, { onSelect } = {}) {
  container.innerHTML = '<svg id="mindmap-svg"></svg>';
  const svg = container.querySelector("#mindmap-svg");

  const transformer = new Transformer();
  const { root } = transformer.transform(markdown);
  markmapInstance = Markmap.create(svg, { autoFit: true, zoom: true, pan: true }, root);
  markmapInstance.fit();

  svg.addEventListener("click", (event) => {
    const fo = event.target.closest("foreignObject");
    if (!fo) return;
    const text = stripHtml(fo.innerHTML);
    if (!text) return;
    const resolved = registry.resolveNode(text);
    onSelect?.(registry.buildDetail(resolved, text));
  });

  return {
    fit: () => markmapInstance?.fit(),
    resize: () => {
      markmapInstance?.fit();
    },
  };
}

export function destroyMindmap() {
  markmapInstance = null;
}
