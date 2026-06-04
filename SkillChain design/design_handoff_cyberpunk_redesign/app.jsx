/* SkillChain — prototype app (multi-screen router) */

const SC_ACCENTS = {
  gradient: { "--a1": "oklch(0.68 0.20 30)",  "--a2": "oklch(0.62 0.21 320)", "--asolid": "oklch(0.72 0.18 350)", "--aglowH": "340" },
  amber:    { "--a1": "oklch(0.70 0.19 45)",  "--a2": "oklch(0.82 0.16 80)",  "--asolid": "oklch(0.78 0.15 62)",  "--aglowH": "55"  },
  cyan:     { "--a1": "oklch(0.72 0.13 195)", "--a2": "oklch(0.66 0.14 222)", "--asolid": "oklch(0.74 0.13 198)", "--aglowH": "200" },
};

const SC_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "gradient",
  "glow": 0.55,
  "layout": "bento",
  "density": "regular",
  "animations": true
}/*EDITMODE-END*/;

const SC_CATS = ["All", "DeFi", "Trading", "Dev", "Research", "Growth", "Predictions"];

// content-aware bento sizing: visual blocks (video/image) become tall tiles with a
// locked media preview; the most-read text blocks become wide tiles with a teaser.
// Size = curatorial signal tied to the kind of material.
function scBentoVariants(rest) {
  const v = {};
  let tall = 0;
  for (const b of rest) {
    if ((b.type === "video" || b.type === "image") && tall < 3) { v[b.id] = "tall"; tall++; }
  }
  rest.filter((b) => !v[b.id]).sort((a, b) => b.reads - a.reads).slice(0, 2)
      .forEach((b) => { v[b.id] = "wide"; });
  return v;
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.3-4.3"></path>
    </svg>
  );
}

function App() {
  const [t, setTweak] = useTweaks(SC_TWEAK_DEFAULTS);

  const [route, setRoute] = React.useState("home");
  const [cat, setCat] = React.useState("All");
  const [q, setQ] = React.useState("");
  const [bundle, setBundle] = React.useState([]);
  const [bundleOpen, setBundleOpen] = React.useState(false);
  const [detail, setDetail] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  const [extra, setExtra] = React.useState([]); // published blocks
  const [owned, setOwned] = React.useState(() => [window.SC_BLOCKS[3], window.SC_BLOCKS[11]]); // pre-licensed

  const allBlocks = [...extra, ...window.SC_BLOCKS];
  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2800); };

  const inBundle = (id) => bundle.some((b) => b.id === id);
  const addToBundle = (b) => setBundle((p) => p.some((x) => x.id === b.id) ? p.filter((x) => x.id !== b.id) : [...p, b]);
  const removeFromBundle = (id) => setBundle((p) => p.filter((b) => b.id !== id));

  const go = (r) => { setRoute(r); setBundleOpen(false); setDetail(null); window.scrollTo(0, 0); };

  const goCheckout = () => { setBundleOpen(false); setDetail(null); setRoute("checkout"); window.scrollTo(0, 0); };

  const completeMint = (items) => {
    setOwned((prev) => {
      const ids = new Set(prev.map((b) => b.id));
      return [...items.filter((b) => !ids.has(b.id)), ...prev];
    });
    setBundle([]);
    setRoute("library");
    window.scrollTo(0, 0);
    flash(`Unlocked ${items.length} block${items.length === 1 ? "" : "s"} · added to library`);
  };

  const publish = (f) => {
    const nb = {
      id: "new-" + Date.now(),
      title: f.title, creator: f.creator || "you", verified: false,
      category: f.category, type: f.type, price: (f.price || "0.40"),
      ip: "IP-" + Math.random().toString(16).slice(2, 6).toUpperCase(),
      reads: 0, preview: f.preview || "A freshly published knowledge block.",
    };
    setExtra((p) => [nb, ...p]);
    go("discover");
    flash("Published ◆ now live in Discover");
  };

  // discover filtering
  const ql = q.trim().toLowerCase();
  const filtered = allBlocks.filter((b) => {
    if (cat !== "All" && b.category !== cat) return false;
    if (ql && !(b.title + b.creator + b.preview + b.category).toLowerCase().includes(ql)) return false;
    return true;
  });
  const featured = filtered.length ? filtered.reduce((m, b) => b.reads > m.reads ? b : m, filtered[0]) : null;
  const rest = featured ? filtered.filter((b) => b.id !== featured.id) : [];
  const variants = t.layout === "bento" ? scBentoVariants(rest) : {};

  const accentVars = SC_ACCENTS[t.accent] || SC_ACCENTS.gradient;
  const appStyle = { ...accentVars, "--aglow": String(t.glow) };
  const appClass = "app" + (t.animations ? "" : " noanim");
  const ticker = allBlocks.slice(0, 8);

  return (
    <div className={appClass} style={appStyle} data-density={t.density} data-layout={t.layout}>
      {/* top bar */}
      <div className="topbar">
        <div className="wm" onClick={() => go("home")} style={{ cursor: "pointer" }}>
          <img className="wm-logo" src={(window.__resources && window.__resources.logo) || "assets/skillchain-logo-cut.png"} alt="SkillChain" />
        </div>
        <nav className="nav">
          <button className={route === "discover" ? "on" : ""} onClick={() => go("discover")}>Discover</button>
          <button className={route === "publish" ? "on" : ""} onClick={() => go("publish")}>Publish</button>
          <button className={route === "library" ? "on" : ""} onClick={() => go("library")}>Library</button>
        </nav>
        <div className="topbar-right">
          {route === "discover" && (
            <div className="search">
              <SearchIcon />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search blocks, creators…" />
            </div>
          )}
          <div className="wallet">0x7a…F09c</div>
          <button className="bundle-btn" onClick={() => setBundleOpen(true)}>
            Bundle <span className="cnt">{bundle.length}</span>
          </button>
        </div>
      </div>

      {/* ticker (hidden on landing) */}
      {route !== "home" && (
      <div className="ticker">
        <div className="ticker-track">
          {[...ticker, ...ticker].map((b, i) => (
            <span key={i}>{b.ip} <b>{b.title.slice(0, 36)}</b> · {b.price} IP</span>
          ))}
        </div>
      </div>
      )}

      {/* routes */}
      {route === "home" && (
        <SCHero onEnter={() => go("discover")} onPublish={() => go("publish")} animate={t.animations} />
      )}
      {/* routes */}
      {route === "discover" && (
        <div className="shell">
          <div className="pagehead">
            <div>
              <div className="kick">Curated IP Assets · Story Protocol</div>
              <div className="h1">Knowledge Blocks</div>
            </div>
            <div className="stats">
              <div className="stat"><b>{247 + extra.length}</b><span>Assets</span></div>
              <div className="stat"><b>89</b><span>Creators</span></div>
              <div className="stat"><b>1.4K</b><span>Licenses</span></div>
            </div>
          </div>
          <div className="filterbar">
            {SC_CATS.map((c) => (
              <button key={c} className={"chip" + (cat === c ? " on" : "")} onClick={() => setCat(c)}>{c}</button>
            ))}
            <div className="filter-spacer"></div>
            <div className="sortcount">{filtered.length} result{filtered.length === 1 ? "" : "s"}</div>
          </div>
          <div className="grid" key={cat + ql + extra.length}>
            {!filtered.length && <div className="empty">No blocks match “{q}”.</div>}
            {featured && (
              <SCFeatured block={featured} added={inBundle(featured.id)}
                onAdd={addToBundle} onOpen={() => setDetail(featured)} />
            )}
            {rest.map((b, i) => (
              <SCFlipCard key={b.id} block={b} index={i + 1} added={inBundle(b.id)}
                variant={variants[b.id] || "normal"}
                delay={t.animations ? 0.05 + i * 0.05 : 0}
                onAdd={addToBundle} onOpen={() => setDetail(b)} />
            ))}
          </div>
        </div>
      )}

      {route === "publish" && <SCPublish onPublish={publish} />}
      {route === "library" && <SCLibrary owned={owned} onBrowse={() => go("discover")} />}
      {route === "checkout" && (
        <SCCheckout items={bundle} onRemove={removeFromBundle}
          onBrowse={() => go("discover")} onComplete={completeMint} />
      )}

      {/* overlays */}
      {bundleOpen && (
        <SCBundle items={bundle} onClose={() => setBundleOpen(false)}
          onRemove={removeFromBundle} onUnlock={goCheckout} />
      )}
      {detail && (
        <SCDetail block={detail} added={inBundle(detail.id)}
          onClose={() => setDetail(null)} onAdd={addToBundle} />
      )}
      {toast && <div className="sc-toast">{toast}</div>}

      {/* tweaks */}
      <TweaksPanel>
        <TweakSection label="Accent" />
        <TweakRadio label="Color" value={t.accent} options={["gradient", "amber", "cyan"]}
          onChange={(v) => setTweak("accent", v)} />
        <TweakSlider label="Glow / depth" value={t.glow} min={0} max={1} step={0.05}
          onChange={(v) => setTweak("glow", v)} />
        <TweakSection label="Layout" />
        <TweakRadio label="Grid" value={t.layout} options={["uniform", "bento"]}
          onChange={(v) => setTweak("layout", v)} />
        <TweakRadio label="Density" value={t.density} options={["compact", "regular", "comfy"]}
          onChange={(v) => setTweak("density", v)} />
        <TweakToggle label="Animations" value={t.animations}
          onChange={(v) => setTweak("animations", v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
