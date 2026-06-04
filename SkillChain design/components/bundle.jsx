/* SkillChain — Bundle sidebar (slide-over) */

function SCBundle({ items, onClose, onRemove, onUnlock }) {
  const total = items.reduce((s, b) => s + parseFloat(b.price), 0);
  const fee = items.length ? total * 0.05 : 0;
  const grand = total + fee;
  return (
    <>
      <div className="scrim" onClick={onClose}></div>
      <aside className="bundle">
        <div className="bundle-head">
          <div>
            <h2>Your Bundle</h2>
            <div className="sub">{items.length} block{items.length === 1 ? "" : "s"} · composable license</div>
          </div>
          <button className="x-btn" onClick={onClose}>×</button>
        </div>

        <div className="bundle-list">
          {items.length === 0 ? (
            <div className="bundle-empty">
              <div className="big">Nothing curated yet</div>
              <p>Add knowledge blocks from the gallery to mint a single composable license.</p>
            </div>
          ) : items.map((b) => {
            const L = window.SC_LICENSE[b.type];
            return (
              <div className="bitem" key={b.id}>
                <div>
                  <div className="bt">{b.title}</div>
                  <div className="bm">@{b.creator} · {window.SC_TYPE[b.type]} · {L.label}</div>
                  <button className="brm" onClick={() => onRemove(b.id)}>Remove</button>
                </div>
                <div className="bp">{b.price}</div>
              </div>
            );
          })}
        </div>

        <div className="bundle-foot">
          <div className="totrow"><span className="tl">Subtotal</span><span className="tv">{total.toFixed(2)} IP</span></div>
          <div className="totrow"><span className="tl">Protocol fee · 5%</span><span className="tv">{fee.toFixed(2)} IP</span></div>
          <div className="totrow grand"><span className="tl">Total</span><span className="tv">{grand.toFixed(2)}<span> IP</span></span></div>
          <button className="unlock" disabled={items.length === 0} onClick={onUnlock}>
            Unlock {items.length || ""} Block{items.length === 1 ? "" : "s"}
          </button>
        </div>
      </aside>
    </>
  );
}

Object.assign(window, { SCBundle });
