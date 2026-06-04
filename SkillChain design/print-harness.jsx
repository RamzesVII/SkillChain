/* SkillChain — PRINT harness: renders each screen statically, one per page */

const SC_ACCENTS_P = {
  gradient: { "--a1": "oklch(0.68 0.20 30)", "--a2": "oklch(0.62 0.21 320)", "--asolid": "oklch(0.72 0.18 350)", "--aglowH": "340" },
};
const ACC = { ...SC_ACCENTS_P.gradient, "--aglow": "0.55" };
const noop = () => {};
const B = window.SC_BLOCKS;

function Topbar({ active, showSearch }) {
  return (
    <div className="topbar">
      <div className="wm"><img className="wm-logo" src={(window.__resources && window.__resources.logo) || "assets/skillchain-logo-cut.png"} alt="SkillChain" /></div>
      <nav className="nav">
        <button className={active === "discover" ? "on" : ""}>Discover</button>
        <button className={active === "publish" ? "on" : ""}>Publish</button>
        <button className={active === "library" ? "on" : ""}>Library</button>
      </nav>
      <div className="topbar-right">
        {showSearch && (
          <div className="search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.3-4.3"></path></svg>
            <input defaultValue="" placeholder="Search blocks, creators…" readOnly />
          </div>
        )}
        <div className="wallet">0x7a…F09c</div>
        <button className="bundle-btn">Bundle <span className="cnt">3</span></button>
      </div>
    </div>
  );
}

function Ticker() {
  const ticker = B.slice(0, 8);
  return (
    <div className="ticker">
      <div className="ticker-track" style={{ animation: "none" }}>
        {ticker.map((b, i) => <span key={i}>{b.ip} <b>{b.title.slice(0, 36)}</b> · {b.price} IP</span>)}
      </div>
    </div>
  );
}

// content-aware bento variants (mirror of app.jsx)
function bentoVariants(rest) {
  const v = {}; let tall = 0;
  for (const b of rest) if ((b.type === "video" || b.type === "image") && tall < 3) { v[b.id] = "tall"; tall++; }
  rest.filter((b) => !v[b.id]).sort((a, b) => b.reads - a.reads).slice(0, 2).forEach((b) => { v[b.id] = "wide"; });
  return v;
}

function Discover() {
  const featured = B.reduce((m, b) => b.reads > m.reads ? b : m, B[0]);
  const rest = B.filter((b) => b.id !== featured.id);
  const variants = bentoVariants(rest);
  const inB = (id) => ["3", "8", "1"].includes(id);
  const cats = ["All", "DeFi", "Trading", "Dev", "Research", "Growth", "Predictions"];
  return (
    <div className="shell">
      <div className="pagehead">
        <div>
          <div className="kick">Curated IP Assets · Story Protocol</div>
          <div className="h1">Knowledge Blocks</div>
        </div>
        <div className="stats">
          <div className="stat"><b>247</b><span>Assets</span></div>
          <div className="stat"><b>89</b><span>Creators</span></div>
          <div className="stat"><b>1.4K</b><span>Licenses</span></div>
        </div>
      </div>
      <div className="filterbar">
        {cats.map((c, i) => <button key={c} className={"chip" + (i === 0 ? " on" : "")}>{c}</button>)}
        <div className="filter-spacer"></div>
        <div className="sortcount">{B.length} results</div>
      </div>
      <div className="grid">
        <SCFeatured block={featured} added={inB(featured.id)} onAdd={noop} onOpen={noop} />
        {rest.map((b, i) => (
          <SCFlipCard key={b.id} block={b} index={i + 1} added={inB(b.id)}
            variant={variants[b.id] || "normal"} delay={0} onAdd={noop} onOpen={noop} />
        ))}
      </div>
    </div>
  );
}

function Page({ children, active, search, ticker = true, label }) {
  return (
    <div className="print-page">
      {label && <div className="print-label">{label}</div>}
      <div className="app noanim" style={ACC} data-density="regular" data-layout="bento">
        <Topbar active={active} showSearch={search} />
        {ticker && <Ticker />}
        {children}
      </div>
    </div>
  );
}

function PrintApp() {
  const detailBlock = B[2]; // Reading orderflow (video)
  const bundleItems = [B[2], B[8], B[0]];
  const owned = [B[3], B[11], B[5]];
  return (
    <>
      {/* 1 — Hero / landing */}
      <div className="print-page">
        <div className="print-label">01 · Landing</div>
        <div className="app noanim" style={ACC} data-layout="bento">
          <Topbar active="home" showSearch={false} />
          <SCHero onEnter={noop} onPublish={noop} animate={false} />
        </div>
      </div>

      {/* 2 — Discover */}
      <Page active="discover" search={true} label="02 · Discover — bento grid + locked previews"><Discover /></Page>

      {/* 3 — Block detail */}
      <div className="print-page">
        <div className="print-label">03 · Block detail</div>
        <div className="app noanim print-overlay" style={ACC} data-layout="bento">
          <SCDetail block={detailBlock} added={false} onClose={noop} onAdd={noop} />
        </div>
      </div>

      {/* 4 — Publish */}
      <Page active="publish" search={false} label="04 · Publish — live preview"><SCPublish onPublish={noop} /></Page>

      {/* 5 — Library */}
      <Page active="library" search={false} label="05 · Library — owned + reader"><SCLibrary owned={owned} onBrowse={noop} /></Page>

      {/* 6 — Checkout */}
      <Page active="" search={false} label="06 · Checkout — bundle mint"><SCCheckout items={bundleItems} onRemove={noop} onBrowse={noop} onComplete={noop} /></Page>

      {/* 7 — Bundle slide-over (shown inline) */}
      <div className="print-page">
        <div className="print-label">07 · Bundle slide-over</div>
        <div className="app noanim print-bundle" style={ACC} data-layout="bento">
          <SCBundle items={bundleItems} onClose={noop} onRemove={noop} onUnlock={noop} />
        </div>
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<PrintApp />);

// auto-print once fonts + layout settle
(function () {
  function ready() {
    const done = () => setTimeout(() => window.print(), 600);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(done); else done();
  }
  if (document.readyState === "complete") ready();
  else window.addEventListener("load", ready);
})();
