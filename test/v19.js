/* Stjepanov otok avanture 2.0 – v19: zaključavanje razina, 3 života, napredak */
(function(){
var PAGES=['./','dzungla.html','gusari.html','vulkan.html','otok.html'];
var f=location.pathname.split('/').pop();
var LVL={'':1,'index.html':1,'dzungla.html':2,'gusari.html':3,'vulkan.html':4,'otok.html':5}[f]||1;
var ls=localStorage,Q=location.search;
function en(){return ls.getItem('sa_lang')==='en'}
function unlocked(){var u=+ls.getItem('sa_unlock')||1;for(var i=1;i<=4;i++)if(ls.getItem('sa_best'+i))u=Math.max(u,i+1);return Math.min(5,u)}
function done(n){return !!ls.getItem('sa_best'+n)}
function wipe(){var cur=Storage.prototype.getItem.call(ls,'sa_pcur');
 Object.keys(ls).forEach(function(k){if(k.indexOf('sa_')!==0||k==='sa_lang'||k==='sa_mus'||k==='sa_profs'||k==='sa_pcur')return;
  if(/^sa_p[^_]+_/.test(k)){if(cur&&k.indexOf('sa_p'+cur+'_')!==0)return;if(/_castle$/.test(k))return}else if(k==='sa_castle')return;
  ls.removeItem(k)})}
if(LVL>unlocked()){location.replace('./?locked='+LVL);return}
var lastHit=0;
function el(h,css){var d=document.createElement('div');d.style.cssText=css;d.innerHTML=h;document.body.appendChild(d);return d}
var BOX='position:fixed;inset:0;z-index:99998;background:rgba(5,64,94,.85);display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif';
window.V19={
 unlocked:unlocked,
 hit:function(){var n=Date.now();if(n-lastHit<1500)return false;lastHit=n;
  try{navigator.vibrate&&navigator.vibrate(200)}catch(e){}
  var d=el('<div style="font-size:90px;animation:v19h 1s ease-out forwards">💔</div>','position:fixed;inset:0;z-index:9998;pointer-events:none;display:flex;align-items:center;justify-content:center;background:rgba(255,0,0,.35);animation:v19f 1s ease-out forwards');
  setTimeout(function(){d.remove()},1000);
  var h=document.getElementById('livesH');if(h){h.style.animation='none';void h.offsetWidth;h.style.animation='v19s .6s'}
  return true},
 gameOver:function(){wipe();
  el('<div style="background:#fff8e1;border-radius:22px;padding:24px;max-width:360px;width:90%;text-align:center;animation:v19h .5s"><div style="font-size:30px;font-weight:900;color:#c0392b">'+(en()?'GAME OVER! ❤️ TRY AGAIN!':'KRAJ IGRE! ❤️ POKUŠAJ PONOVNO!')+'</div><div style="font-size:16px;color:#05405e;margin:12px 0">'+(en()?'The adventure starts again from Level 1 – the Beach.':'Avantura kreće ispočetka od 1. razine – Plaže.')+'</div><div style="font-size:34px">❤️❤️❤️</div><button onclick="location.href=\'./?start=1\'" style="margin-top:14px;font-size:22px;font-weight:900;padding:14px 26px;border:0;border-radius:16px;background:#ffd34d;color:#05405e;box-shadow:0 6px 0 #c9a227">'+(en()?'PLAY AGAIN':'IGRAJ PONOVNO')+'</button></div>',BOX)},
 newAdventure:function(){wipe();location.href='./?start=1'}
};
var st=document.createElement('style');st.textContent='@keyframes v19f{from{opacity:1}to{opacity:0}}@keyframes v19h{0%{transform:scale(.3)}60%{transform:scale(1.2)}100%{transform:scale(1)}}@keyframes v19s{0%,100%{transform:none}25%{transform:translateX(-8px) scale(1.3)}75%{transform:translateX(8px) scale(1.3)}}';
document.head.appendChild(st);
document.addEventListener('DOMContentLoaded',function(){
 var l=document.getElementById('lvls');
 if(l){[].forEach.call(l.querySelectorAll('button'),function(b){var m=b.textContent.match(/([1-5])\./);if(m&&!b.disabled&&done(+m[1]))b.textContent+=' ✅'});
  var h=l.querySelector('div');if(h)h.textContent=en()?'LEVEL SELECT:':'ODABIR RAZINE:'}
 if(LVL===1&&l){
  var c=document.createElement('div');c.style.margin='8px 0';
  c.innerHTML='<button class="big" id="v19cont" style="background:#3fcf5a;color:#063;box-shadow:0 8px 0 #1d8a32">▶ '+(en()?'CONTINUE GAME':'NASTAVI IGRU')+'</button>';
  l.parentNode.insertBefore(c,l);
  document.getElementById('v19cont').onclick=function(){var n=Math.min(+ls.getItem('sa_last')||1,unlocked());if(n<=1){var p=document.getElementById('playB');p&&p.click()}else location.href=PAGES[n-1]+'?start=1'};
  var v=document.createElement('div');v.style.cssText='font-size:12px;opacity:.6;margin-top:6px';v.textContent='v19';l.parentNode.appendChild(v);
  var m=Q.match(/locked=(\d)/);
  if(m){var t=el('<div style="background:#fff8e1;border-radius:16px;padding:14px 20px;font-weight:800;color:#05405e">🔒 '+(en()?'That level is still locked! Finish the previous level first.':'Ta razina je još zaključana! Prvo završi prethodnu razinu.')+'</div>','position:fixed;top:20px;left:0;right:0;z-index:99997;display:flex;justify-content:center;font-family:system-ui,sans-serif');setTimeout(function(){t.remove()},3500)}
  if(/start=1/.test(Q))setTimeout(function(){var p=document.getElementById('playB');p&&p.click()},400);
 }
 if(LVL>1)ls.setItem('sa_last',String(LVL));
 var pb=document.getElementById('playB');if(pb)pb.addEventListener('click',function(){ls.setItem('sa_last',String(LVL))});
});
})();
