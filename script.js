const pages=[...document.querySelectorAll(".page")],answers={};let current=0,monkeyClicks=0;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
function toast(t){const e=$("#toast");e.textContent=t;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),1600)}
function saveInputs(){ $$("[data-key]").forEach(el=>{if(el.matches("input,textarea")&&el.value.trim())answers[el.dataset.key]=el.value.trim()})}
function go(n){saveInputs();current=Math.max(0,Math.min(n,pages.length-1));pages.forEach((p,i)=>p.classList.toggle("active",i===current));$("#progress").style.width=((current+1)/pages.length*100)+"%";window.scrollTo({top:0,behavior:"smooth"});if(current===9)renderSummary()}
function next(){go(current+1)}function back(){go(current-1)}
$("#startVideo").addEventListener("click",()=>{go(1);const v=$("#introVideo");v.currentTime=0;v.play().catch(()=>{})});
$$(".next").forEach(b=>b.addEventListener("click",next));$$(".back").forEach(b=>b.addEventListener("click",back));
document.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const group=b.closest("[data-key]");if(!group||!b.matches("button"))return;const key=group.dataset.key,val=b.dataset.value||b.textContent.trim();if(group.classList.contains("multi")){b.classList.toggle("selected");answers[key]=[...group.querySelectorAll(".selected")].map(x=>x.dataset.value||x.textContent.trim())}else{group.querySelectorAll("button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");answers[key]=val}toast("Je note ça ✨")});
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
const labels={origines:"Tes origines",origineVille:"Là où tu as grandi",fratrie:"Frères et sœurs",placeFamille:"Ta place dans la fratrie",troisMots:"Trois mots sur toi",personnalite:"Ta personnalité",couleurs:"Tes couleurs",bonneHumeur:"Ce qui te met de bonne humeur",dimanche:"Ton dimanche idéal",evenementiel:"Ce qui te plaît dans l'événementiel",projetCoeur:"Un projet qui te tient à cœur",dans5ans:"Ta vie dans 5 ans",reve:"Ton rêve",activites:"Activités qui te tentent",activiteLibre:"Une activité à proposer",soiree:"Soirée tranquille",voyage:"Ta façon de voyager",communication:"Ta façon de communiquer",qualites:"Ce que tu apprécies",detailCraquant:"Un détail craquant",timing:"Quand se voir",dateSouhaitee:"Date souhaitée",disponibilites:"Tes disponibilités",premierRdv:"Ton idée de premier rendez-vous"};
function renderSummary(){saveInputs();$("#summary").innerHTML=Object.entries(labels).map(([k,l])=>{let v=answers[k];if(Array.isArray(v))v=v.join(", ");return `<div class="summary-item"><b>${l}</b><span>${escapeHtml(v||"Pas de réponse")}</span></div>`}).join("")}
$("#showSummary").addEventListener("click",()=>go(9));
$("#copy").addEventListener("click",async()=>{renderSummary();const t=Object.entries(labels).map(([k,l])=>{let v=answers[k];return v?(l+" : "+(Array.isArray(v)?v.join(", "):v)):""}).filter(Boolean).join("\n\n");try{await navigator.clipboard.writeText(t);toast("Récapitulatif copié ♡")}catch(e){toast("Fais une capture du récapitulatif.")}});
$("#restart").addEventListener("click",()=>{if(confirm("Recommencer le parcours ? Les réponses de cette visite seront effacées.")){Object.keys(answers).forEach(k=>delete answers[k]);$$("input,textarea").forEach(x=>x.value="");$$(".selected").forEach(x=>x.classList.remove("selected"));go(0)}});
$("#sound").addEventListener("click",()=>toast("Pas de musique imposée : choisis ta bande-son ♫"));
const overlay=$("#surprise");function openMonkey(){overlay.classList.add("show");overlay.setAttribute("aria-hidden","false");document.body.classList.remove("flip");void document.body.offsetWidth;document.body.classList.add("flip");setTimeout(()=>document.body.classList.remove("flip"),900)}
function closeMonkey(){overlay.classList.remove("show");overlay.setAttribute("aria-hidden","true")}
$("#monkeyBtn").addEventListener("click",()=>{monkeyClicks++;if(monkeyClicks===1){$("#monkeyBtn").textContent="Tu insistes vraiment ? Clique encore…";$("#monkeyHint").textContent="Le bouton vient de te prévenir une deuxième fois.";$("#monkeyBtn").style.transform="translateX(20px) rotate(-3deg)";toast("Mauvaise idée Julie…")}else openMonkey()});
$("#closePopup").addEventListener("click",closeMonkey);$("#okPopup").addEventListener("click",closeMonkey);overlay.addEventListener("click",e=>{if(e.target===overlay)closeMonkey()});
$("#progress").style.width=(100/pages.length)+"%";

// A voluntary pause interlude, available throughout the questionnaire.
const pauseOverlay=document.querySelector('#pauseOverlay');
const pauseVideo=document.querySelector('#pauseVideo');
const pauseFab=document.querySelector('#pauseFab');
function openPause(){pauseOverlay.classList.add('show');pauseOverlay.setAttribute('aria-hidden','false');pauseVideo.currentTime=0;pauseVideo.play().catch(()=>{});}
function closePause(){pauseVideo.pause();pauseOverlay.classList.remove('show');pauseOverlay.setAttribute('aria-hidden','true');}
pauseFab.addEventListener('click',openPause);
document.querySelector('#closePause').addEventListener('click',closePause);
document.querySelector('#resumePause').addEventListener('click',closePause);
pauseOverlay.addEventListener('click',e=>{if(e.target===pauseOverlay)closePause()});
const updatePauseFab=()=>pauseFab.classList.toggle('visible',current>0 && current<9);
const originalGo=go;
go=function(n){originalGo(n);updatePauseFab()};
updatePauseFab();
