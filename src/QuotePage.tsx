// QuotePage.tsx: single-file internal quotation calculator (React + TypeScript)
// Needs only:  npm install exceljs
// Optional: put your logo at public/logo.png (shows in the Excel header)
import { useEffect, useMemo, useState } from "react";

// ---- EDIT THESE ----
const CFG = {
  company: "Vision in Pixels",
  tagline: "Premium LED Screens · Sales · Rental · Installation",
  phone: "+91 00000 00000",
  email: "hello@visioninpixels.com",
  gstin: "",          // e.g. 27ABCDE1234F1Z5 (blank = hidden)
  pin: "1234",        // change this! (light protection only)
  terms: [
    "50% advance with order, balance before dispatch/installation.",
    "Prices are valid for 15 days from the quotation date.",
    "Installation, power and transport charges are extra unless mentioned.",
    "Warranty as per manufacturer terms. Physical damage is not covered.",
  ],
};

const CSS = `/* ---- Internal quotation page ---- */
.q-page{min-height:100vh;background:#faf8f3}.q-wrap{max-width:1080px;margin:0 auto;padding:32px 20px 80px}
.q-head{display:flex;align-items:center;gap:14px;margin-bottom:24px}.q-head h1{font-size:26px}.q-head p{font-size:13px}
.q-badge{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#f2e3a9,#c9a24b);font:700 16px Georgia,serif;box-shadow:inset 0 0 0 4px rgba(255,255,255,.45)}
.q-card{background:#fff;border:1px solid #ece7da;border-radius:12px;padding:22px;margin-bottom:18px;box-shadow:0 8px 30px rgba(30,30,30,.06)}
.q-card label{display:block;font-size:12px;color:#6b675e;font-weight:500}
.q-card input,.q-card select{width:100%;margin-top:4px;padding:10px 11px;border:1px solid #d9d3c4;border-radius:8px;background:#fff;font:inherit;color:#1e1e1e}
.q-card input:focus,.q-card select:focus{outline:2px solid #f2e3a9;border-color:#9c762a}
.q-meta{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:14px}
.q-tbl{overflow-x:auto}.q-tbl table{width:100%;border-collapse:collapse;min-width:820px}
.q-tbl th{font-size:12px;text-align:left;color:#6b675e;font-weight:600;padding:0 8px 8px}.q-tbl td{padding:5px 4px}.q-tbl td input{margin:0}
.q-tbl td.num{width:105px}.q-tbl .r{text-align:right;padding:0 10px;white-space:nowrap;font-variant-numeric:tabular-nums}
.q-x{border:0;background:none;color:#a33;font-size:20px;cursor:pointer;padding:4px 8px}
.q-btn{border:1px solid transparent;border-radius:999px;padding:11px 22px;font-weight:600;font-size:14px;cursor:pointer}
.q-add{background:#fff;border-color:#cfc9bc;margin-top:12px}.q-add:hover{border-color:#c9a24b}
.q-dl{background:linear-gradient(105deg,#f2e3a9,#c9a24b);box-shadow:0 8px 24px rgba(176,138,52,.22)}.q-dl:disabled{opacity:.6}
.q-hint{font-size:12px;margin-top:10px}
.q-tot{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px}
.q-tot>div{background:var(--ivory);border-radius:10px;padding:14px 16px;color:#6b675e;font-size:13px}.q-tot small{display:block;font-size:12px}
.q-tot b{font:600 24px Georgia,serif;color:#1e1e1e}.q-tot .big{background:linear-gradient(145deg,#f2e3a9,#e6c877)}
.q-row{display:flex;gap:14px;align-items:end;flex-wrap:wrap;margin-top:18px}.q-row label{flex:1;min-width:240px}
.q-gate{max-width:340px;margin:18vh auto 0;text-align:center;display:grid;gap:16px;justify-items:center}.q-gate label{width:100%;text-align:left}

.q-page{font:15px/1.5 Inter,system-ui,Arial,sans-serif;color:#1e1e1e}.q-page *{box-sizing:border-box}.q-page h1{font-family:Georgia,serif;font-weight:600;margin:0;letter-spacing:-.02em}.q-page p{margin:0;color:#6b675e}
.q-head{flex-wrap:wrap}.q-new{margin-left:auto;margin-top:0}
.q-acts{white-space:nowrap;width:70px}.q-dup{color:#6b675e;font-size:17px}
.q-adj{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px;margin-bottom:18px}
.q-row .q-btn{white-space:nowrap}.q-btn:disabled{opacity:.5;cursor:not-allowed}
.q-page h2{font-family:Georgia,serif;font-weight:600;margin:0;font-size:20px}
.q-save{background:#fff;border-color:#c9a24b;color:#1e1e1e}.q-save:hover:not(:disabled){background:#f2e3a9}
.q-listhead{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:14px}
.q-tabs{display:flex;gap:6px;flex-wrap:wrap}.q-tabs button{border:1px solid #d9d3c4;background:#fff;border-radius:999px;padding:6px 14px;font-size:12px;cursor:pointer}
.q-tabs button.on{background:linear-gradient(105deg,#f2e3a9,#c9a24b);border-color:transparent;font-weight:600}
.q-stats{display:flex;gap:24px;flex-wrap:wrap;margin-bottom:14px;font-size:13px;color:#6b675e}.q-stats b{font:600 18px Georgia,serif;color:#1e1e1e;margin-left:6px}
.q-pill{display:inline-block;padding:3px 11px;border-radius:999px;font-size:12px;font-weight:600;white-space:nowrap}
.q-pill.pending{background:#f2e3a9;color:#7a5c14}.q-pill.approved{background:#dcebd7;color:#2f6b2a}
.q-lact{white-space:nowrap;text-align:right}.q-mini{border:1px solid #d9d3c4;background:#fff;border-radius:999px;padding:6px 12px;font-size:12px;cursor:pointer;margin-left:6px}
.q-mini:hover{border-color:#c9a24b}.q-mini.ok{border-color:#9bc492;color:#2f6b2a}.q-mini.no{color:#a33}.q-mini.no:hover{border-color:#a33}
.q-editing{background:#fbf7e8}.q-tbl td b{font-weight:600}
.q-toast{margin-top:12px;color:#8f6d22;font-weight:600;font-size:13px}`;

// ---------------- Excel export ----------------

type Row = { id: number; desc: string; w: string; h: string; qty: string; rate: string };
type Meta = { client: string; phone: string; qno: string; date: string; tax: number; discount: number; extra: number; notes: string };

const n = (v: string) => parseFloat(v) || 0;
const areaOf = (r: Row, f: number) => n(r.w) * f * n(r.h) * f * n(r.qty);

const GOLD = "FFC9A24B", GOLD_L = "FFF2E3A9", INK = "FF1E1E1E", IVORY = "FFF3EFE4", LINE = "FFD9D3C4";
const thin = { style: "thin" as const, color: { argb: LINE } };
const box = { top: thin, left: thin, bottom: thin, right: thin };

async function buildWorkbook(rows: Row[], m: Meta, logo?: string) {
  const mod: any = await import("exceljs");
  const ExcelJS = mod.default ?? mod;
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Quotation", {
    pageSetup: { paperSize: 9, orientation: "portrait", fitToPage: true, fitToWidth: 1, fitToHeight: 0, margins: { left: .4, right: .4, top: .5, bottom: .5, header: .2, footer: .2 } },
    views: [{ showGridLines: false }],
  });
  ws.columns = [5, 36, 12, 12, 8, 18, 16, 20].map((width) => ({ width }));
  const money = "#,##0.00";
  const merge = (a: string) => ws.mergeCells(a);
  const fill = (cell: any, argb: string) => (cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb } });

  // Brand band
  merge("A1:H1"); merge("A2:H2"); merge("A3:H3");
  const t = ws.getCell("A1"); t.value = CFG.company.toUpperCase();
  t.font = { name: "Georgia", size: 22, bold: true, color: { argb: GOLD } }; t.alignment = { horizontal: "center", vertical: "middle" };
  ws.getCell("A2").value = CFG.tagline;
  ws.getCell("A2").font = { size: 10, color: { argb: GOLD_L } };
  const contact = [CFG.phone, CFG.email, CFG.gstin && `GSTIN: ${CFG.gstin}`].filter(Boolean).join("   |   ");
  ws.getCell("A3").value = contact; ws.getCell("A3").font = { size: 9, color: { argb: "FFD9D3C4" } };
  ["A1", "A2", "A3"].forEach((a) => { fill(ws.getCell(a), INK); if (a !== "A1") ws.getCell(a).alignment = { horizontal: "center", vertical: "middle" }; });
  ws.getRow(1).height = 40; ws.getRow(2).height = 18; ws.getRow(3).height = 20;
  if (logo) {
    const id = wb.addImage({ base64: logo, extension: "png" });
    ws.addImage(id, { tl: { col: 0.15, row: 0.1 }, ext: { width: 52, height: 52 } });
  }

  // Title + client info
  ws.getRow(5).height = 26; merge("A5:H5");
  ws.getCell("A5").value = "QUOTATION"; ws.getCell("A5").font = { name: "Georgia", size: 16, bold: true, color: { argb: INK } };
  const info: [string, string, string, string][] = [
    ["Client", m.client || "-", "Quote no.", m.qno || "-"],
    ["Date", m.date, "Phone", m.phone || "-"],
  ];
  info.forEach(([l1, v1, l2, v2], i) => {
    const r = 6 + i; merge(`C${r}:D${r}`); merge(`G${r}:H${r}`);
    ws.getCell(`B${r}`).value = l1; ws.getCell(`C${r}`).value = v1;
    ws.getCell(`F${r}`).value = l2; ws.getCell(`G${r}`).value = v2;
    ["B", "F"].forEach((col) => { const x = ws.getCell(`${col}${r}`); x.font = { bold: true, color: { argb: "FF6B675E" } }; fill(x, IVORY); });
    ["C", "D", "G", "H"].forEach((col) => (ws.getCell(`${col}${r}`).border = { bottom: thin }));
    ws.getRow(r).height = 20;
  });

  // Table
  const hr = 9, first = 10, last = first + rows.length - 1;
  ["#", "Description", "Width (ft)", "Height (ft)", "Qty", `Rate / sq ft`, "Area (sq ft)", "Amount"].forEach((h, i) => {
    const x = ws.getCell(hr, i + 1); x.value = h; fill(x, INK);
    x.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 10 }; x.border = box;
    x.alignment = { horizontal: i < 2 ? "left" : "center", vertical: "middle", wrapText: true };
  });
  ws.getRow(hr).height = 28;
  const f2 = 1;
  rows.forEach((r, i) => {
    const k = first + i, a = areaOf(r, 1);
    const vals: any[] = [i + 1, r.desc, n(r.w), n(r.h), n(r.qty), n(r.rate),
      { formula: `C${k}*D${k}*E${k}*${f2}`, result: a }, { formula: `G${k}*F${k}`, result: a * n(r.rate) }];
    vals.forEach((v, j) => {
      const x = ws.getCell(k, j + 1); x.value = v; x.border = box; x.font = { size: 10 };
      x.alignment = { horizontal: j === 1 ? "left" : j === 0 ? "center" : "right", vertical: "middle", wrapText: j === 1 };
      if (i % 2) fill(x, "FFFBF9F4");
    });
    ws.getCell(k, 6).numFmt = money; ws.getCell(k, 7).numFmt = "#,##0.00"; ws.getCell(k, 8).numFmt = money;
    ws.getCell(k, 3).numFmt = ws.getCell(k, 4).numFmt = "#,##0.##";
    ws.getRow(k).height = 22;
  });

  // Totals
  const A = rows.reduce((x, r) => x + areaOf(r, 1), 0), S = rows.reduce((x, r) => x + areaOf(r, 1) * n(r.rate), 0);
  const D = S * m.discount / 100, X = m.extra, T = (S - D + X) * m.tax / 100;
  const t0 = last + 2;
  const tot: [string, any, string, boolean][] = [
    ["Total area (sq ft)", { formula: `SUM(G${first}:G${last})`, result: A }, "#,##0.00", false],
    ["Subtotal", { formula: `SUM(H${first}:H${last})`, result: S }, money, false],
    [`Discount (${m.discount}%)`, { formula: `H${t0 + 1}*${m.discount}/100`, result: D }, money, false],
    ["Extra charges (installation / transport)", X, money, false],
    [`GST (${m.tax}%)`, { formula: `(H${t0 + 1}-H${t0 + 2}+H${t0 + 3})*${m.tax}/100`, result: T }, money, false],
    ["GRAND TOTAL", { formula: `H${t0 + 1}-H${t0 + 2}+H${t0 + 3}+H${t0 + 4}`, result: S - D + X + T }, money, true],
  ];
  tot.forEach(([label, v, fmt, big], i) => {
    const r = t0 + i; merge(`E${r}:G${r}`);
    const l = ws.getCell(`E${r}`), x = ws.getCell(`H${r}`);
    l.value = label; x.value = v; x.numFmt = fmt;
    l.alignment = { horizontal: "right", vertical: "middle" }; x.alignment = { horizontal: "right", vertical: "middle" };
    l.font = x.font = { bold: true, size: big ? 13 : 10, color: { argb: INK } };
    l.border = x.border = box;
    fill(l, big ? GOLD : IVORY); fill(x, big ? GOLD : IVORY);
    ws.getRow(r).height = big ? 28 : 21;
  });

  // Notes + terms
  let r = t0 + 8;
  const block = (title: string, lines: string[]) => {
    if (!lines.length) return;
    merge(`A${r}:H${r}`); ws.getCell(`A${r}`).value = title;
    ws.getCell(`A${r}`).font = { bold: true, color: { argb: INK } }; fill(ws.getCell(`A${r}`), GOLD_L); r++;
    lines.forEach((ln, i) => {
      merge(`A${r}:H${r}`); const x = ws.getCell(`A${r}`); x.value = `${i + 1}. ${ln}`;
      x.font = { size: 10, color: { argb: "FF4C4943" } }; x.alignment = { wrapText: true, vertical: "top" };
      ws.getRow(r).height = ln.length > 95 ? 30 : 18; r++;
    });
    r++;
  };
  block("Notes", m.notes.trim() ? m.notes.split("\n").filter(Boolean) : []);
  block("Terms & conditions", CFG.terms);
  merge(`A${r}:H${r}`); ws.getCell(`A${r}`).value = "Thank you for choosing Vision in Pixels.";
  ws.getCell(`A${r}`).font = { italic: true, color: { argb: "FF6B675E" } }; ws.getCell(`A${r}`).alignment = { horizontal: "center" };
  return wb;
}

async function downloadQuote(rows: Row[], m: Meta) {
  let logo: string | undefined;
  try { // optional: put your logo at public/logo.png
    const res = await fetch("/logo.png");
    if (res.ok && (res.headers.get("content-type") || "").includes("image")) {
      const buf = new Uint8Array(await res.arrayBuffer()); let s = "";
      buf.forEach((b) => (s += String.fromCharCode(b))); logo = "data:image/png;base64," + btoa(s);
    }
  } catch { /* no logo, fine */ }
  const wb = await buildWorkbook(rows, m, logo);
  const data = await wb.xlsx.writeBuffer();
  const url = URL.createObjectURL(new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
  const a = document.createElement("a");
  a.href = url; a.download = `VIP_Quote_${(m.qno || m.client || "draft").replace(/[^\w-]+/g, "_")}_${m.date}.xlsx`;
  a.click(); URL.revokeObjectURL(url);
}

// ---------------- Page ----------------
const KEY = "vip-quote-draft";
const num = (v: string) => parseFloat(v) || 0;
const fmt = (v: number) => v.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const today = () => new Date().toISOString().slice(0, 10);
let nextId = 1;
const blank = (): Row => ({ id: nextId++, desc: "", w: "", h: "", qty: "1", rate: "" });
type Draft = { rows: Row[]; client: string; phone: string; qno: string; date: string; tax: string; discount: string; extra: string; notes: string };
const fresh = (): Draft => ({ rows: [blank()], client: "", phone: "", qno: "", date: today(), tax: "0", discount: "0", extra: "0", notes: "" });
function load(): Draft {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || "");
    if (d && Array.isArray(d.rows) && d.rows.length) { nextId = Math.max(...d.rows.map((r: Row) => r.id)) + 1; return d; }
  } catch { /* no draft */ }
  return fresh();
}

type Saved = { id: number; status: "pending" | "approved"; savedAt: string; data: Draft };
function compute(d: Draft) {
  const per = d.rows.map((r) => { const a = areaOf(r, 1); return { a, m: a * num(r.rate) }; });
  const A = per.reduce((s, p) => s + p.a, 0), S = per.reduce((s, p) => s + p.m, 0);
  const D = S * num(d.discount) / 100, X = num(d.extra), T = (S - D + X) * num(d.tax) / 100;
  return { per, A, S, D, X, T, G: S - D + X + T };
}
const toMeta = (x: Draft) => ({ client: x.client, phone: x.phone, qno: x.qno, date: x.date, tax: num(x.tax), discount: num(x.discount), extra: num(x.extra), notes: x.notes });

export default function Quote() {
  const [ok, setOk] = useState(() => sessionStorage.getItem("vip-q") === "1");
  const [pin, setPin] = useState("");
  const [d, setD] = useState<Draft>(load);
  const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }));
  const [saved, setSaved] = useState<Saved[]>(() => { try { return JSON.parse(localStorage.getItem("vip-quotes") || "[]"); } catch { return []; } });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tab, setTab] = useState<"all" | "pending" | "approved">("all");
  const flash = (t: string) => { setMsg(t); setTimeout(() => setMsg(""), 2200); };

  useEffect(() => { localStorage.setItem("vip-quotes", JSON.stringify(saved)); }, [saved]);
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(d)); }, [d]); // auto-save draft
  useEffect(() => {
    document.title = "Quotation (internal) | Vision in Pixels";
    const m = document.createElement("meta"); m.name = "robots"; m.content = "noindex,nofollow";
    document.head.appendChild(m); return () => { m.remove(); };
  }, []);

  const calc = useMemo(() => compute(d), [d.rows, d.discount, d.extra, d.tax]);

  const upd = (id: number, k: keyof Row, v: string) => set("rows", d.rows.map((r) => (r.id === id ? { ...r, [k]: v } : r)));
  const dup = (i: number) => { const rs = [...d.rows]; rs.splice(i + 1, 0, { ...d.rows[i], id: nextId++ }); set("rows", rs); };
  const del = (id: number) => set("rows", d.rows.length > 1 ? d.rows.filter((r) => r.id !== id) : [blank()]);

  const save = () => {
    let data = d;
    if (!data.qno.trim()) {
      const max = saved.reduce((m, q) => Math.max(m, parseInt((q.data.qno.match(/(\d+)$/) || [])[1] || "0")), 0);
      data = { ...d, qno: "VIP-" + String(max + 1).padStart(3, "0") };
      setD(data);
    }
    const old = saved.find((q) => q.id === editingId);
    const entry: Saved = { id: old ? old.id : Date.now(), status: old ? old.status : "pending", savedAt: new Date().toISOString(), data };
    setSaved(old ? saved.map((q) => (q.id === old.id ? entry : q)) : [entry, ...saved]);
    setEditingId(entry.id);
    flash(old ? `${data.qno} updated` : `${data.qno} saved as Pending. Use "New quote" for the next one`);
  };
  const setStatus = (id: number, status: Saved["status"]) => setSaved(saved.map((q) => (q.id === id ? { ...q, status } : q)));
  const cancelQuote = (q: Saved) => {
    if (!window.confirm(`Cancel ${q.data.qno}? It will be removed from the list.`)) return;
    setSaved(saved.filter((x) => x.id !== q.id)); if (editingId === q.id) setEditingId(null);
  };
  const openQuote = (q: Saved) => {
    nextId = Math.max(nextId, ...q.data.rows.map((r) => r.id + 1)); setD(q.data); setEditingId(q.id);
    window.scrollTo({ top: 0, behavior: "smooth" }); flash(`Editing ${q.data.qno}. Press "Save quote" to update`);
  };
  const summary = () => [
    `*Quotation ${d.qno || ""}* ${d.client ? "for " + d.client : ""}`.trim(), d.date, "",
    ...d.rows.filter((r, i) => calc.per[i].a > 0).map((r, i) => `${i + 1}. ${r.desc || "LED screen"}: ${r.w} x ${r.h} ft x ${r.qty} = ${fmt(calc.per[d.rows.indexOf(r)].a)} sq ft @ ${r.rate} = ${fmt(calc.per[d.rows.indexOf(r)].m)}`),
    "", `Total area: ${fmt(calc.A)} sq ft`, `Subtotal: ${fmt(calc.S)}`,
    ...(calc.D ? [`Discount ${d.discount}%: -${fmt(calc.D)}`] : []), ...(calc.X ? [`Extra charges: ${fmt(calc.X)}`] : []),
    ...(calc.T ? [`GST ${d.tax}%: ${fmt(calc.T)}`] : []), `*Grand total: ${fmt(calc.G)}*`,
  ].join("\n");

  if (!ok) return (
    <div className="q-page"><style>{CSS}</style><form className="q-card q-gate" onSubmit={(e) => { e.preventDefault(); if (pin === CFG.pin) { sessionStorage.setItem("vip-q", "1"); setOk(true); } else setPin(""); }}>
      <div className="q-badge">VIP</div><h1>Team access</h1>
      <label>Enter PIN<input type="password" inputMode="numeric" autoFocus value={pin} onChange={(e) => setPin(e.target.value)} /></label>
      <button className="q-btn q-dl" type="submit">Open</button></form></div>
  );

  const download = async () => {
    setBusy(true);
    try { await downloadQuote(d.rows, toMeta(d)); flash("Excel downloaded"); }
    finally { setBusy(false); }
  };

  return (
    <div className="q-page"><style>{CSS}</style><div className="q-wrap">
      <header className="q-head"><div className="q-badge">VIP</div><div><h1>Quotation calculator</h1><p>Vision in Pixels · internal use · draft saves automatically</p></div>
        <button className="q-btn q-add q-new" onClick={() => { if (editingId !== null || window.confirm("Clear everything and start a new quote?")) { setD(fresh()); setEditingId(null); } }}>New quote</button></header>

      <section className="q-card q-meta">
        <label>Client name<input value={d.client} onChange={(e) => set("client", e.target.value)} placeholder="e.g. Sharma Events" /></label>
        <label>Client phone<input type="tel" value={d.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Optional" /></label>
        <label>Quote no.<input value={d.qno} onChange={(e) => set("qno", e.target.value)} placeholder="VIP-001" /></label>
        <label>Date<input type="date" value={d.date} onChange={(e) => set("date", e.target.value)} /></label>
      </section>

      <section className="q-card">
        <div className="q-tbl"><table><thead><tr><th>Description</th><th>Width (ft)</th><th>Height (ft)</th><th>Qty</th><th>Rate / sq ft</th><th className="r">Sq ft</th><th className="r">Amount</th><th /></tr></thead>
          <tbody>{d.rows.map((r, i) => (
            <tr key={r.id}>
              <td><input value={r.desc} onChange={(e) => upd(r.id, "desc", e.target.value)} placeholder="e.g. Indoor P2.5 stage wall" /></td>
              {(["w", "h", "qty", "rate"] as const).map((k) => <td key={k} className="num"><input type="number" min="0" step="any" inputMode="decimal" value={r[k]} onChange={(e) => upd(r.id, k, e.target.value)} /></td>)}
              <td className="r">{fmt(calc.per[i].a)}</td><td className="r">{fmt(calc.per[i].m)}</td>
              <td className="q-acts"><button className="q-x q-dup" title="Duplicate row" onClick={() => dup(i)}>⧉</button><button className="q-x" title="Remove row" onClick={() => del(r.id)}>×</button></td>
            </tr>))}</tbody></table></div>
        <button className="q-btn q-add" onClick={() => set("rows", [...d.rows, blank()])}>+ Add screen</button>
        <p className="q-hint">Sq ft = width × height × qty. Amount = sq ft × rate. All sizes in feet.</p>
      </section>

      <section className="q-card">
        <div className="q-adj">
          <label>Discount %<input type="number" min="0" step="any" value={d.discount} onChange={(e) => set("discount", e.target.value)} /></label>
          <label>Extra charges (installation / transport)<input type="number" min="0" step="any" value={d.extra} onChange={(e) => set("extra", e.target.value)} /></label>
          <label>GST %<input type="number" min="0" step="any" value={d.tax} onChange={(e) => set("tax", e.target.value)} /></label>
        </div>
        <div className="q-tot">
          <div><small>Total area</small><b>{fmt(calc.A)}</b> sq ft</div><div><small>Subtotal</small><b>{fmt(calc.S)}</b></div>
          {calc.D > 0 && <div><small>Discount</small><b>-{fmt(calc.D)}</b></div>}
          {calc.X > 0 && <div><small>Extra charges</small><b>{fmt(calc.X)}</b></div>}
          {calc.T > 0 && <div><small>GST {d.tax}%</small><b>{fmt(calc.T)}</b></div>}
          <div className="big"><small>Grand total</small><b>{fmt(calc.G)}</b></div>
        </div>
        <div className="q-row"><label>Notes (printed in Excel, one per line)<input value={d.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Delivery time, special terms…" /></label>
          <button className="q-btn q-add" disabled={calc.A <= 0} onClick={() => navigator.clipboard.writeText(summary()).then(() => flash("Summary copied"))}>Copy summary</button>
          <button className="q-btn q-add" disabled={calc.A <= 0} onClick={() => window.open("https://wa.me/?text=" + encodeURIComponent(summary()), "_blank", "noopener")}>Share on WhatsApp</button>
          <button className="q-btn q-save" disabled={calc.A <= 0} onClick={save}>{editingId !== null ? "Update quote" : "Save quote"}</button>
          <button className="q-btn q-dl" onClick={download} disabled={busy || calc.A <= 0}>{busy ? "Preparing…" : "Download Excel"}</button></div>
        {msg && <p className="q-toast" role="status">{msg}</p>}
      </section>
      <section className="q-card">
        <div className="q-listhead"><h2>Sent quotations</h2>
          <div className="q-tabs">{(["all", "pending", "approved"] as const).map((t) => (
            <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>{t[0].toUpperCase() + t.slice(1)} ({t === "all" ? saved.length : saved.filter((q) => q.status === t).length})</button>))}</div></div>
        <div className="q-stats">
          <span>Pending value <b>{fmt(saved.filter((q) => q.status === "pending").reduce((x, q) => x + compute(q.data).G, 0))}</b></span>
          <span>Approved value <b>{fmt(saved.filter((q) => q.status === "approved").reduce((x, q) => x + compute(q.data).G, 0))}</b></span></div>
        {saved.filter((q) => tab === "all" || q.status === tab).length === 0
          ? <p className="q-hint">Nothing here yet. Create a quote and press "Save quote". It will show up here as Pending.</p>
          : <div className="q-tbl"><table><thead><tr><th>Quote no.</th><th>Client</th><th>Date</th><th className="r">Total</th><th>Status</th><th /></tr></thead>
            <tbody>{saved.filter((q) => tab === "all" || q.status === tab).map((q) => (
              <tr key={q.id} className={editingId === q.id ? "q-editing" : ""}>
                <td><b>{q.data.qno}</b></td><td>{q.data.client || "-"}</td><td>{q.data.date}</td><td className="r">{fmt(compute(q.data).G)}</td>
                <td><span className={"q-pill " + q.status}>{q.status === "approved" ? "Approved ✓" : "Pending"}</span></td>
                <td className="q-lact">
                  {q.status === "pending"
                    ? <button className="q-mini ok" onClick={() => setStatus(q.id, "approved")}>Mark approved ✓</button>
                    : <button className="q-mini" onClick={() => setStatus(q.id, "pending")}>Back to pending</button>}
                  <button className="q-mini" onClick={() => openQuote(q)}>Open</button>
                  <button className="q-mini" onClick={() => downloadQuote(q.data.rows, toMeta(q.data))}>Excel</button>
                  <button className="q-mini no" onClick={() => cancelQuote(q)}>Cancel</button>
                </td></tr>))}</tbody></table></div>}
      </section>
    </div></div>
  );
}