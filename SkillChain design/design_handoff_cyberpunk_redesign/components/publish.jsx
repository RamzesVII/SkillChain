/* SkillChain — Publish screen with live card preview */

function SCPublish({ onPublish }) {
  const CATS = ["DeFi", "Trading", "Dev", "Research", "Growth", "Predictions"];
  const TYPES = ["markdown", "pdf", "video", "image", "text"];
  const [f, setF] = React.useState({
    creator: "", title: "", preview: "", category: "DeFi", price: "0.40", type: "markdown", content: "",
  });
  const [loading, setLoading] = React.useState(false);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const L = window.SC_LICENSE[f.type];

  const submit = (e) => {
    e.preventDefault();
    if (!f.title) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onPublish(f); }, 1500);
  };

  return (
    <div className="screen">
      <div className="screen-head">
        <div className="screen-kick">Creator</div>
        <div className="screen-h1">New block</div>
      </div>
      <div className="pub-grid">
        <form className="pub-form" onSubmit={submit}>
          <div className="fld">
            <label>Your name / alias</label>
            <input value={f.creator} onChange={(e) => set("creator", e.target.value)} placeholder="name or alias" />
          </div>
          <div className="fld">
            <label>Title *</label>
            <input required value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. How Uniswap V3 liquidity works" />
          </div>
          <div className="fld">
            <label>Preview — public teaser</label>
            <textarea rows={3} value={f.preview} onChange={(e) => set("preview", e.target.value)} placeholder="2–3 sentences that make someone want to license this…" />
          </div>

          <div className="pub-divider"></div>

          <div className="fld-row">
            <div className="fld">
              <label>Category</label>
              <select value={f.category} onChange={(e) => set("category", e.target.value)}>
                {CATS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="fld narrow">
              <label>Price (IP)</label>
              <input value={f.price} onChange={(e) => set("price", e.target.value.replace(",", "."))} />
            </div>
          </div>

          <div className="fld">
            <label>Content type</label>
            <div className="seg">
              {TYPES.map((t) => (
                <button type="button" key={t} className={f.type === t ? "on" : ""} onClick={() => set("type", t)}>{t}</button>
              ))}
            </div>
          </div>

          <div className="fld">
            <label>Full content *</label>
            {(f.type === "markdown" || f.type === "text") ? (
              <textarea rows={7} value={f.content} onChange={(e) => set("content", e.target.value)} placeholder={f.type === "markdown" ? "Write in markdown…" : "Write your content…"} />
            ) : (
              <input value={f.content} onChange={(e) => set("content", e.target.value)} placeholder={`Drop a ${f.type.toUpperCase()} file or paste a URL`} />
            )}
            <div className="fld-hint">CDR-encrypted · only unlocked for licensees</div>
          </div>

          <button className="pub-submit" disabled={loading}>
            {loading ? "Publishing to Story & CDR…" : "Publish block"}
          </button>
        </form>

        {/* live preview */}
        <div className="pub-preview">
          <div className="pp-label">Live preview · how buyers see it</div>
          <div className="pp-card glass">
            <div className="pp-top">
              <span className="pp-idx">NEW</span>
              <span className="pp-type">{window.SC_TYPE[f.type]}</span>
            </div>
            <div className={"pp-title" + (f.title ? "" : " ph")}>{f.title || "Your title appears here"}</div>
            <div className={"pp-prev" + (f.preview ? "" : " ph")}>{f.preview || "Your public teaser shows up here as you type…"}</div>
            <div className="pp-spacer"></div>
            <span className="lic c-lic" style={{ background: window.SC_LIC_COLOR[L.kind] }}>{L.label}</span>
            <div className="pp-foot">
              <span className="pp-cred">@{f.creator || "you"}</span>
              <span className="pp-price">{f.price || "0.00"}<span> IP</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SCPublish });
