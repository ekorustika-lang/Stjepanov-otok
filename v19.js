/* Stjepanov otok avanture 2.0 - v35: jedna povezana avantura (5 razina redom), 3 zivota, spremanje, pauza */
(function(){
var PAGES=['./','dzungla.html','gusari.html','vulkan.html','otok.html'];
var f=location.pathname.split('/').pop();
var LVL={'':1,'index.html':1,'dzungla.html':2,'gusari.html':3,'vulkan.html':4,'otok.html':5}[f]||1;
var ls=localStorage,Q=location.search;
function en(){return ls.getItem('sa_lang')==='en'}
function syncRw(){var r;try{r=JSON.parse(ls.getItem('sa_rewards_castle'))||{}}catch(e){r={}}var ch=0;for(var i=1;i<=5;i++)if(ls.getItem('sa_best'+i)&&!r[i]){r[i]=1;ch=1}if(ch)ls.setItem('sa_rewards_castle',JSON.stringify(r))}
try{syncRw()}catch(e){}
function adv(){var a=+ls.getItem('sa_adv');if(!(a>=1&&a<=5)){a=1;ls.setItem('sa_adv','1')}return a}
function setAdv(n){ls.setItem('sa_adv',String(n));ls.setItem('sa_last',String(n));ls.setItem('sa_unlock',String(Math.max(n,+ls.getItem('sa_unlock')||1)))}
function clearSaves(){['sa_save','sa_saveX','sa_save1','sa_save2','sa_save3','sa_save4','sa_save5'].forEach(function(k){ls.removeItem(k)})}
function resetAdv(){clearSaves();setAdv(1)}
var A=adv();
/* razine 2-5: igrac smije biti samo na svojoj trenutnoj razini - nema preskakanja ni vracanja */
if(LVL>1&&LVL!==A){location.replace(A>1?PAGES[A-1]+'?start=1':'./');return}
var lastHit=0,moving=false;
function el(h,css){var d=document.createElement('div');d.style.cssText=css;d.innerHTML=h;document.body.appendChild(d);return d}
var BOX='position:fixed;inset:0;z-index:99998;background:rgba(5,64,94,.88);display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif';
var BTN='margin:8px 4px 0;font-size:22px;font-weight:900;padding:14px 26px;border:0;border-radius:16px;background:#ffd34d;color:#05405e;box-shadow:0 6px 0 #c9a227';
function confetti(n){var c=['#ffd34d','#ff6b6b','#3fcf5a','#4fc3f7','#ff8fc0','#b388ff'];for(var i=0;i<(n||120);i++){var p=document.createElement('div');var sz=8+Math.random()*8;p.style.cssText='position:fixed;top:-20px;left:'+(Math.random()*100)+'vw;width:'+sz+'px;height:'+(sz*.6)+'px;background:'+c[i%6]+';z-index:100000;pointer-events:none;border-radius:2px;animation:v24c '+(2.5+Math.random()*2.5)+'s linear '+(Math.random()*1.5)+'s forwards';document.body.appendChild(p);(function(q){setTimeout(function(){q.remove()},6500)})(p)}}
function say(t){try{if(window.speechSynthesis){var u=new SpeechSynthesisUtterance(t);u.lang=en()?'en-US':'hr-HR';u.rate=.95;speechSynthesis.speak(u)}}catch(e){}}
window.V19={
 adv:adv,
 hit:function(){var n=Date.now();if(n-lastHit<1500)return false;lastHit=n;
  try{navigator.vibrate&&navigator.vibrate(200)}catch(e){}
  var d=el('<div style="font-size:90px;animation:v19h 1s ease-out forwards">\ud83d\udc94</div>','position:fixed;inset:0;z-index:9998;pointer-events:none;display:flex;align-items:center;justify-content:center;background:rgba(255,0,0,.35);animation:v19f 1s ease-out forwards');
  setTimeout(function(){d.remove()},1000);
  var h=document.getElementById('livesH');if(h){h.style.animation='none';void h.offsetWidth;h.style.animation='v19s .6s'}
  return true},
 gameOver:function(){resetAdv();
  el('<div style="background:#fff8e1;border-radius:22px;padding:24px;max-width:360px;width:90%;text-align:center;animation:v19h .5s"><div style="font-size:32px;font-weight:900;color:#c0392b">'+(en()?'GAME OVER!':'KRAJ IGRE!')+'</div><div style="font-size:17px;color:#05405e;margin:12px 0">'+(en()?'The adventure starts again from level 1 with 3 new lives.':'Avantura kre\u0107e ispo\u010detka od 1. razine s 3 nova \u017eivota.')+'</div><div style="font-size:34px">\u2764\ufe0f\u2764\ufe0f\u2764\ufe0f</div><button onclick="location.replace(\'./?start=1\')" style="'+BTN+'">'+(en()?'START AGAIN':'KRENI ISPO\u010cETKA')+'</button></div>',BOX)},
 newAdventure:function(){resetAdv();location.href='./?start=1'}
};
/* prijelaz: tek kad igra stvarno prikaze ekran pobjede (svi uvjeti razine ispunjeni) */
function nextLevel(){
 if(moving)return;moving=true;setAdv(LVL+1);/* v35: sljedeca razina uvijek krece od pocetka */ls.removeItem('sa_save'+(LVL+1));
 el('<div style="text-align:center;animation:v19h .6s"><div style="font-size:40px;font-weight:900;color:#ffd34d;text-shadow:0 4px 0 #05405e;padding:0 10px">'+(en()?'BRAVO! NEXT LEVEL!':'BRAVO! SLJEDE\u0106A RAZINA!')+'</div><div style="font-size:60px;margin-top:10px">\u2b50\u27a1\ufe0f</div></div>','position:fixed;inset:0;z-index:99999;background:rgba(5,64,94,.92);display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif');
 confetti(60);
 setTimeout(function(){location.replace(PAGES[LVL]+'?start=1')},2200);
}
function victory(){
 if(moving)return;moving=true;ls.setItem('sa_victory','1');try{syncRw()}catch(e){}resetAdv();
 var E=en();
 el('<div style="background:#fff8e1;border-radius:22px;padding:24px;max-width:400px;width:90%;text-align:center;animation:v19h .6s"><div style="font-size:72px">\ud83c\udfc6\ud83c\udfdd\ufe0f</div><div style="font-size:30px;font-weight:900;color:#c0392b;line-height:1.2">'+(E?'BRAVO, STJEPAN! YOU WON THE WHOLE ISLAND! \ud83c\udfc6\ud83c\udfdd\ufe0f':'BRAVO, STJEPANE! OSVOJIO SI CIJELI OTOK! \ud83c\udfc6\ud83c\udfdd\ufe0f')+'</div><div style="font-size:16px;color:#05405e;margin:10px 0">'+(E?'You finished all 5 levels!':'Pro\u0161ao si svih 5 razina!')+'</div><button onclick="location.replace(\'./\')" style="'+BTN+'">\ud83c\udfe0 '+(E?'MAIN MENU':'GLAVNI IZBORNIK')+'</button></div>',BOX);
 confetti();setTimeout(confetti,1500);setTimeout(confetti,3000);
 say(E?'Bravo Stjepan! You won the whole island!':'Bravo, Stjepane! Osvojio si cijeli otok!');
}
var st=document.createElement('style');
st.textContent='@keyframes v24c{to{transform:translateY(110vh) rotate(720deg)}}@keyframes v19f{from{opacity:1}to{opacity:0}}@keyframes v19h{0%{transform:scale(.3)}60%{transform:scale(1.2)}100%{transform:scale(1)}}@keyframes v19s{0%,100%{transform:none}25%{transform:translateX(-8px) scale(1.3)}75%{transform:translateX(8px) scale(1.3)}}'
+'html body #lvls,#resetB,#novaIgraB,#gemH,#win button,#over button{display:none!important}#start button.small[onclick*="location"]{display:none!important}#start button.v32{display:inline-block!important}'
+(LVL>1?'button[onclick="SAP.prikazi()"]{display:none!important}':'');
document.head.appendChild(st);
function mk(id,html,css,fn){var b=document.createElement('button');b.id=id;b.className='big v32';b.innerHTML=html;if(css)b.style.cssText=css;b.onclick=fn;return b}
document.addEventListener('DOMContentLoaded',function(){
 var E=en(),$=function(i){return document.getElementById(i)};
 var w=$('win');
 if(w)new MutationObserver(function(){if(!w.classList.contains('hidden')){if(LVL<5)nextLevel();else victory()}}).observe(w,{attributes:true,attributeFilter:['class']});
 var mb=$('menuB');if(mb){mb.textContent='\u23f8';mb.title=E?'Pause':'Pauza'}
 var jb=$('jumpB');if(jb&&!E&&/SKOK$/.test(jb.textContent))jb.textContent='SKO\u010cI';
 /* zatvaranje / izlazak iz aplikacije sprema napredak (kao pauza) */
 function autosave(){var h=$('hud');if(!moving&&h&&!h.classList.contains('hidden')&&mb)mb.click()}
 document.addEventListener('visibilitychange',function(){if(document.hidden)autosave()});
 addEventListener('pagehide',autosave);
 var pb=$('playB'),start=$('start');
 if(LVL===1){
  var a=adv(),hasSave=!!ls.getItem('sa_save1');
  /* IGRAJ / NASTAVI uvijek vodi na trenutnu razinu avanture */
  if(pb){if(a>1||hasSave)pb.textContent='\u25b6 '+(E?'CONTINUE':'NASTAVI')+' ('+(E?'level ':'razina ')+a+'/5)';
   pb.addEventListener('click',function(e){if(adv()>1){e.stopImmediatePropagation();e.preventDefault();location.href=PAGES[adv()-1]+'?start=1'}},true)}
  var box=document.createElement('div');box.style.margin='8px 0';
  if(a>1||hasSave)box.appendChild(mk('v32new','\ud83d\udd04 '+(E?'NEW ADVENTURE':'NOVA AVANTURA'),'font-size:18px;padding:10px 18px;background:#ff7a59;color:#fff;box-shadow:0 6px 0 #b8492f',function(){if(confirm(E?'Start a new adventure from level 1? (Castle stays.)':'Nova avantura od 1. razine? Dvorac i nagrade ostaju.')){V19.newAdventure()}}));
  box.appendChild(mk('v32castle','\ud83c\udff0 '+(E?'MY CASTLE':'MOJ DVORAC'),'font-size:18px;padding:10px 18px;background:#b388ff;color:#fff;box-shadow:0 6px 0 #7a52c7',function(){location.href='dvorac.html?v=35'}));
  if(pb&&pb.parentNode)pb.parentNode.insertBefore(box,pb.nextSibling);
  if(ls.getItem('sa_victory')){var d=document.createElement('div');d.style.cssText='margin:6px auto;font-size:18px;font-weight:900;color:#ffd34d;text-shadow:0 2px 0 #05405e';d.textContent=E?'\ud83c\udfc6 YOU WON THE WHOLE ISLAND! \ud83c\udfdd\ufe0f':'\ud83c\udfc6 OSVOJIO SI CIJELI OTOK! \ud83c\udfdd\ufe0f';if(pb&&pb.parentNode)pb.parentNode.insertBefore(d,pb)}
  if(start){var v=document.createElement('div');v.style.cssText='font-size:12px;opacity:.6;margin-top:6px';v.textContent='v35';start.appendChild(v)}
  if(/start=1/.test(Q)&&adv()===1)setTimeout(function(){pb&&pb.click()},400);
 }else if(start&&pb){
  /* pauza na razinama 2-5: NASTAVI ili sigurni IZLAZ u glavni izbornik (napredak je spremljen) */
  var x=mk('v32exit','\ud83c\udfe0 '+(E?'EXIT (saved)':'IZLAZ (spremljeno)'),'font-size:18px;padding:10px 18px;background:#fff;color:#05405e;box-shadow:0 6px 0 #9ab',function(){location.href='./'});
  pb.parentNode.insertBefore(x,pb.nextSibling);
  /* v33: razina 2-5 krece odmah, bez pocetnog ekrana i bez pitanja o igracu (isti profil) */
  start.style.visibility='hidden';
  setTimeout(function(){try{pb.click()}catch(e){}start.style.visibility=''},300);
 }
});
})();
