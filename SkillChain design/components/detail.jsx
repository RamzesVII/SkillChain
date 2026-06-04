/* SkillChain — Block detail screen */

function SCDetail({ block, added, onClose, onAdd }) {
  const L = window.SC_LICENSE[block.type];
  // a few synthesized "what's inside" bullets per block
  const inside = [
    "Full source notebook / files included with the license",
    "On-chain provenance — every derivative is traceable",
    block.type === "video" ? "Timestamped chapters for fast reference" : "Annotated diagrams and worked examples",
    "Composable: remix into your own bundle under Story Protocol",
  ];
  return (
    <div className="detail">
      <div className="d-bar">
        <button className="d-back" onClick={onClose}>← Back to Discover</button>
        <span className="d-back" style={{ cursor: "default" }}>{block.ip}</span>
      </div>
      <div className="d-shell">
        <div className="d-kick">{block.category} · {window.SC_TYPE[block.type]} Asset</div>
        <h1 className="d-title">{block.title}</h1>
        <div className="d-creator">
          <div className="d-ava">{block.creator[0].toUpperCase()}</div>
          <div>
            <div className="d-cname"><b>@{block.creator}</b> {block.verified && <span style={{ color: "var(--asolid)" }}>◆ Verified</span>}</div>
            <div className="d-csub">{block.reads.toLocaleString()} reads · Creator since 2024</div>
          </div>
        </div>

        <div className="d-hero">
          <span className="glyph">{block.category[0]}</span>
          <span className="lock">🔒 Preview locked · unlock to read in full</span>
        </div>

        <div className="d-grid">
          <div className="d-body">
            <p className="lead">{block.preview}</p>
            <p>This block is published as an independent IP asset. Licensing it grants on-chain
               rights defined by the <b>{L.label}</b> terms — enforced by the protocol, not a PDF.
               Bundle it with related blocks to compose a single license across multiple creators.</p>
            <div className="d-h3">What's inside</div>
            <div className="d-list">
              {inside.map((t, i) => <div className="d-li" key={i}>{t}</div>)}
            </div>
            <div className="d-h3">Provenance</div>
            <p>Minted to <b>{block.ip}</b> on Story Protocol. {block.reads.toLocaleString()} reads to date.
               Royalties flow automatically to <b>@{block.creator}</b> on every downstream license.</p>
          </div>

          <div className="d-buy">
            <div className="d-card glass">
              <div className="d-price">{block.price}<span>IP</span></div>
              <div className="d-meta">
                <div className="d-mrow"><span className="ml">License</span><span className="mv" style={{ color: window.SC_LIC_COLOR[L.kind] }}>{L.label}</span></div>
                <div className="d-mrow"><span className="ml">Type</span><span className="mv">{window.SC_TYPE[block.type]}</span></div>
                <div className="d-mrow"><span className="ml">Category</span><span className="mv">{block.category}</span></div>
                <div className="d-mrow"><span className="ml">IP ID</span><span className="mv">{block.ip}</span></div>
              </div>
              <button className={"d-add" + (added ? " added" : "")} onClick={() => onAdd(block)}>
                {added ? "✓ In Bundle" : "Add to Bundle"}
              </button>
              <div className="d-note">Settles on-chain · royalties to creator on every remix</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SCDetail });
