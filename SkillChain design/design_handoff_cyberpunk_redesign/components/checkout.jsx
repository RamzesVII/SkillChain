/* SkillChain — Checkout (bundle mint flow) */

function SCCheckout({ items, onRemove, onBrowse, onComplete }) {
  const [minting, setMinting] = React.useState(false);
  const [step, setStep] = React.useState(0); // 0 idle; 1..n minting; n+1 saving

  const total = items.reduce((s, b) => s + parseFloat(b.price), 0);
  const fee = total * 0.025;
  const grand = total + fee;

  const mint = () => {
    setMinting(true);
    let i = 0;
    const tick = () => {
      i += 1;
      setStep(i);
      if (i <= items.length) {
        setTimeout(tick, 850);
      } else {
        setTimeout(() => onComplete(items), 700);
      }
    };
    tick();
  };

  if (!items.length) {
    return (
      <div className="screen">
        <div className="screen-head">
          <div className="screen-kick">Checkout</div>
          <div className="screen-h1">Current Bundle</div>
        </div>
        <div className="estate">
          <h2>Bundle is empty.</h2>
          <p>Add blocks to get started</p>
          <button className="cta" onClick={onBrowse}>Browse blocks</button>
        </div>
      </div>
    );
  }

  const progressPct = Math.min(100, (step / (items.length + 1)) * 100);
  const stepLabel = step <= items.length
    ? `Minting license ${step} of ${items.length}`
    : "Saving to your library…";

  return (
    <div className="screen">
      <div className="screen-head">
        <div className="screen-kick">Checkout · {items.length} block{items.length === 1 ? "" : "s"}</div>
        <div className="screen-h1">Current Bundle</div>
      </div>
      <div className="co-grid">
        <div className="co-list">
          {items.map((b, i) => {
            const L = window.SC_LICENSE[b.type];
            return (
              <div className="co-item" key={b.id}>
                <span className="co-num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <div className="co-t">{b.title}</div>
                  <div className="co-m">{b.ip} · @{b.creator} · {L.label}</div>
                </div>
                <div className="co-right">
                  <span className="co-p">{b.price} IP</span>
                  {!minting && <button className="co-x" onClick={() => onRemove(b.id)}>✕</button>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="co-summary glass">
          <div className="co-total-label">Total</div>
          <div className="co-total">{grand.toFixed(3)}<span> IP</span></div>
          <div className="co-line"><span>Subtotal</span><span className="v">{total.toFixed(2)} IP</span></div>
          <div className="co-line"><span>Protocol fee · 2.5%</span><span className="v">{fee.toFixed(3)} IP</span></div>
          <div className="co-line"><span>Creator royalties</span><span className="v">Included</span></div>

          {minting ? (
            <div className="co-progress">
              <div className="co-step"><span className="spin"></span>{stepLabel}</div>
              <div className="co-bar"><i style={{ width: progressPct + "%" }}></i></div>
            </div>
          ) : (
            <>
              <button className="co-mint" onClick={mint}>Mint Bundle License</button>
              <div className="co-note">Settles on Story · one license, many creators</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SCCheckout });
