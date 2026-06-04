/* SkillChain — Hero / landing screen */

// glitch-decode text: scrambles then resolves character by character
function SCScramble({ text, animate }) {
  const glyphs = "ABCDEF0123456789/<>$#%&*+=";
  const scramble = (reveal) => {
    let s = "";
    for (let i = 0; i < text.length; i++) {
      if (text[i] === " ") {s += " ";continue;}
      s += i < reveal ? text[i] : glyphs[Math.random() * glyphs.length | 0];
    }
    return s;
  };
  const [out, setOut] = React.useState(() => animate ? scramble(0) : text);
  React.useEffect(() => {
    if (!animate) {setOut(text);return;}
    let reveal = 0,id;
    const start = setTimeout(() => {
      id = setInterval(() => {
        reveal += 0.8;
        setOut(scramble(Math.floor(reveal)));
        if (reveal >= text.length) {clearInterval(id);setOut(text);}
      }, 28);
    }, 240);
    return () => {clearTimeout(start);clearInterval(id);};
  }, [animate, text]);
  return <span className="scramble">{out}</span>;
}

function SCHero({ onEnter, onPublish, animate = true }) {
  const logo = window.__resources && window.__resources.logo || "assets/skillchain-logo-cut.png";
  const heroRef = React.useRef(null);

  const onMove = (e) => {
    if (!animate) return;
    const el = heroRef.current;if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--sx", (x * 100).toFixed(1) + "%");
    el.style.setProperty("--sy", (y * 100).toFixed(1) + "%");
    el.style.setProperty("--gz", ((x - 0.5) * 9).toFixed(2) + "deg");
    el.style.setProperty("--lx", ((x - 0.5) * -16).toFixed(1) + "px");
    el.style.setProperty("--ly", ((y - 0.5) * -11).toFixed(1) + "px");
  };
  const onLeave = () => {
    const el = heroRef.current;if (!el) return;
    el.style.setProperty("--sx", "50%");el.style.setProperty("--sy", "35%");
    el.style.setProperty("--gz", "0deg");el.style.setProperty("--lx", "0px");el.style.setProperty("--ly", "0px");
  };

  return (
    <>
      <section className="hero" ref={heroRef} onMouseMove={onMove} onMouseLeave={onLeave}>
        <div className="hero-grid"></div>
        <div className="hero-cursor"></div>
        <div className="hero-glow"></div>

        <div className="hero-inner">
          <div className="hero-tag">COMPOSABLE KNOWLEDGE · ONCHAIN IP</div>

          <div className="hero-logo">
            <img src={logo} alt="SkillChain" />
            <div className="gl c" style={{ backgroundImage: `url(${logo})` }}></div>
            <div className="gl m" style={{ backgroundImage: `url(${logo})` }}></div>
          </div>

          <div className="hero-sub"><SCScramble text="A marketplace for knowledge that owns itself." animate={animate} /></div>
          <p className="hero-lede">
            Every block is an independent IP asset on Story Protocol. License one bundle that
            spans dozens of creators, unlock the encrypted content instantly, and remix it into
            your own — royalties route on-chain, automatically, forever.
          </p>

          <div className="hero-cta">
            <button className="hero-btn primary" onClick={onEnter}>Enter the marketplace →</button>
            <button className="hero-btn ghost" onClick={onPublish}>PUBLISH A SKILL</button>
          </div>
        </div>

        <div className="hero-strip">
          <div className="hs"><b>247</b><span>Knowledge Blocks</span></div>
          <div className="hs"><b>89</b><span>Verified Creators</span></div>
          <div className="hs"><b>1.4K</b><span>Licenses Minted</span></div>
          <div className="hs"><b>100%</b><span>On-Chain Royalties</span></div>
        </div>

        <div className="hero-scan"></div>
      </section>

      {/* what it is */}
      <div className="land">
        <div className="land-head">
          <div className="land-kick">Why SkillChain</div>
          <div className="land-h2">Knowledge as a composable asset</div>
        </div>
        <div className="feats">
          <div className="feat">
            <div className="feat-ico">◆</div>
            <div className="feat-n">01</div>
            <h3>Own it, don't rent it</h3>
            <p>Each block mints as an IP asset on Story Protocol. Buyers hold a real license token —
               not a login. Provenance and rights live on-chain, not in a PDF.</p>
          </div>
          <div className="feat">
            <div className="feat-ico">⧉</div>
            <div className="feat-n">02</div>
            <h3>Bundle many, license once</h3>
            <p>Curate blocks from different creators into a single bundle and mint one composable
               license across all of them. The hard part — the rights — is handled by the protocol.</p>
          </div>
          <div className="feat">
            <div className="feat-ico">↻</div>
            <div className="feat-n">03</div>
            <h3>Creators earn on every remix</h3>
            <p>Royalties flow automatically downstream. Remix a block into your own and the original
               author keeps earning — composable IP that compounds instead of leaks.</p>
          </div>
        </div>

        {/* how it works */}
        <div className="land-head" style={{ marginTop: 96 }}>
          <div className="land-kick">How it works</div>
          <div className="land-h2">Three steps to a license.</div>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-n">01</div>
            <h4>Discover &amp; bundle</h4>
            <p>Browse knowledge blocks across DeFi, trading, dev and research. Add the ones you want
               to your bundle.</p>
          </div>
          <div className="step">
            <div className="step-n">02</div>
            <h4>Mint the license</h4>
            <p>Checkout mints one bundle license on Story. Protocol fee is transparent; creator
               royalties are baked in.</p>
          </div>
          <div className="step">
            <div className="step-n">03</div>
            <h4>Unlock &amp; remix</h4>
            <p>Encrypted content decrypts in your library the moment the license lands. Read it, or
               compose it into something new.</p>
          </div>
        </div>

        <div className="land-final">
          <div className="land-kick">Start now</div>
          <div className="land-h2">Plug into the chain of knowledge.</div>
          <div className="hero-cta">
            <button className="hero-btn primary" onClick={onEnter}>Enter the marketplace →</button>
            <button className="hero-btn ghost" onClick={onPublish}>Publish a block</button>
          </div>
        </div>
      </div>
    </>);

}

Object.assign(window, { SCHero });