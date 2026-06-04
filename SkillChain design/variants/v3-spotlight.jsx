/* SkillChain Discover — Variant 3: "Spotlight / Glass"
   Atmospheric depth. Warm amber accent, glass cards, 3D tilt + glow. */

(function () {
  const ACCENT = "oklch(0.72 0.19 45)";
  const ACCENT2 = "oklch(0.80 0.16 70)";
  const css = `
  .v3{position:absolute;inset:0;background:
      radial-gradient(120% 80% at 78% -10%, oklch(0.22 0.07 45 / 0.55), transparent 55%),
      radial-gradient(90% 70% at 10% 110%, oklch(0.18 0.05 60 / 0.5), transparent 55%),
      oklch(0.12 0.012 60);
    color:oklch(0.93 0.008 70);font-family:var(--geist),system-ui,sans-serif;
    display:flex;flex-direction:column;padding:0 44px;overflow:hidden;}
  .v3 *{box-sizing:border-box;}
  .v3::before{content:"";position:absolute;inset:0;pointer-events:none;opacity:0.5;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");}
  .v3-mast{display:flex;align-items:center;justify-content:space-between;padding:20px 0 16px;
    position:relative;z-index:2;}
  .v3-wm{font-family:var(--fraunces),serif;font-weight:600;font-size:22px;letter-spacing:-0.3px;
    display:flex;align-items:center;gap:10px;}
  .v3-wm i{width:8px;height:8px;border-radius:50%;background:${ACCENT};
    box-shadow:0 0 14px ${ACCENT},0 0 30px ${ACCENT};}
  .v3-nav{display:flex;gap:22px;font-family:var(--geistmono),monospace;font-size:10px;letter-spacing:2px;
    color:oklch(0.55 0.01 60);text-transform:uppercase;align-items:center;}
  .v3-nav .on{color:${ACCENT2};}
  .v3-connect{border:1px solid oklch(0.4 0.04 50);padding:7px 14px;color:oklch(0.8 0.01 60);}
  .v3-head{padding:8px 0 28px;position:relative;z-index:2;}
  .v3-kick{font-family:var(--geistmono),monospace;font-size:10px;letter-spacing:4px;
    text-transform:uppercase;margin-bottom:10px;
    background:linear-gradient(90deg,${ACCENT},${ACCENT2});-webkit-background-clip:text;
    background-clip:text;color:transparent;}
  .v3-h1{font-family:var(--fraunces),serif;font-style:italic;font-weight:500;font-size:46px;
    line-height:0.95;letter-spacing:-0.8px;white-space:nowrap;}
  .v3-body{flex:1;display:grid;grid-template-columns:1.4fr 1fr 1fr;grid-template-rows:1fr;
    gap:22px;min-height:0;padding-bottom:30px;position:relative;z-index:2;}
  .v3-card{position:relative;border-radius:6px;padding:26px;display:flex;flex-direction:column;
    background:linear-gradient(160deg, oklch(0.2 0.014 55 / 0.85), oklch(0.15 0.012 55 / 0.7));
    border:1px solid oklch(0.32 0.02 55 / 0.7);backdrop-filter:blur(12px);overflow:hidden;
    box-shadow:0 1px 0 oklch(0.5 0.02 60 / 0.15) inset, 0 20px 50px -20px rgba(0,0,0,0.7);
    transform-style:preserve-3d;transition:box-shadow .3s,border-color .3s;will-change:transform;}
  .v3-card:hover{border-color:oklch(0.5 0.1 50 / 0.8);
    box-shadow:0 1px 0 oklch(0.6 0.04 60 / 0.2) inset,0 30px 70px -20px rgba(0,0,0,0.8),
      0 0 50px -10px oklch(0.5 0.15 50 / 0.45);}
  .v3-glow{position:absolute;top:-30%;left:50%;width:140%;height:60%;transform:translateX(-50%);
    background:radial-gradient(ellipse, oklch(0.6 0.18 50 / 0.35), transparent 70%);
    opacity:0;transition:opacity .35s;pointer-events:none;}
  .v3-card:hover .v3-glow{opacity:1;}
  .v3-lyr{transform:translateZ(40px);transform-style:preserve-3d;}
  .v3-ctop{display:flex;align-items:center;justify-content:space-between;}
  .v3-feat{font-family:var(--geistmono),monospace;font-size:9px;font-weight:700;letter-spacing:2.5px;
    text-transform:uppercase;color:oklch(0.12 0.01 55);padding:5px 10px;border-radius:3px;white-space:nowrap;
    background:linear-gradient(90deg,${ACCENT},${ACCENT2});}
  .v3-ip{font-family:var(--geistmono),monospace;font-size:10px;letter-spacing:1.5px;
    color:oklch(0.55 0.01 60);}
  .v3-thumb{margin:20px 0;height:130px;border-radius:5px;position:relative;overflow:hidden;
    background:
      radial-gradient(circle at 30% 30%, oklch(0.45 0.15 45 / 0.5), transparent 60%),
      linear-gradient(135deg, oklch(0.26 0.05 50), oklch(0.16 0.02 55));
    border:1px solid oklch(0.3 0.03 50 / 0.6);display:flex;align-items:center;justify-content:center;}
  .v3-thumb .v3-glyph{font-family:var(--fraunces),serif;font-style:italic;font-size:54px;
    color:oklch(0.6 0.1 50 / 0.4);}
  .v3-thumb-tag{position:absolute;bottom:10px;left:12px;font-family:var(--geistmono),monospace;
    font-size:9px;letter-spacing:2px;color:oklch(0.7 0.05 60);text-transform:uppercase;white-space:nowrap;}
  .v3-h2{font-family:var(--fraunces),serif;font-weight:600;line-height:1.06;letter-spacing:-0.4px;}
  .v3-card.lead .v3-h2{font-size:32px;max-width:13ch;margin-top:6px;}
  .v3-card.sm .v3-h2{font-size:20px;}
  .v3-p{font-size:13px;line-height:1.6;color:oklch(0.66 0.01 60);margin-top:14px;}
  .v3-card.sm .v3-p{font-size:12px;-webkit-line-clamp:3;display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden;}
  .v3-spacer{flex:1;}
  .v3-foot{display:flex;align-items:center;gap:12px;padding-top:18px;margin-top:16px;
    border-top:1px solid oklch(0.3 0.02 55 / 0.6);}
  .v3-cred{font-size:11px;color:oklch(0.6 0.01 60);}
  .v3-cred b{color:oklch(0.88 0.01 60);font-weight:500;}
  .v3-lic{font-family:var(--geistmono),monospace;font-size:9px;font-weight:700;letter-spacing:1px;}
  .v3-price{margin-left:auto;font-family:var(--geistmono),monospace;font-size:17px;font-weight:600;
    font-variant-numeric:tabular-nums;}
  .v3-price span{font-size:10px;color:oklch(0.5 0.01 60);}
  .v3-add{width:38px;height:38px;border-radius:4px;border:1px solid oklch(0.4 0.03 50);
    background:oklch(0.2 0.02 55 / 0.6);color:oklch(0.75 0.05 55);font-size:18px;cursor:pointer;
    display:flex;align-items:center;justify-content:center;transition:all .15s;}
  .v3-add:hover{background:linear-gradient(135deg,${ACCENT},${ACCENT2});color:oklch(0.12 0.01 55);
    border-color:transparent;}
  .v3-col{display:flex;flex-direction:column;gap:22px;min-height:0;}
  `;
  const licColor = { commercial: "oklch(0.78 0.13 80)", remix: ACCENT, read: "oklch(0.72 0.1 40)" };

  function Tilt({ className, children, max = 7 }) {
    const ref = React.useRef(null);
    const onMove = (e) => {
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${px*max}deg) rotateX(${-py*max}deg) translateY(-3px)`;
    };
    const reset = () => { if (ref.current) ref.current.style.transform = "perspective(900px)"; };
    return <div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={reset}>{children}</div>;
  }

  function V3({ blocks }) {
    React.useEffect(() => {
      if (document.getElementById("v3-css")) return;
      const s = document.createElement("style"); s.id = "v3-css"; s.textContent = css;
      document.head.appendChild(s);
    }, []);
    const L = (b) => window.SC_LICENSE[b.type];
    const lead = blocks[7];
    const right = [blocks[2], blocks[5]];
    const mid = blocks[11];
    return (
      <div className="v3">
        <div className="v3-mast">
          <div className="v3-wm"><i></i>SkillChain</div>
          <div className="v3-nav"><span className="on">Discover</span><span>Publish</span><span>Library</span><span className="v3-connect">0x7a…F09c</span></div>
        </div>
        <div className="v3-head">
          <div className="v3-kick">Spotlight · Curated IP Assets</div>
          <div className="v3-h1">Knowledge Blocks</div>
        </div>
        <div className="v3-body">
          <Tilt className="v3-card lead">
            <div className="v3-glow"></div>
            <div className="v3-lyr" style={{display:"flex",flexDirection:"column",height:"100%"}}>
              <div className="v3-ctop">
                <span className="v3-feat">★ Featured</span>
                <span className="v3-ip">{lead.ip} · {window.SC_TYPE[lead.type]}</span>
              </div>
              <div className="v3-thumb">
                <span className="v3-glyph">{lead.category[0]}</span>
                <span className="v3-thumb-tag">{lead.category} · {lead.reads.toLocaleString()} reads</span>
              </div>
              <h2 className="v3-h2">{lead.title}</h2>
              <p className="v3-p">{lead.preview}</p>
              <div className="v3-spacer"></div>
              <div className="v3-foot">
                <span className="v3-cred">By <b>@{lead.creator}</b></span>
                <span className="v3-lic" style={{color:licColor[L(lead).kind]}}>{L(lead).label}</span>
                <span className="v3-price">{lead.price}<span> IP</span></span>
                <button className="v3-add">+</button>
              </div>
            </div>
          </Tilt>
          <Tilt className="v3-card sm" max={9}>
            <div className="v3-glow"></div>
            <div className="v3-lyr" style={{display:"flex",flexDirection:"column",height:"100%"}}>
              <div className="v3-ctop">
                <span className="v3-ip">{mid.ip}</span>
                <span className="v3-ip">{window.SC_TYPE[mid.type]}</span>
              </div>
              <h2 className="v3-h2" style={{marginTop:18}}>{mid.title}</h2>
              <p className="v3-p">{mid.preview}</p>
              <div className="v3-spacer"></div>
              <div className="v3-foot">
                <span className="v3-cred">@{mid.creator}</span>
                <span className="v3-price">{mid.price}<span> IP</span></span>
                <button className="v3-add">+</button>
              </div>
            </div>
          </Tilt>
          <div className="v3-col">
            {right.map((b)=>(
              <Tilt className="v3-card sm" max={10} key={b.id}>
                <div className="v3-glow"></div>
                <div className="v3-lyr" style={{display:"flex",flexDirection:"column",height:"100%"}}>
                  <div className="v3-ctop">
                    <span className="v3-lic" style={{color:licColor[L(b).kind]}}>{L(b).label}</span>
                    <span className="v3-ip">{window.SC_TYPE[b.type]}</span>
                  </div>
                  <h2 className="v3-h2" style={{marginTop:14,fontSize:18}}>{b.title}</h2>
                  <div className="v3-spacer"></div>
                  <div className="v3-foot" style={{marginTop:12,paddingTop:14}}>
                    <span className="v3-cred">@{b.creator}</span>
                    <span className="v3-price" style={{fontSize:15}}>{b.price}<span> IP</span></span>
                    <button className="v3-add" style={{width:32,height:32,fontSize:16}}>+</button>
                  </div>
                </div>
              </Tilt>
            ))}
          </div>
        </div>
      </div>
    );
  }
  window.V3Spotlight = V3;
})();
