/* SkillChain Discover — Variant 1: "Broadsheet"
   Editorial taken seriously. Cyan accent, masthead, asymmetric lead grid. */

(function () {
  const ACCENT = "oklch(0.70 0.13 195)";
  const css = `
  .v1{position:absolute;inset:0;background:oklch(0.115 0.010 75);color:oklch(0.92 0.008 80);
    font-family:var(--geist),system-ui,sans-serif;display:flex;flex-direction:column;
    padding:0 40px;overflow:hidden;}
  .v1 *{box-sizing:border-box;}
  .v1-mast{display:flex;align-items:center;justify-content:space-between;padding:18px 0 12px;
    border-bottom:1px solid oklch(0.30 0.010 75);}
  .v1-wm{font-family:var(--fraunces),serif;font-weight:600;font-size:22px;letter-spacing:-0.3px;}
  .v1-mast-c{font-family:var(--geistmono),monospace;font-size:10px;letter-spacing:3px;
    color:oklch(0.50 0.006 80);text-transform:uppercase;}
  .v1-mast-r{display:flex;align-items:center;gap:18px;font-family:var(--geistmono),monospace;
    font-size:10px;letter-spacing:2px;color:oklch(0.55 0.006 80);text-transform:uppercase;}
  .v1-dot{display:inline-flex;align-items:center;gap:7px;}
  .v1-dot::before{content:"";width:6px;height:6px;border-radius:50%;background:${ACCENT};
    box-shadow:0 0 8px ${ACCENT};}
  .v1-rule2{height:3px;border-top:1px solid oklch(0.34 0.010 75);border-bottom:1px solid oklch(0.34 0.010 75);
    margin-top:0;}
  .v1-titlerow{display:flex;align-items:flex-end;justify-content:space-between;padding:26px 0 18px;}
  .v1-kick{font-family:var(--geistmono),monospace;font-size:10px;letter-spacing:4px;
    color:${ACCENT};text-transform:uppercase;margin-bottom:10px;}
  .v1-h1{font-family:var(--fraunces),serif;font-style:italic;font-weight:500;font-size:54px;
    line-height:0.95;letter-spacing:-1px;white-space:nowrap;}
  .v1-stats{display:flex;gap:34px;padding-bottom:6px;}
  .v1-stat b{font-family:var(--geistmono),monospace;font-size:26px;font-weight:600;
    font-variant-numeric:tabular-nums;display:block;line-height:1;}
  .v1-stat span{font-family:var(--geistmono),monospace;font-size:9px;letter-spacing:2.5px;
    color:oklch(0.48 0.006 80);text-transform:uppercase;}
  .v1-tabs{display:flex;gap:0;border-top:1px solid oklch(0.26 0.008 75);
    border-bottom:1px solid oklch(0.26 0.008 75);}
  .v1-tab{padding:11px 16px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;
    color:oklch(0.45 0.006 80);border-bottom:2px solid transparent;margin-bottom:-1px;cursor:pointer;
    transition:color .15s;white-space:nowrap;}
  .v1-tab:hover{color:oklch(0.78 0.008 80);}
  .v1-tab.on{color:oklch(0.93 0.008 80);border-bottom-color:${ACCENT};}
  .v1-grid{flex:1;display:grid;grid-template-columns:1.55fr 1fr;gap:0;min-height:0;padding-top:22px;}
  .v1-lead{position:relative;border:1px solid oklch(0.26 0.008 75);background:oklch(0.155 0.011 75);
    padding:30px 32px;display:flex;flex-direction:column;margin-right:32px;overflow:hidden;
    transition:background .25s, border-color .25s;}
  .v1-lead::before{content:"";position:absolute;top:0;left:0;height:3px;width:0;background:${ACCENT};
    transition:width .5s cubic-bezier(.2,.7,.3,1);}
  .v1-lead:hover{background:oklch(0.18 0.012 75);border-color:oklch(0.40 0.05 195);}
  .v1-lead:hover::before{width:100%;}
  .v1-lead-top{display:flex;align-items:center;justify-content:space-between;}
  .v1-badge{font-family:var(--geistmono),monospace;font-size:9px;font-weight:700;letter-spacing:2.5px;
    text-transform:uppercase;color:oklch(0.115 0.01 75);background:${ACCENT};padding:4px 9px;white-space:nowrap;}
  .v1-ip{font-family:var(--geistmono),monospace;font-size:10px;letter-spacing:2px;color:oklch(0.50 0.006 80);}
  .v1-lead h2{font-family:var(--fraunces),serif;font-weight:600;font-size:33px;line-height:1.08;
    letter-spacing:-0.5px;margin:24px 0 0;max-width:16ch;}
  .v1-lead p{font-size:14.5px;line-height:1.6;color:oklch(0.66 0.007 80);margin:18px 0 0;max-width:46ch;}
  .v1-spacer{flex:1;}
  .v1-lead-foot{display:flex;align-items:center;gap:18px;padding-top:22px;
    border-top:1px solid oklch(0.26 0.008 75);}
  .v1-meta{font-family:var(--geistmono),monospace;font-size:10px;letter-spacing:1.5px;
    text-transform:uppercase;color:oklch(0.55 0.006 80);}
  .v1-meta b{color:oklch(0.85 0.008 80);font-weight:500;}
  .v1-lic{font-family:var(--geistmono),monospace;font-size:10px;font-weight:700;letter-spacing:1.5px;}
  .v1-price{margin-left:auto;font-family:var(--geistmono),monospace;font-size:20px;font-weight:600;
    font-variant-numeric:tabular-nums;}
  .v1-price span{font-size:11px;color:oklch(0.50 0.006 80);margin-left:3px;}
  .v1-add{width:42px;height:42px;border:1px solid oklch(0.36 0.010 75);background:transparent;
    color:oklch(0.70 0.007 80);font-size:20px;cursor:pointer;display:flex;align-items:center;
    justify-content:center;transition:all .15s;}
  .v1-add:hover{border-color:${ACCENT};color:${ACCENT};background:oklch(0.18 0.05 195);}
  .v1-rail{display:flex;flex-direction:column;}
  .v1-railhead{font-family:var(--geistmono),monospace;font-size:9px;letter-spacing:3px;
    text-transform:uppercase;color:oklch(0.45 0.006 80);padding-bottom:12px;
    border-bottom:1px solid oklch(0.30 0.010 75);}
  .v1-item{position:relative;display:grid;grid-template-columns:auto 1fr;gap:14px;
    padding:15px 0 15px 0;border-bottom:1px solid oklch(0.22 0.008 75);cursor:pointer;
    transition:padding-left .2s;}
  .v1-item::before{content:"";position:absolute;left:-1px;top:15px;bottom:15px;width:2px;
    background:${ACCENT};transform:scaleY(0);transform-origin:top;transition:transform .25s;}
  .v1-item:hover{padding-left:14px;}
  .v1-item:hover::before{transform:scaleY(1);}
  .v1-num{font-family:var(--geistmono),monospace;font-size:11px;color:oklch(0.42 0.006 80);
    font-variant-numeric:tabular-nums;padding-top:2px;}
  .v1-item:hover .v1-num{color:${ACCENT};}
  .v1-itemtop{display:flex;align-items:center;gap:10px;margin-bottom:6px;}
  .v1-tag{font-family:var(--geistmono),monospace;font-size:8.5px;font-weight:700;letter-spacing:1.5px;
    color:oklch(0.45 0.006 80);white-space:nowrap;}
  .v1-item h3{font-family:var(--fraunces),serif;font-weight:600;font-size:16.5px;line-height:1.2;
    letter-spacing:-0.2px;color:oklch(0.88 0.008 80);}
  .v1-item:hover h3{color:#fff;}
  .v1-itemfoot{display:flex;align-items:center;gap:10px;margin-top:7px;}
  .v1-cred{font-size:11px;color:oklch(0.58 0.006 80);}
  .v1-cred i{color:${ACCENT};font-style:normal;}
  .v1-ip2{margin-left:auto;font-family:var(--geistmono),monospace;font-size:11px;font-weight:600;
    font-variant-numeric:tabular-nums;color:oklch(0.82 0.008 80);}
  `;
  const licColor = { commercial: ACCENT, remix: "oklch(0.72 0.15 55)", read: "oklch(0.66 0.13 240)" };

  function V1({ blocks }) {
    React.useEffect(() => {
      if (document.getElementById("v1-css")) return;
      const s = document.createElement("style"); s.id = "v1-css"; s.textContent = css;
      document.head.appendChild(s);
    }, []);
    const cats = ["All Assets","DeFi","Trading","Dev","Research","Growth","Predictions"];
    const lead = blocks[2];
    const rail = [blocks[5], blocks[8], blocks[0], blocks[10]];
    const L = (b) => window.SC_LICENSE[b.type];
    return (
      <div className="v1">
        <div className="v1-mast">
          <div className="v1-wm">SkillChain</div>
          <div className="v1-mast-c">Vol. III · No. 27 · Curated On-Chain Knowledge</div>
          <div className="v1-mast-r"><span>Discover</span><span>Publish</span><span>Library</span><span className="v1-dot">0x7a…F09c</span></div>
        </div>
        <div className="v1-rule2"></div>
        <div className="v1-titlerow">
          <div>
            <div className="v1-kick">Curated IP Assets · Story Protocol</div>
            <div className="v1-h1">Knowledge Blocks</div>
          </div>
          <div className="v1-stats">
            <div className="v1-stat"><b>247</b><span>Assets</span></div>
            <div className="v1-stat"><b>89</b><span>Creators</span></div>
            <div className="v1-stat"><b>1.4K</b><span>Licenses</span></div>
          </div>
        </div>
        <div className="v1-tabs">
          {cats.map((c,i)=>(<div key={c} className={"v1-tab"+(i===0?" on":"")}>{c}</div>))}
        </div>
        <div className="v1-grid">
          <div className="v1-lead">
            <div className="v1-lead-top">
              <span className="v1-badge">Lead · Most Read</span>
              <span className="v1-ip">{lead.ip} · {window.SC_TYPE[lead.type]}</span>
            </div>
            <h2>{lead.title}</h2>
            <p>{lead.preview}</p>
            <div className="v1-spacer"></div>
            <div className="v1-lead-foot">
              <span className="v1-meta">By <b>@{lead.creator}</b></span>
              <span className="v1-lic" style={{color:licColor[L(lead).kind]}}>{L(lead).label}</span>
              <span className="v1-price">{lead.price}<span>IP</span></span>
              <button className="v1-add">+</button>
            </div>
          </div>
          <div className="v1-rail">
            <div className="v1-railhead">Latest Drops</div>
            {rail.map((b,i)=>(
              <div className="v1-item" key={b.id}>
                <div className="v1-num">{String(i+1).padStart(2,"0")}</div>
                <div>
                  <div className="v1-itemtop">
                    <span className="v1-tag" style={{color:licColor[L(b).kind]}}>{window.SC_TYPE[b.type]} · {L(b).label}</span>
                  </div>
                  <h3>{b.title}</h3>
                  <div className="v1-itemfoot">
                    <span className="v1-cred">By <i>@{b.creator}</i></span>
                    <span className="v1-ip2">{b.price} IP</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  window.V1Broadsheet = V1;
})();
