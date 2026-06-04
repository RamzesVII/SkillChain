/* SkillChain Discover — Variant 2: "Index / Ledger"
   Dense data view. Cyan accent. Hover a row → live preview rail (parallax). */

(function () {
  const ACCENT = "oklch(0.72 0.13 195)";
  const css = `
  .v2{position:absolute;inset:0;background:oklch(0.105 0.010 75);color:oklch(0.92 0.008 80);
    font-family:var(--geist),system-ui,sans-serif;display:flex;flex-direction:column;
    padding:0 40px;overflow:hidden;}
  .v2 *{box-sizing:border-box;}
  .v2-mast{display:flex;align-items:baseline;justify-content:space-between;padding:18px 0 14px;
    border-bottom:1px solid oklch(0.30 0.010 75);}
  .v2-wm{font-family:var(--fraunces),serif;font-weight:600;font-size:21px;letter-spacing:-0.3px;}
  .v2-nav{display:flex;gap:20px;font-family:var(--geistmono),monospace;font-size:10px;letter-spacing:2px;
    color:oklch(0.50 0.006 80);text-transform:uppercase;}
  .v2-nav .on{color:${ACCENT};}
  .v2-head{display:flex;align-items:flex-end;justify-content:space-between;padding:22px 0 14px;}
  .v2-kick{font-family:var(--geistmono),monospace;font-size:10px;letter-spacing:4px;color:${ACCENT};
    text-transform:uppercase;margin-bottom:8px;}
  .v2-h1{font-family:var(--fraunces),serif;font-style:italic;font-weight:500;font-size:46px;
    line-height:0.95;letter-spacing:-0.6px;}
  .v2-filters{display:flex;gap:8px;}
  .v2-chip{font-family:var(--geistmono),monospace;font-size:10px;font-weight:700;letter-spacing:1.5px;
    text-transform:uppercase;padding:6px 11px;border:1px solid oklch(0.28 0.008 75);
    color:oklch(0.50 0.006 80);cursor:pointer;transition:all .15s;}
  .v2-chip:hover{color:oklch(0.8 0.008 80);border-color:oklch(0.42 0.01 75);}
  .v2-chip.on{color:oklch(0.105 0.01 75);background:${ACCENT};border-color:${ACCENT};}
  .v2-body{flex:1;display:grid;grid-template-columns:1fr 360px;gap:36px;min-height:0;padding-top:8px;}
  .v2-table{display:flex;flex-direction:column;min-height:0;}
  .v2-cols{display:grid;grid-template-columns:34px 1fr 120px 92px 70px;gap:14px;align-items:center;
    padding:0 12px 9px;border-bottom:1px solid oklch(0.30 0.010 75);
    font-family:var(--geistmono),monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;
    color:oklch(0.42 0.006 80);}
  .v2-rows{overflow:hidden;display:flex;flex-direction:column;}
  .v2-row{position:relative;display:grid;grid-template-columns:34px 1fr 120px 92px 70px;gap:14px;
    align-items:center;padding:13px 12px;border-bottom:1px solid oklch(0.18 0.008 75);cursor:pointer;
    transition:background .18s;}
  .v2-row::before{content:"";position:absolute;left:0;top:0;bottom:0;width:2px;background:${ACCENT};
    transform:scaleY(0);transform-origin:center;transition:transform .2s;}
  .v2-row:hover,.v2-row.on{background:oklch(0.155 0.012 75);}
  .v2-row:hover::before,.v2-row.on::before{transform:scaleY(1);}
  .v2-rnum{font-family:var(--geistmono),monospace;font-size:11px;color:oklch(0.40 0.006 80);
    font-variant-numeric:tabular-nums;}
  .v2-row.on .v2-rnum,.v2-row:hover .v2-rnum{color:${ACCENT};}
  .v2-rtitle{font-family:var(--fraunces),serif;font-weight:600;font-size:15.5px;letter-spacing:-0.2px;
    color:oklch(0.86 0.008 80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .v2-row.on .v2-rtitle,.v2-row:hover .v2-rtitle{color:#fff;}
  .v2-rcred{font-family:var(--geistmono),monospace;font-size:10px;color:oklch(0.52 0.006 80);
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .v2-rlic{font-family:var(--geistmono),monospace;font-size:9px;font-weight:700;letter-spacing:1px;}
  .v2-rprice{font-family:var(--geistmono),monospace;font-size:13px;font-weight:600;text-align:right;
    font-variant-numeric:tabular-nums;color:oklch(0.85 0.008 80);}
  /* preview rail */
  .v2-rail{border:1px solid oklch(0.26 0.008 75);background:oklch(0.14 0.011 75);
    padding:26px 26px 24px;display:flex;flex-direction:column;position:relative;overflow:hidden;}
  .v2-rail::after{content:"";position:absolute;top:-40%;right:-30%;width:80%;height:80%;
    background:radial-gradient(circle, oklch(0.4 0.08 195 / 0.22), transparent 70%);pointer-events:none;}
  .v2-rtop{display:flex;align-items:center;justify-content:space-between;}
  .v2-rbadge{font-family:var(--geistmono),monospace;font-size:9px;font-weight:700;letter-spacing:2px;
    text-transform:uppercase;color:${ACCENT};}
  .v2-rtype{font-family:var(--geistmono),monospace;font-size:10px;letter-spacing:2px;
    color:oklch(0.5 0.006 80);}
  .v2-rbig{font-family:var(--fraunces),serif;font-weight:600;font-size:27px;line-height:1.08;
    letter-spacing:-0.4px;margin:20px 0 0;transition:opacity .25s;}
  .v2-rprev{font-size:13.5px;line-height:1.62;color:oklch(0.64 0.007 80);margin:16px 0 0;
    transition:opacity .25s;}
  .v2-spacer{flex:1;}
  .v2-rmeta{display:grid;grid-template-columns:1fr 1fr;gap:14px 10px;padding:18px 0;
    border-top:1px solid oklch(0.24 0.008 75);border-bottom:1px solid oklch(0.24 0.008 75);}
  .v2-rmeta div span{font-family:var(--geistmono),monospace;font-size:8.5px;letter-spacing:2px;
    text-transform:uppercase;color:oklch(0.44 0.006 80);display:block;margin-bottom:4px;}
  .v2-rmeta div b{font-family:var(--geistmono),monospace;font-size:13px;font-weight:600;
    color:oklch(0.88 0.008 80);font-variant-numeric:tabular-nums;}
  .v2-cta{display:flex;align-items:center;gap:12px;margin-top:18px;}
  .v2-buy{flex:1;background:${ACCENT};color:oklch(0.105 0.01 75);border:none;padding:13px;
    font-family:var(--geistmono),monospace;font-size:10px;font-weight:700;letter-spacing:2px;
    text-transform:uppercase;cursor:pointer;transition:background .15s;}
  .v2-buy:hover{background:oklch(0.78 0.13 195);}
  .v2-pricebig{font-family:var(--geistmono),monospace;font-size:20px;font-weight:600;
    font-variant-numeric:tabular-nums;}
  .v2-pricebig span{font-size:10px;color:oklch(0.5 0.006 80);}
  `;
  const licColor = { commercial: ACCENT, remix: "oklch(0.74 0.15 55)", read: "oklch(0.67 0.13 240)" };

  function V2({ blocks }) {
    React.useEffect(() => {
      if (document.getElementById("v2-css")) return;
      const s = document.createElement("style"); s.id = "v2-css"; s.textContent = css;
      document.head.appendChild(s);
    }, []);
    const rows = blocks.slice(0, 9);
    const [active, setActive] = React.useState(rows[0]);
    const L = (b) => window.SC_LICENSE[b.type];
    const cats = ["All","DeFi","Trading","Dev","Research","Growth"];
    return (
      <div className="v2">
        <div className="v2-mast">
          <div className="v2-wm">SkillChain</div>
          <div className="v2-nav"><span className="on">Discover</span><span>Publish</span><span>Library</span><span>0x7a…F09c</span></div>
        </div>
        <div className="v2-head">
          <div>
            <div className="v2-kick">Ledger View · 247 Assets Indexed</div>
            <div className="v2-h1">The Index</div>
          </div>
          <div className="v2-filters">
            {cats.map((c,i)=>(<div key={c} className={"v2-chip"+(i===0?" on":"")}>{c}</div>))}
          </div>
        </div>
        <div className="v2-body">
          <div className="v2-table">
            <div className="v2-cols">
              <span>№</span><span>Title</span><span>Creator</span><span>License</span><span style={{textAlign:"right"}}>Price</span>
            </div>
            <div className="v2-rows">
              {rows.map((b,i)=>(
                <div key={b.id} className={"v2-row"+(active.id===b.id?" on":"")}
                  onMouseEnter={()=>setActive(b)}>
                  <div className="v2-rnum">{String(i+1).padStart(3,"0")}</div>
                  <div className="v2-rtitle">{b.title}</div>
                  <div className="v2-rcred">@{b.creator}{b.verified?" ◆":""}</div>
                  <div className="v2-rlic" style={{color:licColor[L(b).kind]}}>{window.SC_TYPE[b.type]}</div>
                  <div className="v2-rprice">{b.price}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="v2-rail">
            <div className="v2-rtop">
              <span className="v2-rbadge">● Live Preview</span>
              <span className="v2-rtype">{active.ip} · {window.SC_TYPE[active.type]}</span>
            </div>
            <div className="v2-rbig" key={"t"+active.id}>{active.title}</div>
            <div className="v2-rprev" key={"p"+active.id}>{active.preview}</div>
            <div className="v2-spacer"></div>
            <div className="v2-rmeta">
              <div><span>Creator</span><b>@{active.creator}</b></div>
              <div><span>Category</span><b>{active.category}</b></div>
              <div><span>License</span><b style={{color:licColor[L(active).kind],fontSize:11}}>{L(active).label}</b></div>
              <div><span>Reads</span><b>{active.reads.toLocaleString()}</b></div>
            </div>
            <div className="v2-cta">
              <span className="v2-pricebig">{active.price}<span> IP</span></span>
              <button className="v2-buy">Add to Bundle</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  window.V2Index = V2;
})();
