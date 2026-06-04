/* SkillChain — Library (owned blocks + reader) */

// lightweight markdown-ish body synthesized per block
function scBodyFor(block) {
  return [
    { t: "p", c: block.preview },
    { t: "h3", c: "The core idea" },
    { t: "p", c: "Licensing this block grants on-chain rights under the " + window.SC_LICENSE[block.type].label + " terms. Everything below is decrypted client-side from CDR storage — it only renders because your wallet holds the license token." },
    { t: "h3", c: "Worked example" },
    { t: "p", c: "Start from first principles, then layer in the edge cases that matter in production. Each claim here is reproducible from the included files; nothing is hand-waved." },
    { t: "p", c: "Royalties flow automatically to @" + block.creator + " on every downstream remix — the license is composable, so you can fold this into your own bundle and re-publish." },
  ];
}

function SCLibrary({ owned, onBrowse }) {
  const [active, setActive] = React.useState(owned[0] || null);
  React.useEffect(() => { if (!active && owned[0]) setActive(owned[0]); }, [owned]);

  if (!owned.length) {
    return (
      <div className="screen">
        <div className="screen-head">
          <div className="screen-kick">Library</div>
          <div className="screen-h1">My blocks</div>
        </div>
        <div className="estate">
          <h2>No blocks yet.</h2>
          <p>Browse and bundle knowledge blocks</p>
          <button className="cta" onClick={onBrowse}>Browse blocks</button>
        </div>
      </div>
    );
  }

  const body = active ? scBodyFor(active) : [];
  return (
    <div className="screen">
      <div className="screen-head">
        <div className="screen-kick">Library · {owned.length} licensed</div>
        <div className="screen-h1">My blocks</div>
      </div>
      <div className="lib-grid">
        <div className="lib-rail">
          {owned.map((b) => (
            <button key={b.id} className={active && active.id === b.id ? "on" : ""} onClick={() => setActive(b)}>
              <div className="lt">{b.title}</div>
              <div className="lm">{b.category} · {window.SC_TYPE[b.type]}</div>
            </button>
          ))}
        </div>
        {active ? (
          <div className="reader glass">
            <div className="reader-kick"></div>
            <h2>{active.title}</h2>
            <div className="reader-meta">@{active.creator} · {active.ip} · {active.reads.toLocaleString()} reads</div>
            <div className="reader-body">
              {body.map((n, i) => n.t === "h3" ? <h3 key={i}>{n.c}</h3> : <p key={i}>{n.c}</p>)}
            </div>
          </div>
        ) : (
          <div className="reader glass reader-empty">Select a block to read</div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { SCLibrary });
