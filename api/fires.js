const SOURCES=new Set(['VIIRS_SNPP_NRT','VIIRS_NOAA20_NRT','MODIS_NRT','VIIRS_SNPP_SP']);
const BOUNDS={uganda:'29.45,-1.55,35.10,4.35',north:'30.2,1.7,34.8,4.35',central:'30.2,-0.6,33.7,1.6',east:'33.0,-0.5,35.10,2.2',west:'29.45,-1.55,31.7,1.9'};
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='GET')return res.status(405).json({error:'Only GET is supported'});
  const key=process.env.NASA_FIRMS_MAP_KEY;
  if(!key||key==='replace_with_your_key')return res.status(503).json({error:'NASA FIRMS is not configured. Add NASA_FIRMS_MAP_KEY in Vercel environment settings.'});
  const source=String(req.query.source||'VIIRS_SNPP_NRT');
  const region=String(req.query.region||'uganda');
  const days=Number(req.query.days||2);
  const date=req.query.date?String(req.query.date):'';
  if(!SOURCES.has(source)||!Object.hasOwn(BOUNDS,region)||!Number.isInteger(days)||days<1||days>5)return res.status(400).json({error:'Invalid source, region or day range.'});
  if(date && (!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(Date.parse(date))||date>new Date().toISOString().slice(0,10)||date<'2002-01-01'))return res.status(400).json({error:'Invalid start date.'});
  const url=`https://firms.modaps.eosdis.nasa.gov/api/area/csv/${encodeURIComponent(key)}/${source}/${BOUNDS[region]}/${days}${date?'/'+date:''}`;
  const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),14000);
  try{
    const upstream=await fetch(url,{signal:ctrl.signal,headers:{Accept:'text/csv'}});
    const body=await upstream.text();
    if(!upstream.ok)return res.status(502).json({error:`NASA FIRMS returned HTTP ${upstream.status}. Check MAP_KEY or try again.`,details:body.slice(0,150)});
    if(!body.includes('latitude')||!body.includes('longitude'))return res.status(502).json({error:'NASA returned an unexpected response. No observations were displayed.'});
    res.setHeader('Content-Type','text/csv; charset=utf-8');
    res.setHeader('X-Data-Source','NASA FIRMS');
    res.setHeader('X-Observation-Mode','upstream');
    res.status(200).send(body);
  }catch(e){res.status(504).json({error:e.name==='AbortError'?'NASA FIRMS timed out. Try a shorter period.':'NASA FIRMS could not be reached.',details:String(e.message||'').slice(0,140)});}finally{clearTimeout(timer)}
}
