/* SkillChain Discover — Variant 4: "Gallery / Flip"
   Expressive. Red→purple gradient accent, flip cards, marquee ticker. */

(function () {
  const G1 = "oklch(0.68 0.20 30)";
  const G2 = "oklch(0.62 0.20 320)";
  const GRAD = `linear-gradient(115deg, ${G1}, ${G2})`;
  const css = `
  .v4{position:absolute;inset:0;background:oklch(0.10 0.012 320);color:oklch(0.93 0.008 320);
    font-family:var(--geist),system-ui,sans-serif;display:flex;flex-direction:column;overflow:hidden;}
  .v4 *{box-sizing:border-box;}
  /* marquee */
  .v4-ticker{border-bottom:1px solid oklch(0.24 0.012 320);overflow:hidden;white-space:nowrap;
    padding:8px 0;background:oklch(0.08 0.012 320);}
  .v4-track{display:inline-block;animation:v4scroll 28s linear infinite;}
  .v4-track span{font-family:var(--geistmono),monospace;font-size:10px;letter-spacing:2px;
    text-transform:uppercase;color:oklch(0.5 0.01 320);margin:0 26px;}
  .v4-track span b{color:transparent;background:${GRAD};-webkit-background-clip:text;background-clip:text;font-weight:700;}
  @keyframes v4scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  .v4-mast{display:flex;align-items:center;justify-content:space-between;padding:18px 44px 0;}
  .v4-wm{font-family:var(--fraunces),serif;font-weight:600;font-size:22px;letter-spacing:-0.3px;}
  .v4-nav{display:flex;gap:22px;font-family:var(--geistmono),monospace;font-size:10px;letter-spacing:2px;
    color:oklch(0.52 0.01 320);text-transform:uppercase;align-items:center;}
  .v4-nav .on{color:transparent;background:${GRAD};-webkit-background-clip:text;background-clip:text;font-weight:700;}
  .v4-head{display:flex;align-items:flex-end;justify-content:space-between;padding:16px 44px 18px;}
  .v4-kick{font-family:var(--geistmono),monospace;font-size:10px;letter-spacing:4px;text-transform:uppercase;
    color:transparent;background:${GRAD};-webkit-background-clip:text;background-clip:text;
    font-weight:700;margin-bottom:9px;}
  .v4-h1{font-family:var(--fraunces),serif;font-style:italic;font-weight:500;font-size:48px;
    line-height:0.94;letter-spacing:-0.8px;white-space:nowrap;}
  .v4-hint{font-family:var(--geistmono),monospace;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;
    color:oklch(0.45 0.01 320);padding-bottom:6px;}
  .v4-grid{flex:1;display:grid;grid-template-columns:repeat(4,1fr);gap:18px;padding:0 44px 34px;min-height:0;}
  .v4-cell{perspective:1400px;}
  .v4-flip{position:relative;width:100%;height:100%;transform-style:preserve-3d;
    transition:transform .6s cubic-bezier(.3,.8,.3,1);}
  .v4-cell:hover .v4-flip{transform:rotateY(180deg);}
  .v4-face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:7px;
    display:flex;flex-direction:column;}
  .v4-front{background:oklch(0.145 0.014 320);border:1px solid oklch(0.26 0.012 320);padding:22px;
    opacity:1;transition:opacity 0s .3s, border-color .3s;}
  .v4-cell:hover .v4-front{border-color:transparent;opacity:0;}
  .v4-back{background:${GRAD};color:oklch(0.13 0.02 320);transform:rotateY(180deg);padding:22px;
    opacity:0;transition:opacity 0s .3s;}
  .v4-cell:hover .v4-back{opacity:1;}
  .v4-ftop{display:flex;align-items:center;justify-content:space-between;}
  .v4-idx{font-family:var(--fraunces),serif;font-style:italic;font-size:30px;font-weight:500;
    color:transparent;background:${GRAD};-webkit-background-clip:text;background-clip:text;line-height:1;}
  .v4-type{font-family:var(--geistmono),monospace;font-size:9px;letter-spacing:2px;
    color:oklch(0.5 0.01 320);border:1px solid oklch(0.3 0.012 320);padding:3px 7px;border-radius:3px;}
  .v4-fh{font-family:var(--fraunces),serif;font-weight:600;font-size:19px;line-height:1.12;
    letter-spacing:-0.3px;margin-top:18px;color:oklch(0.92 0.008 320);}
  .v4-spacer{flex:1;}
  .v4-lic{font-family:var(--geistmono),monospace;font-size:9px;font-weight:700;letter-spacing:1px;
    padding:4px 8px;border-radius:3px;align-self:flex-start;color:#fff;}
  .v4-ffoot{display:flex;align-items:baseline;justify-content:space-between;margin-top:14px;
    padding-top:14px;border-top:1px solid oklch(0.24 0.012 320);}
  .v4-cred{font-size:11px;color:oklch(0.58 0.01 320);}
  .v4-price{font-family:var(--geistmono),monospace;font-size:16px;font-weight:600;font-variant-numeric:tabular-nums;
    color:oklch(0.9 0.008 320);}
  .v4-price span{font-size:9px;color:oklch(0.5 0.01 320);}
  /* back face */
  .v4-btop{font-family:var(--geistmono),monospace;font-size:9px;font-weight:700;letter-spacing:2px;
    text-transform:uppercase;opacity:0.7;}
  .v4-bprev{font-size:13px;line-height:1.55;font-weight:500;margin-top:14px;
    display:-webkit-box;-webkit-line-clamp:7;-webkit-box-orient:vertical;overflow:hidden;}
  .v4-bmeta{font-family:var(--geistmono),monospace;font-size:10px;letter-spacing:1px;margin-top:auto;
    display:flex;justify-content:space-between;padding-top:12px;border-top:1px solid rgba(20,10,20,0.25);}
  .v4-unlock{margin-top:14px;background:oklch(0.12 0.02 320);color:#fff;border:none;border-radius:4px;
    padding:12px;font-family:var(--geistmono),monospace;font-size:10px;font-weight:700;letter-spacing:2px;
    text-transform:uppercase;cursor:pointer;width:100%;}
  /* big featured cell spanning 2 cols, no flip */
  .v4-cell.wide{grid-column:span 2;grid-row:span 1;perspective:none;}
  .v4-feat{position:relative;height:100%;border-radius:7px;overflow:hidden;padding:28px;
    display:flex;flex-direction:column;background:
      radial-gradient(120% 120% at 100% 0%, oklch(0.3 0.12 350 / 0.6), transparent 55%),
      oklch(0.155 0.016 320);border:1px solid oklch(0.3 0.04 330);}
  .v4-feat::after{content:"";position:absolute;inset:0;border-radius:7px;padding:1px;
    background:${GRAD};-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
    -webkit-mask-composite:xor;mask-composite:exclude;opacity:0.6;pointer-events:none;}
  .v4-feat-badge{font-family:var(--geistmono),monospace;font-size:9px;font-weight:700;letter-spacing:2.5px;
    text-transform:uppercase;color:#fff;background:${GRAD};padding:5px 11px;border-radius:3px;align-self:flex-start;white-space:nowrap;}
  .v4-feat h2{font-family:var(--fraunces),serif;font-weight:600;font-size:34px;line-height:1.04;
    letter-spacing:-0.5px;margin-top:20px;max-width:15ch;}
  .v4-feat p{font-size:14px;line-height:1.6;color:oklch(0.66 0.01 320);margin-top:16px;max-width:42ch;}
  .v4-feat-foot{display:flex;align-items:center;gap:14px;margin-top:auto;padding-top:20px;
    border-top:1px solid oklch(0.26 0.02 330);}
  .v4-feat-foot .v4-cred b{color:oklch(0.9 0.01 320);font-weight:500;}
  .v4-addbig{margin-left:auto;background:${GRAD};color:#fff;border:none;border-radius:4px;padding:11px 18px;
    font-family:var(--geistmono),monospace;font-size:10px;font-weight:700;letter-spacing:2px;
    text-transform:uppercase;cursor:pointer;}
  `;
  const licColor = { commercial: G1, remix: "oklch(0.68 0.18 350)", read: G2 };

  function V4({ blocks }) {
    React.useEffect(() => {
      if (document.getElementById("v4-css")) return;
      const s = document.createElement("style"); s.id = "v4-css"; s.textContent = css;
      document.head.appendChild(s);
    }, []);
    const L = (b) => window.SC_LICENSE[b.type];
    const feat = blocks[1];
    const cells = [blocks[0], blocks[3], blocks[4], blocks[8], blocks[10], blocks[7]];
    const ticker = blocks.slice(0,8);
    return (
      <div className="v4">
        <div className="v4-ticker">
          <div className="v4-track">
            {[...ticker,...ticker].map((b,i)=>(<span key={i}>{b.ip} <b>{b.title.slice(0,34)}</b> · {b.price} IP</span>))}
          </div>
        </div>
        <div className="v4-mast">
          <div className="v4-wm">SkillChain</div>
          <div className="v4-nav"><span className="on">Discover</span><span>Publish</span><span>Library</span><span>0x7a…F09c</span></div>
        </div>
        <div className="v4-head">
          <div>
            <div className="v4-kick">The Gallery · 247 Assets</div>
            <div className="v4-h1">Knowledge Blocks</div>
          </div>
          <div className="v4-hint">↻ Hover a card to preview</div>
        </div>
        <div className="v4-grid">
          <div className="v4-cell wide">
            <div className="v4-feat">
              <span className="v4-feat-badge">★ Editor's Pick</span>
              <h2>{feat.title}</h2>
              <p>{feat.preview}</p>
              <div className="v4-feat-foot">
                <span className="v4-cred">By <b>@{feat.creator}</b></span>
                <span className="v4-lic" style={{background:licColor[L(feat).kind]}}>{L(feat).label}</span>
                <button className="v4-addbig">{feat.price} IP · Add +</button>
              </div>
            </div>
          </div>
          {cells.map((b,i)=>(
            <div className="v4-cell" key={b.id}>
              <div className="v4-flip">
                <div className="v4-face v4-front">
                  <div className="v4-ftop">
                    <span className="v4-idx">{String(i+1).padStart(2,"0")}</span>
                    <span className="v4-type">{window.SC_TYPE[b.type]}</span>
                  </div>
                  <div className="v4-fh">{b.title}</div>
                  <div className="v4-spacer"></div>
                  <span className="v4-lic" style={{background:licColor[L(b).kind]}}>{L(b).label}</span>
                  <div className="v4-ffoot">
                    <span className="v4-cred">@{b.creator}</span>
                    <span className="v4-price">{b.price}<span> IP</span></span>
                  </div>
                </div>
                <div className="v4-face v4-back">
                  <div className="v4-btop">{b.ip} · {b.category}</div>
                  <div className="v4-bprev">{b.preview}</div>
                  <div className="v4-bmeta"><span>@{b.creator}</span><span>{b.reads.toLocaleString()} reads</span></div>
                  <button className="v4-unlock">Add to Bundle · {b.price} IP</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  window.V4Gallery = V4;
})();
