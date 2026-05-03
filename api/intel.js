
// OMNINOMICS v5.0.6 — Market Intelligence API
// Funding + Open Interest + News + Reddit/Social proxy
// Decision engine boundary: this endpoint only returns intelligence; UI decides risk overlay.
// No private keys are required for Binance/GDELT/Reddit public mode.

const BINANCE_F = ["https://fapi.binance.com","https://fapi1.binance.com","https://fapi2.binance.com","https://fapi3.binance.com"];

function json(res, status=200){ return {statusCode:status, headers:{"Content-Type":"application/json","Cache-Control":"s-maxage=60, stale-while-revalidate=120"}, body:JSON.stringify(res)}; }
function cleanSymbol(s){ return String(s||"BTCUSDT").toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,20) || "BTCUSDT"; }
function baseAsset(symbol){ return symbol.replace(/USDT$|USD$|BUSD$|USDC$/,""); }
function num(x,d=6){ x=Number(x); return Number.isFinite(x)?+x.toFixed(d):null; }
function avg(a){ a=(a||[]).map(Number).filter(Number.isFinite); return a.length?a.reduce((s,x)=>s+x,0)/a.length:0; }
function stdev(a){ a=(a||[]).map(Number).filter(Number.isFinite); let m=avg(a); return a.length?Math.sqrt(avg(a.map(x=>(x-m)**2))):0; }
function pct(a,b){ a=Number(a); b=Number(b); return Number.isFinite(a)&&Number.isFinite(b)&&b!==0?(a-b)/b*100:null; }
function clamp(v,a=0,b=100){ v=Number(v); return Math.max(a,Math.min(b,Number.isFinite(v)?v:0)); }

async function fetchTimeout(url, ms=4800, opts={}){
  const ctl = new AbortController();
  const id = setTimeout(()=>ctl.abort(), ms);
  try{
    const r = await fetch(url, {...opts, signal:ctl.signal, headers:{ "user-agent":"OMNINOMICS/5.0.6", ...(opts.headers||{}) }});
    if(!r.ok) throw new Error(`${r.status} ${url}`);
    return await r.json();
  }finally{ clearTimeout(id); }
}
async function binanceAny(path){
  const urls = BINANCE_F.map(b=>b+path);
  return await Promise.any(urls.map(u=>fetchTimeout(u, 4300)));
}
async function safe(fn, fallback=null){ try{return await fn()}catch(e){ return fallback; } }

function deriveFundingStats(hist){
  hist = Array.isArray(hist)?hist:[];
  const vals = hist.map(x=>Number(x.fundingRate)*100).filter(Number.isFinite);
  const last = vals.at(-1);
  const m = avg(vals), sd = stdev(vals);
  const z = sd ? (last-m)/sd : 0;
  const rising = vals.length>=4 ? last - vals.at(-4) : 0;
  return {lastFundingRatePct:num(last,5), avgFundingPct:num(m,5), fundingZ:num(z,2), fundingTrendPct:num(rising,5), samples:vals.length};
}
function deriveOiStats(hist, current){
  hist = Array.isArray(hist)?hist:[];
  const vals = hist.map(x=>Number(x.sumOpenInterest)).filter(Number.isFinite);
  const now = Number(current?.openInterest) || vals.at(-1) || null;
  const oi1h = vals.length>=2 ? pct(vals.at(-1), vals.at(-2)) : null;
  const oi4h = vals.length>=5 ? pct(vals.at(-1), vals.at(-5)) : null;
  const oi24h = vals.length>=20 ? pct(vals.at(-1), vals.at(-20)) : null;
  return {openInterest:num(now,2), oi1hPct:num(oi1h,2), oi4hPct:num(oi4h,2), oi24hPct:num(oi24h,2), samples:vals.length};
}
function derivativesRisk(f, oi){
  let score=50, flags=[], action="NEUTRAL", sizeScale=1;
  const fr=f.lastFundingRatePct, z=f.fundingZ, oi4=oi.oi4hPct, oi24=oi.oi24hPct;
  if(fr!=null && fr>0.05){score-=12; flags.push("Funding pozitif yüksek: long crowding riski"); sizeScale=Math.min(sizeScale,.7);}
  if(fr!=null && fr<-0.05){score-=6; flags.push("Funding negatif yüksek: short crowding / squeeze riski");}
  if(z!=null && z>2){score-=10; flags.push("Funding z-score aşırı pozitif"); sizeScale=Math.min(sizeScale,.65);}
  if(z!=null && z<-2){score-=4; flags.push("Funding z-score aşırı negatif; short kalabalığı olabilir");}
  if(oi4!=null && oi4>7){score-=8; flags.push("OI 4s hızlı artıyor: kaldıraç birikimi"); sizeScale=Math.min(sizeScale,.75);}
  if(oi24!=null && oi24>15){score-=8; flags.push("OI 24s hızlı artıyor: tasfiye riski yükseldi");}
  if(oi4!=null && oi4<-8){score-=3; flags.push("OI düşüyor: deleveraging / trend devam gücü zayıflayabilir");}
  score=clamp(score);
  if(score<38){action="SIZE_DOWN"; sizeScale=Math.min(sizeScale,.5);}
  else if(score<48){action="CAUTION"; sizeScale=Math.min(sizeScale,.75);}
  return {score, flags, action, sizeScale};
}
function classifyNews(text){
  text = String(text||"").toLowerCase();
  const hard = ["hack","exploit","drain","stolen","delist","delisting","depeg","halt","suspended","rug pull","insolvent","bankrupt"];
  const risk = ["lawsuit","sec","cftc","investigation","regulation","probe","sanction","outage","bridge","vulnerability"];
  const positive = ["etf inflow","approved","approval","partnership","upgrade","mainnet","listing","institutional","adoption"];
  let hardHits=hard.filter(k=>text.includes(k)), riskHits=risk.filter(k=>text.includes(k)), posHits=positive.filter(k=>text.includes(k));
  let score = 0;
  score -= hardHits.length*35;
  score -= riskHits.length*12;
  score += posHits.length*8;
  return {hardHits,riskHits,posHits,score};
}
async function gdeltNews(base){
  const q = encodeURIComponent(`(${base} OR ${base.toLowerCase()} crypto OR ${base}USDT) (crypto OR cryptocurrency OR bitcoin OR blockchain)`);
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${q}&mode=ArtList&format=json&maxrecords=10&sort=HybridRel`;
  const j = await fetchTimeout(url, 4500);
  const arts = (j.articles||[]).slice(0,10).map(a=>({title:a.title||"",url:a.url||"",source:a.sourceCountry||a.domain||"",published:a.seendate||"",lang:a.language||""}));
  return arts;
}
async function cryptoPanic(base, token){
  if(!token) return [];
  const url = `https://cryptopanic.com/api/v1/posts/?auth_token=${encodeURIComponent(token)}&currencies=${encodeURIComponent(base)}&kind=news&public=true`;
  const j = await fetchTimeout(url, 4500);
  return (j.results||[]).slice(0,10).map(a=>({title:a.title||"",url:a.url||"",source:a.source?.title||"CryptoPanic",published:a.published_at||"",votes:a.votes||{}}));
}
async function redditSearch(base){
  const q = encodeURIComponent(`${base} crypto OR ${base}USDT`);
  const url = `https://www.reddit.com/search.json?q=${q}&sort=new&t=day&limit=10`;
  const j = await fetchTimeout(url, 4500);
  return (j.data?.children||[]).map(x=>x.data||{}).slice(0,10).map(p=>({title:p.title||"",subreddit:p.subreddit||"",score:p.score||0,comments:p.num_comments||0,url:p.permalink?`https://reddit.com${p.permalink}`:""}));
}
function socialStats(items){
  const text = items.map(x=>x.title||"").join(" ").toLowerCase();
  const eup = ["moon","100x","pump","lambo","send it","ath","breakout","ape"];
  const panic = ["scam","crash","dump","rekt","rug","hack","exploit","dead"];
  const eupHits=eup.filter(k=>text.includes(k)).length, panicHits=panic.filter(k=>text.includes(k)).length;
  const attention = clamp((items.length*7) + items.reduce((s,x)=>s+Math.min(25,(x.score||0)/15+(x.comments||0)/5),0));
  const euphoria = clamp(eupHits*18 + attention*.25);
  const panicScore = clamp(panicHits*22 + attention*.18);
  return {attentionScore:num(attention,1), euphoriaScore:num(euphoria,1), panicScore:num(panicScore,1), mentions:items.length, eupHits, panicHits};
}
function buildOverlay(symbol, derivatives, news, social){
  let reasons=[], hardFlags=[], action="NEUTRAL", sizeScale=1, score=50;
  if(derivatives?.risk){
    score += (derivatives.risk.score-50)*.45;
    reasons.push(...(derivatives.risk.flags||[]));
    sizeScale=Math.min(sizeScale, derivatives.risk.sizeScale||1);
    if(derivatives.risk.action==="SIZE_DOWN") action="SIZE_DOWN";
  }
  const allNews = news.items || [];
  const nc = allNews.map(n=>classifyNews(`${n.title} ${n.source}`));
  const hard = nc.flatMap(x=>x.hardHits), risk = nc.flatMap(x=>x.riskHits), pos = nc.flatMap(x=>x.posHits);
  let newsScore = nc.reduce((s,x)=>s+x.score,0);
  score += newsScore*.35;
  if(hard.length){ hardFlags.push(...hard); reasons.push("Kırmızı haber: "+[...new Set(hard)].join(", ")); action="HARD_BLOCK"; sizeScale=0; }
  if(risk.length){ reasons.push("Haber risk kelimeleri: "+[...new Set(risk)].slice(0,5).join(", ")); sizeScale=Math.min(sizeScale,.75); if(action==="NEUTRAL")action="CAUTION"; }
  if(pos.length){ reasons.push("Pozitif haber/narrative: "+[...new Set(pos)].slice(0,4).join(", ")); }
  if(social?.stats){
    score += (social.stats.attentionScore-50)*.12;
    if(social.stats.euphoriaScore>65){ reasons.push("Sosyal euphoria yüksek: chase etme / retest bekle"); sizeScale=Math.min(sizeScale,.65); if(action==="NEUTRAL")action="SIZE_DOWN"; }
    if(social.stats.panicScore>65){ reasons.push("Sosyal panik yüksek: volatilite riski"); sizeScale=Math.min(sizeScale,.7); if(action==="NEUTRAL")action="CAUTION"; }
  }
  score=clamp(score);
  if(action==="NEUTRAL"&&score<40){action="SIZE_DOWN"; sizeScale=Math.min(sizeScale,.7);}
  return {symbol, score:num(score,1), action, sizeScale:num(sizeScale,2), hardBlock:action==="HARD_BLOCK", hardFlags:[...new Set(hardFlags)], reasons:reasons.slice(0,12)};
}

module.exports = async (req, res) => {
  const symbol = cleanSymbol(req.query.symbol);
  const base = baseAsset(symbol);
  const cpToken = req.headers["x-omni-cryptopanic-key"] || req.query.cryptopanic || "";
  try{
    const [fundingHist, oiNow, oiHist, gdelt, cp, reddit] = await Promise.all([
      safe(()=>binanceAny(`/fapi/v1/fundingRate?symbol=${symbol}&limit=30`), []),
      safe(()=>binanceAny(`/fapi/v1/openInterest?symbol=${symbol}`), null),
      safe(()=>binanceAny(`/futures/data/openInterestHist?symbol=${symbol}&period=1h&limit=30`), []),
      safe(()=>gdeltNews(base), []),
      safe(()=>cryptoPanic(base, cpToken), []),
      safe(()=>redditSearch(base), [])
    ]);
    const funding = deriveFundingStats(fundingHist);
    const oi = deriveOiStats(oiHist, oiNow);
    const risk = derivativesRisk(funding, oi);
    const newsItems = [...(cp||[]), ...(gdelt||[])].slice(0,16);
    const social = {reddit: reddit||[], stats:socialStats(reddit||[])};
    const derivatives = {funding, openInterest:oi, risk};
    const news = {items:newsItems, source:{gdelt:(gdelt||[]).length, cryptoPanic:(cp||[]).length}};
    const overlay = buildOverlay(symbol, derivatives, news, social);
    res.status(200).json({ok:true, version:"5.0.6", symbol, base, derivatives, news, social, overlay, updatedAt:Date.now()});
  }catch(e){
    res.status(200).json({ok:false, version:"5.0.6", symbol, base, error:String(e.message||e), derivatives:null, news:{items:[]}, social:{reddit:[],stats:{}}, overlay:{score:50,action:"ERROR",sizeScale:1,reasons:[String(e.message||e)]}});
  }
};
