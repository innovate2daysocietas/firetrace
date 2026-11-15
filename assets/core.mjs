export const PLACES=[
{name:'Lira',lat:2.2499,lon:32.9000,region:'north'},
{name:'Gulu',lat:2.7746,lon:32.2990,region:'north'},
{name:'Kitgum',lat:3.2783,lon:32.8867,region:'north'},
{name:'Pader',lat:2.8796,lon:33.0900,region:'north'},
{name:'Apac',lat:1.9754,lon:32.5386,region:'north'},
{name:'Dokolo',lat:1.9167,lon:33.1667,region:'north'},
{name:'Moroto',lat:2.5345,lon:34.6666,region:'north'},
{name:'Kotido',lat:2.9806,lon:34.1331,region:'north'},
{name:'Arua',lat:3.0201,lon:30.9111,region:'north'},
{name:'Soroti',lat:1.7146,lon:33.6111,region:'east'},
{name:'Mbale',lat:1.0644,lon:34.1791,region:'east'},
{name:'Jinja',lat:0.4244,lon:33.2042,region:'east'},
{name:'Kampala',lat:0.3476,lon:32.5825,region:'central'},
{name:'Masaka',lat:-0.3338,lon:31.7341,region:'central'},
{name:'Mbarara',lat:-0.6072,lon:30.6545,region:'west'},
{name:'Fort Portal',lat:0.6617,lon:30.2748,region:'west'},
{name:'Kasese',lat:0.1833,lon:30.0833,region:'west'},
{name:'Kabale',lat:-1.2496,lon:29.9899,region:'west'}];
export const REGION_NAMES={uganda:'Uganda · nationwide',north:'Northern Uganda',central:'Central Uganda',east:'Eastern Uganda',west:'Western Uganda'};
export function parseCSV(str){
  const rows=[];let row=[],field='',q=false;
  for(let i=0;i<str.length;i++){let c=str[i];if(c==='"'){if(q&&str[i+1]==='"'){field+='"';i++}else q=!q;}else if(c===','&&!q){row.push(field);field='';}else if((c==='\n'||c==='\r')&&!q){if(c==='\r'&&str[i+1]==='\n')i++;row.push(field);field='';if(row.some(x=>x.trim()))rows.push(row);row=[];}else field+=c;}
  row.push(field);if(row.some(x=>x.trim()))rows.push(row);
  if(rows.length<1)return[];
  const head=rows.shift().map(x=>x.trim().replace(/^\uFEFF/,''));
  if(!head.includes('latitude')||!head.includes('longitude'))throw Error('CSV must include latitude and longitude columns.');
  return rows.map((r,i)=>Object.fromEntries(head.map((k,j)=>[k,(r[j]||'').trim()]))).map((r,i)=>({
    id:i,lat:Number(r.latitude),lon:Number(r.longitude),date:r.acq_date||r.date||'',time:(r.acq_time||'').padStart(4,'0'),satellite:r.satellite||'Not specified',instrument:r.instrument||'Not specified',confidence:r.confidence||'Not provided',frp:r.frp===''||r.frp===undefined?null:Number(r.frp),daynight:r.daynight||'',brightness:r.bright_ti4||r.brightness||'',source:r,raw:r
  })).filter(r=>Number.isFinite(r.lat)&&Number.isFinite(r.lon)&&r.lat>=-90&&r.lat<=90&&r.lon>=-180&&r.lon<=180);
}
export function kmBetween(a,b){const rad=Math.PI/180,dlat=(b.lat-a.lat)*rad,dlon=(b.lon-a.lon)*rad,x=Math.sin(dlat/2)**2+Math.cos(a.lat*rad)*Math.cos(b.lat*rad)*Math.sin(dlon/2)**2;return 6371*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));}
export function nearestPlace(point){let best=null;for(const place of PLACES){const km=kmBetween(point,{lat:place.lat,lon:place.lon});if(!best||km<best.km)best={...place,km};}return best;}
export function closestLabel(point){const p=nearestPlace(point);return p.km<=85?`~${Math.round(p.km)} km from ${p.name}`:'Outside reference-town proximity';}
export function aggregate(items){let frpTotal=0,frpCount=0,dates=new Set(),instruments=new Set(),places=new Map();for(const p of items){if(p.date)dates.add(p.date);instruments.add(p.instrument);if(Number.isFinite(p.frp)){frpTotal+=p.frp;frpCount++;}const near=nearestPlace(p);if(near.km<=85)places.set(near.name,(places.get(near.name)||0)+1);}return{count:items.length,frpTotal,frpCount,dates:dates.size,instruments:[...instruments],places:[...places].map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count)};}
export function dailyCounts(items){const map=new Map();items.forEach(p=>{if(p.date)map.set(p.date,(map.get(p.date)||0)+1)});return [...map].sort((a,b)=>a[0].localeCompare(b[0])).map(([date,count])=>({date,count}));}
export function asCSV(items){const cols=['latitude','longitude','acq_date','acq_time','satellite','instrument','confidence','frp','daynight'];const esc=s=>'"'+String(s??'').replaceAll('"','""')+'"';return [cols.join(','),...items.map(p=>[p.lat,p.lon,p.date,p.time,p.satellite,p.instrument,p.confidence,p.frp??'',p.daynight].map(esc).join(','))].join('\n');}
export function regionContains(p,region){let {lat,lon}=p;if(region==='north')return lat>=1.7&&lat<=4.35&&lon>=30.2&&lon<=34.8;if(region==='central')return lat>=-.6&&lat<=1.6&&lon>=30.2&&lon<=33.7;if(region==='east')return lat>=-.5&&lat<=2.2&&lon>=33.0&&lon<=35.1;if(region==='west')return lat>=-1.55&&lat<=1.9&&lon>=29.45&&lon<=31.7;return lat>=-1.55&&lat<=4.35&&lon>=29.45&&lon<=35.1;}
