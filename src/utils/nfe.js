export function getTag(el, tag) {
  if (!el) return "";
  const a = el.querySelector(tag);
  if (a) return a.textContent.trim();
  const b = el.getElementsByTagNameNS("*", tag)[0];
  return b ? b.textContent.trim() : "";
}

export function fmtQnt(val) {
  if (!val) return "";
  const n = parseFloat(val.replace(",", "."));
  return isNaN(n) ? val : String(Math.trunc(n));
}

export function fmtBRL(val) {
  if (!val) return "";
  const n = parseFloat(val.replace(",", "."));
  return isNaN(n)
    ? val
    : n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function fmtPct(val) {
  if (!val) return "";
  const n = parseFloat(val.replace(",", "."));
  return isNaN(n)
    ? val
    : n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%";
}

export function parseXml(text) {
  const doc = new DOMParser().parseFromString(text, "application/xml");
  if (doc.querySelector("parsererror")) throw new Error("XML inválido ou malformado.");
  return doc;
}

export function extractItems(xmlDoc, itemNums) {
  const infNFe =
    xmlDoc.querySelector("infNFe") || xmlDoc.getElementsByTagNameNS("*", "infNFe")[0];
  if (!infNFe) throw new Error("Estrutura NF-e não encontrada no XML.");

  const ide = infNFe.querySelector("ide") || infNFe.getElementsByTagNameNS("*", "ide")[0];
  const emit = infNFe.querySelector("emit") || infNFe.getElementsByTagNameNS("*", "emit")[0];
  const chave = (infNFe.getAttribute("Id") || "").replace(/^NFe/, "");

  const dataRaw = getTag(ide, "dhEmi") || getTag(ide, "dEmi");
  const dataEmissao = dataRaw ? dataRaw.substring(0, 10) : "";
  const nNF = getTag(ide, "nNF");
  const serie = getTag(ide, "serie");
  const mod = getTag(ide, "mod");
  const cnpjForn = getTag(emit, "CNPJ");

  const dets = Array.from(
    xmlDoc.querySelectorAll("det").length
      ? xmlDoc.querySelectorAll("det")
      : xmlDoc.getElementsByTagNameNS("*", "det"),
  );

  const rows = [];
  dets.forEach((det) => {
    const nItem = parseInt(det.getAttribute("nItem"), 10);
    if (itemNums !== null && !itemNums.includes(nItem)) return;

    const prod = det.querySelector("prod") || det.getElementsByTagNameNS("*", "prod")[0];
    if (!prod) return;

    const cProd = getTag(prod, "cProd");
    const qCom = fmtQnt(getTag(prod, "qCom"));
    const vUnCom = fmtBRL(getTag(prod, "vUnCom"));

    const imposto =
      det.querySelector("imposto") || det.getElementsByTagNameNS("*", "imposto")[0];
    const icmsWrap = imposto
      ? imposto.querySelector("ICMS") || imposto.getElementsByTagNameNS("*", "ICMS")[0]
      : null;
    const icmsNode = icmsWrap
      ? icmsWrap.children[0] || icmsWrap.getElementsByTagNameNS("*", "*")[0]
      : null;
    const g = (tag) => (icmsNode ? getTag(icmsNode, tag) || getTag(icmsWrap, tag) : "");

    rows.push({
      dataEmissao,
      nNF,
      serie,
      mod,
      chave,
      cnpjForn,
      item: nItem,
      cProd,
      codInterno: "",
      spacer: "",
      qCom,
      vUnCom,
      vBC: fmtBRL(g("vBC")),
      pICMS: fmtPct(g("pICMS")),
      pMVAST: fmtPct(g("pMVAST")),
      vBCST: fmtBRL(g("vBCST")),
      pICMSST: fmtPct(g("pICMSST")),
    });
  });

  return rows;
}

export function parseItemNumbers(str) {
  if (!str.trim()) return null;
  return str
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number);
}
