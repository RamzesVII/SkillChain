// Shared sample data for SkillChain Discover explorations.
// Realistic Web3 "knowledge block" IP assets.

window.SC_TYPE = { markdown: "MD", text: "TXT", pdf: "PDF", video: "VID", image: "IMG" };

// license semantics by content type → label + hue family
window.SC_LICENSE = {
  pdf:      { label: "COMMERCIAL-USE", kind: "commercial" },
  video:    { label: "COMMERCIAL-USE", kind: "commercial" },
  image:    { label: "REMIX-ONLY",     kind: "remix" },
  markdown: { label: "READ-ONLY",      kind: "read" },
  text:     { label: "READ-ONLY",      kind: "read" },
};

window.SC_BLOCKS = [
  { id: "1",  title: "How Uniswap V3 concentrated liquidity actually works", creator: "0xmaru", verified: true,  category: "DeFi",        type: "markdown", price: "0.40", ip: "IP-A1F3", reads: 1284,
    preview: "A from-scratch derivation of the V3 tick math — why your range matters, how fees accrue, and the exact moment impermanent loss eats your edge." },
  { id: "2",  title: "The MEV supply chain, fully mapped", creator: "flashbots_anon", verified: false, category: "Research",    type: "pdf",      price: "1.20", ip: "IP-7C2D", reads: 642,
    preview: "Searchers, builders, relays, proposers — every actor in the orderflow chain, who pays whom, and where the value actually leaks." },
  { id: "3",  title: "Reading orderflow: a scalper's playbook", creator: "tape_reader", verified: true,  category: "Trading",     type: "video",    price: "2.50", ip: "IP-9B11", reads: 3110,
    preview: "Ninety minutes of live tape. How to spot absorption, fade exhaustion, and size into the moves that actually pay." },
  { id: "4",  title: "Solidity gas golfing: 40 patterns", creator: "gasbandit", verified: false, category: "Dev",         type: "markdown", price: "0.75", ip: "IP-3E88", reads: 970,
    preview: "Storage packing, unchecked math, calldata tricks — 40 audited patterns that shaved real gas in production contracts." },
  { id: "5",  title: "Designing token incentives that don't collapse", creator: "mechdesign", verified: true,  category: "Growth",      type: "pdf",      price: "0.90", ip: "IP-44A0", reads: 521,
    preview: "Emissions, sinks, and reflexivity. A mechanism-design lens on why most token economies unwind — and the few that hold." },
  { id: "6",  title: "Will ETH flip BTC by 2027? A probabilistic model", creator: "oracle_sam", verified: false, category: "Predictions", type: "markdown", price: "0.30", ip: "IP-FF21", reads: 1840,
    preview: "A transparent Monte-Carlo model of the flippening, every assumption exposed, the notebook included. Spoiler: it's closer than you think." },
  { id: "7",  title: "Restaking risk: the full dependency graph", creator: "eigen_notes", verified: false, category: "Research",    type: "image",    price: "0.55", ip: "IP-2210", reads: 738,
    preview: "One enormous annotated diagram of restaking dependencies — slashing cascades, AVS coupling, and the single points of failure nobody prices in." },
  { id: "8",  title: "Building a Telegram trading bot from scratch", creator: "botsmith", verified: true,  category: "Dev",         type: "video",    price: "1.80", ip: "IP-6D4C", reads: 2204,
    preview: "End-to-end build: wallet wiring, mempool watching, slippage guards, and a kill-switch you'll actually trust with size." },
  { id: "9",  title: "Stablecoin depeg post-mortems, 2022–2025", creator: "depeg_diary", verified: false, category: "DeFi",        type: "pdf",      price: "1.10", ip: "IP-8A0F", reads: 1456,
    preview: "Every major depeg, autopsied. The on-chain footprints in the hours before each break — and the tells that repeat." },
  { id: "10", title: "Narrative trading: catching rotations early", creator: "narrative_ape", verified: false, category: "Trading",   type: "text",     price: "0.65", ip: "IP-1C77", reads: 1992,
    preview: "How attention moves between sectors, the leading on-chain signals, and a checklist for entering a narrative before the crowd." },
  { id: "11", title: "Airdrop farming infrastructure at scale", creator: "sybil_lord", verified: true,  category: "Growth",      type: "markdown", price: "0.85", ip: "IP-5E32", reads: 2670,
    preview: "Wallet hygiene, funding graphs, automation that survives sybil filters — the operational reality of farming hundreds of addresses." },
  { id: "12", title: "ZK proofs explained for traders, not cryptographers", creator: "zk_simplified", verified: true,  category: "Research", type: "video",  price: "1.40", ip: "IP-B903", reads: 1320,
    preview: "No abstract algebra. Just what a proof buys you, what it costs, and why it changes the latency game for on-chain trading." },
];
