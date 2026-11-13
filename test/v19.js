/* Stjepanov otok avanture 2.0 – v19: zaključavanje razina, 3 života, napredak */
(function(){
var PAGES=['./','dzungla.html','gusari.html','vulkan.html','otok.html'];
var f=location.pathname.split('/').pop();
var LVL={'':1,'index.html':1,'dzungla.html':2,'gusari.html':3,'vulkan.html':4,'otok.html':5}[f]||1;
var ls=localStorage,Q=location.search;
function en(){return ls.getItem('sa_lang')==='en'}
function unlocked(){var u=+ls.getItem('sa_unlock')||1;for(var i=1;i<=4;i++)if(ls.getItem('sa_best'+i))u=Math.max(u,i+1);return Math.min(5,u)}
function done(n){return !!ls.getItem('sa_best'+n)}
function syncRw(){var r;try{r=JSON.parse(ls.getItem('sa_rewards_castle'))||{}}catch(e){r={}}var ch=0;for(var i=1;i<=5;i++)if(ls.getItem('sa_best'+i)&&!r[i]){r[i]=1;ch=1}if(ch)ls.setItem('sa_rewards_castle',JSON.stringify(r))}
try{syncRw()}catch(e){}
function wipe(){try{syncRw()}catch(e){}var cur=Storage.prototype.getItem.call(ls,'sa_pcur');
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
 gameOver:function(){['sa_save'+LVL,LVL===1?'sa_save':'sa_saveX'].forEach(function(k){ls.removeItem(k)});ls.setItem('sa_last',String(LVL));
  el('<div style="background:#fff8e1;border-radius:22px;padding:24px;max-width:360px;width:90%;text-align:center;animation:v19h .5s"><div style="font-size:30px;font-weight:900;color:#c0392b">'+(en()?'GAME OVER! ❤️ TRY AGAIN!':'KRAJ IGRE! ❤️ POKUŠAJ PONOVNO!')+'</div><div style="font-size:16px;color:#05405e;margin:12px 0">'+(en()?'You start this level again with 3 new lives.':'Ovu razinu krećeš ispočetka s 3 nova života.')+'</div><div style="font-size:34px">❤️❤️❤️</div><button onclick="location.href=\''+PAGES[LVL-1]+'?start=1\'" style="margin-top:14px;font-size:22px;font-weight:900;padding:14px 26px;border:0;border-radius:16px;background:#ffd34d;color:#05405e;box-shadow:0 6px 0 #c9a227">'+(en()?'PLAY AGAIN':'IGRAJ PONOVNO')+'</button></div>',BOX)},
 newAdventure:function(){wipe();location.href='./?start=1'}
};

/* v24: zavrsni ekran pobjede nakon 5. razine */
function confetti(){var c=['#ffd34d','#ff6b6b','#3fcf5a','#4fc3f7','#ff8fc0','#b388ff'];for(var i=0;i<120;i++){var p=document.createElement('div');var sz=8+Math.random()*8;p.style.cssText='position:fixed;top:-20px;left:'+(Math.random()*100)+'vw;width:'+sz+'px;height:'+(sz*.6)+'px;background:'+c[i%6]+';z-index:100000;pointer-events:none;border-radius:2px;animation:v24c '+(2.5+Math.random()*2.5)+'s linear '+(Math.random()*1.5)+'s forwards';document.body.appendChild(p);(function(q){setTimeout(function(){q.remove()},6500)})(p)}}
function victory(){
 var w=document.getElementById('win');if(!w||w.getAttribute('data-v24'))return;w.setAttribute('data-v24','1');
 ls.setItem('sa_victory','1');try{syncRw()}catch(e){}
 var E=en(),rw=E?['🚩 Royal flag','🌳 Magic tree','⛲ Fountain','🗿 Golden statue','👑 Royal crown']:['🚩 Kraljevska zastava','🌳 Čarobno drvo','⛲ Fontana','🗿 Zlatni kip','👑 Kraljevska kruna'];
 var b=document.createElement('div');b.style.cssText='margin:10px auto;max-width:420px;background:rgba(255,248,225,.95);border-radius:18px;padding:12px 14px;color:#05405e;font-family:system-ui,sans-serif';
 b.innerHTML='<div style="font-size:26px;font-weight:900;color:#c0392b">'+(E?'🎉 THE END – YOU WON! 🎉':'🎉 KRAJ AVANTURE – POBIJEDIO SI! 🎉')+'</div><div style="font-size:16px;margin:6px 0">'+(E?'You finished all 5 levels! Bravo, Stjepan!':'Prošao si svih 5 razina! Bravo, Stjepane!')+'</div>';
 var t=document.getElementById('wText');if(t&&t.parentNode)t.parentNode.insertBefore(b,t.nextSibling);else w.appendChild(b);
 confetti();setTimeout(confetti,1500);setTimeout(confetti,3000);
 try{if(window.speechSynthesis){var u=new SpeechSynthesisUtterance(E?'Bravo Stjepan! You won the whole adventure!':'Bravo, Stjepane! Pobijedio si cijelu avanturu!');u.lang=E?'en-US':'hr-HR';u.rate=.95;speechSynthesis.speak(u)}}catch(e){}
}
document.addEventListener('DOMContentLoaded',function(){
 if(LVL===5){var w=document.getElementById('win');if(w)new MutationObserver(function(){if(!w.classList.contains('hidden'))victory()}).observe(w,{attributes:true,attributeFilter:['class']})}
 if(LVL===1&&ls.getItem('sa_best5')){var l=document.getElementById('lvls');if(l){var d=document.createElement('div');d.style.cssText='margin:8px auto;font-size:20px;font-weight:900;color:#ffd34d;text-shadow:0 2px 0 #05405e';d.textContent=en()?'🏆 CHAMPION – ADVENTURE COMPLETE! 👑':'🏆 POBJEDNIK – AVANTURA ZAVRŠENA! 👑';l.parentNode.insertBefore(d,l)}}
});
var st=document.createElement('style');st.textContent='@keyframes v24c{to{transform:translateY(110vh) rotate(720deg)}}@keyframes v19f{from{opacity:1}to{opacity:0}}@keyframes v19h{0%{transform:scale(.3)}60%{transform:scale(1.2)}100%{transform:scale(1)}}@keyframes v19s{0%,100%{transform:none}25%{transform:translateX(-8px) scale(1.3)}75%{transform:translateX(8px) scale(1.3)}}';
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
  var v=document.createElement('div');v.style.cssText='font-size:12px;opacity:.6;margin-top:6px';v.textContent='v26';l.parentNode.appendChild(v);
  var m=Q.match(/locked=(\d)/);
  if(m){var t=el('<div style="background:#fff8e1;border-radius:16px;padding:14px 20px;font-weight:800;color:#05405e">🔒 '+(en()?'That level is still locked! Finish the previous level first.':'Ta razina je još zaključana! Prvo završi prethodnu razinu.')+'</div>','position:fixed;top:20px;left:0;right:0;z-index:99997;display:flex;justify-content:center;font-family:system-ui,sans-serif');setTimeout(function(){t.remove()},3500)}
  if(/start=1/.test(Q))setTimeout(function(){var p=document.getElementById('playB');p&&p.click()},400);
 }
 if(LVL>1)ls.setItem('sa_last',String(LVL));
 var pb=document.getElementById('playB');if(pb)pb.addEventListener('click',function(){ls.setItem('sa_last',String(LVL))});
});
})();
