/* Profili igrača – svaki igrač ima svoj napredak */
(function(){
var S=Storage.prototype,G=S.getItem,SET=S.setItem,R=S.removeItem,ls=window.localStorage;
var SHARED={sa_lang:1,sa_mus:1};
function raw(k){return G.call(ls,k)}
function profs(){try{return JSON.parse(raw('sa_profs'))||[]}catch(e){return[]}}
function saveProfs(p){SET.call(ls,'sa_profs',JSON.stringify(p))}
var P=profs();
if(!P.length){ // prvi put: postojeći napredak ide prvom igraču
  P=[{id:'1',ime:'Igrač 1'}];saveProfs(P);SET.call(ls,'sa_pcur','1');
  Object.keys(ls).forEach(function(k){if(k.indexOf('sa_')===0&&!SHARED[k]&&k.indexOf('sa_p')!==0){SET.call(ls,'sa_p1_'+k.slice(3),raw(k));R.call(ls,k)}});
}
var cur=raw('sa_pcur');if(!P.some(function(p){return p.id===cur})){cur=P[0].id;SET.call(ls,'sa_pcur',cur)}
function map(k){k=String(k);if(k.indexOf('sa_')!==0||SHARED[k]||k.indexOf('sa_p')===0)return k;return 'sa_p'+cur+'_'+k.slice(3)}
S.getItem=function(k){return this===ls?G.call(this,map(k)):G.call(this,k)};
S.setItem=function(k,v){return this===ls?SET.call(this,map(k),v):SET.call(this,k,v)};
S.removeItem=function(k){return this===ls?R.call(this,map(k)):R.call(this,k)};
function ime(){var p=P.filter(function(p){return p.id===cur})[0];return p?p.ime:''}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return'&#'+c.charCodeAt(0)+';'})}
var SAP=window.SAP={
 ime:ime,
 izaberi:function(id){SET.call(ls,'sa_pcur',id);try{sessionStorage.setItem('sa_izabran','1')}catch(e){}location.reload()},
 novi:function(){var n=prompt('Kako se zove novi igrač?');if(!n)return;n=n.trim().slice(0,14);if(!n)return;var id=String(Date.now());P.push({id:id,ime:n});saveProfs(P);SAP.izaberi(id)},
 obrisi:function(id){var p=P.filter(function(p){return p.id===id})[0];if(!p||P.length<2)return;if(!confirm('Obrisati igrača '+p.ime+' i sav njegov napredak?'))return;
   Object.keys(ls).forEach(function(k){if(k.indexOf('sa_p'+id+'_')===0)R.call(ls,k)});P=P.filter(function(x){return x.id!==id});saveProfs(P);if(id===cur)SET.call(ls,'sa_pcur',P[0].id);SAP.prikazi()},
 reset:function(){if(!confirm('Nova igra za igrača '+ime()+'? Njegov napredak bit će obrisan i kreće od Razine 1. Ostali igrači ostaju kakvi jesu.'))return;
   Object.keys(ls).forEach(function(k){if(k.indexOf('sa_p'+cur+'_')===0)R.call(ls,k)});alert('Napredak igrača '+ime()+' je obrisan.');location.reload()},
 zatvori:function(){var o=document.getElementById('saProf');if(o)o.remove();try{sessionStorage.setItem('sa_izabran','1')}catch(e){}},
 prikazi:function(){SAP.zatvori();var o=document.createElement('div');o.id='saProf';
  o.style.cssText='position:fixed;inset:0;z-index:99999;background:rgba(5,64,94,.85);display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif';
  var h='<div style="background:#fff8e1;border-radius:20px;padding:20px;max-width:340px;width:90%;text-align:center;max-height:90vh;overflow:auto"><div style="font-size:26px;font-weight:900;color:#05405e;margin-bottom:12px">👤 Tko igra?</div>';
  P.forEach(function(p){h+='<div style="display:flex;gap:6px;margin:6px 0"><button onclick="SAP.izaberi(\''+p.id+'\')" style="flex:1;font-size:20px;font-weight:800;padding:12px;border:0;border-radius:14px;background:'+(p.id===cur?'#ffd34d':'#7fd3ff')+';color:#05405e">'+(p.id===cur?'✅ ':'')+esc(p.ime)+'</button>'+(P.length>1?'<button onclick="SAP.obrisi(\''+p.id+'\')" style="font-size:18px;border:0;border-radius:14px;background:#eee;padding:0 12px">🗑</button>':'')+'</div>'});
  h+='<button onclick="SAP.novi()" style="width:100%;margin-top:10px;font-size:18px;font-weight:800;padding:12px;border:0;border-radius:14px;background:#4caf50;color:#fff">➕ Novi igrač</button>';
  h+='<button onclick="SAP.zatvori()" style="width:100%;margin-top:8px;font-size:16px;padding:10px;border:0;border-radius:14px;background:#ddd;color:#333">Nastavi kao '+esc(ime())+'</button></div>';
  o.innerHTML=h;document.body.appendChild(o)}
};
document.addEventListener('DOMContentLoaded',function(){
 var l=document.getElementById('lvls');
 if(l){var b=document.createElement('div');b.style.margin='8px 0';b.innerHTML='<button class="small" onclick="SAP.prikazi()" style="font-weight:800;background:#7fd3ff;color:#05405e">👤 Igrač: '+esc(ime())+' (promijeni)</button>';l.parentNode.insertBefore(b,l)}
 var n=document.getElementById('novaIgraB');if(n){n.setAttribute('onclick','SAP.reset()');n.innerHTML='🔄 NOVA IGRA za '+esc(ime())}
 var s=null;try{s=sessionStorage.getItem('sa_izabran')}catch(e){}
 if(!s&&l)SAP.prikazi();
});
})();
