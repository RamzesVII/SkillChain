/* SkillChain — card components: Tilt, locked media preview, Featured, FlipCard */

const SC_LIC_COLOR = {
  commercial: "oklch(0.72 0.15 150)",
  remix:      "oklch(0.74 0.17 55)",
  read:       "oklch(0.68 0.14 245)",
};

// deterministic faux content metadata (duration / pages / dimensions / read time)
function scMediaMeta(b) {
  const n = parseInt((b.id || "1").replace(/\D/g, "")) || 1;
  if (b.type === "video") { const m = 6 + (n * 7) % 52, s = (n * 13) % 60; return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`; }
  if (b.type === "pdf")   { return (6 + (n * 5) % 40) + " pages"; }
  if (b.type === "image") { return ["3000×2000", "4096×2160", "2400×1600"][n % 3]; }
  return (3 + (n * 4) % 18) + " min read";
}

// locked, type-aware preview strip — a teaser "from behind the glass"
function SCMedia({ block, className }) {
  const type = block.type;
  const textual = type === "markdown" || type === "text" || type === "pdf";
  return (
    <div className={"sc-media t-" + type + (className ? " " + className : "")}>
      <div className="sc-media-bg"></div>
      {textual && (
        <div className="sc-lines">
          {[88, 72, 94, 64, 80, 58].map((w, i) => <i key={i} style={{ width: w + "%" }}></i>)}
        </div>
      )}
      {type === "video" && <div className="sc-play"></div>}
      {type === "image" && <div className="sc-img-grid"></div>}
      <div className="sc-media-scan"></div>
      <div className="sc-media-lock"><span>🔒</span> CDR-Encrypted</div>
      <span className="sc-media-meta">{scMediaMeta(block)}</span>
    </div>
  );
}

function SCTilt({ children, max = 7, className, style, onClick }) {
  const ref = React.useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg) translateY(-3px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = "perspective(900px)"; };
  return (
    <div ref={ref} className={className} style={style} onMouseMove={onMove}
         onMouseLeave={reset} onClick={onClick}>
      {children}
    </div>
  );
}

function SCFeatured({ block, added, onAdd, onOpen }) {
  const L = window.SC_LICENSE[block.type];
  return (
    <div className="cell feat" style={{ animationDelay: "0s" }}>
      <SCTilt className="featured" max={6} onClick={onOpen}>
        <div className="f-lyr">
          <span className="f-badge">★ Editor's Pick</span>
          <SCMedia block={block} className="feat-m" />
          <div className="f-title">{block.title}</div>
          <div className="f-prev">{block.preview}</div>
          <div className="f-spacer"></div>
          <div className="f-foot">
            <span className="f-cred">By <b>@{block.creator}</b>{block.verified && <span className="vf">◆</span>}</span>
            <span className="lic" style={{ background: SC_LIC_COLOR[L.kind] }}>{L.label}</span>
            <button className={"f-add" + (added ? " added" : "")}
              onClick={(e) => { e.stopPropagation(); onAdd(block); }}>
              {added ? "✓ In Bundle" : `${block.price} IP · Add +`}
            </button>
          </div>
        </div>
      </SCTilt>
    </div>
  );
}

function SCFlipCard({ block, index, added, onAdd, onOpen, delay, variant = "normal" }) {
  const L = window.SC_LICENSE[block.type];
  const big = variant !== "normal";
  const showMedia = variant === "tall";
  return (
    <div className={"cell" + (big ? " " + variant : "")} style={{ animationDelay: delay + "s" }}>
      <div className="flip" onClick={onOpen}>
        {/* front */}
        <div className="face front glass">
          <div className="c-top">
            <span className="c-idx">{String(index).padStart(2, "0")}</span>
            <span className="c-type"><span className="c-lk">🔒</span>{window.SC_TYPE[block.type]}</span>
          </div>
          {showMedia && <SCMedia block={block} />}
          <div className="c-title">{block.title}</div>
          {big && <div className="c-prev">{block.preview}</div>}
          <div className="c-spacer"></div>
          <span className="lic c-lic" style={{ background: SC_LIC_COLOR[L.kind] }}>{L.label}</span>
          <div className="c-foot">
            <span className="c-cred">@{block.creator}</span>
            <span className="c-price">{block.price}<span> IP</span></span>
          </div>
        </div>
        {/* back */}
        <div className="face back">
          <div className="b-top">{block.ip} · {block.category}</div>
          <div className="b-prev">{block.preview}</div>
          <div className="b-meta"><span>@{block.creator}</span><span>{block.reads.toLocaleString()} reads</span></div>
          <button className={"b-add" + (added ? " added" : "")}
            onClick={(e) => { e.stopPropagation(); onAdd(block); }}>
            {added ? "✓ In Bundle" : `Add · ${block.price} IP`}
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SCTilt, SCMedia, SCFeatured, SCFlipCard, SC_LIC_COLOR });
