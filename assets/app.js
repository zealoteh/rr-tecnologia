const $=s=>document.querySelector(s);
const toggle=$('.menu-toggle'),nav=$('#navigation');toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menu');}));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.focus();}});
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
// Entrada em sequência: rótulo, título, texto e elementos de apoio.
// Conteúdo continua visível sem JavaScript ou com movimento reduzido.
let revealObserver;
function setupReveals(){
  if(revealObserver)revealObserver.disconnect();
  document.documentElement.classList.remove('motion');
  document.querySelectorAll('.reveal').forEach(el=>el.classList.remove('reveal','visible'));
  if(reduce.matches||!('IntersectionObserver' in window))return;
  const selector='.hero-copy > *, .hero-photo, .training-options article, .section .eyebrow, .section h2, .section .lead, .section .body-copy, .question, .journey-step, .context-note, .demo, .method-list, .evidence, .deliverable-list li, .deliverable-note, .deliverables .section-grid > div > p, .profile-monogram, .footnote, .closing .shell > *';
  const candidates=[...document.querySelectorAll(selector)].filter(el=>!el.closest('dialog'));
  const targets=candidates.filter(el=>!candidates.some(parent=>parent!==el&&parent.contains(el)));
  const groups=new Map();
  targets.forEach(el=>{
    const group=el.parentElement;
    const index=groups.get(group)||0;
    groups.set(group,index+1);
    el.style.setProperty('--reveal-delay',`${Math.min(index,3)*100}ms`);
    el.classList.add('reveal');
  });
  revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
    } else if(entry.boundingClientRect.bottom <= 0 || entry.boundingClientRect.top >= window.innerHeight){
      // Reativa a entrada somente depois que o elemento sai completamente da tela.
      entry.target.classList.remove('visible');
    }
  }),{threshold:0.08,rootMargin:'0px 0px -20px 0px'});
  document.documentElement.classList.add('motion');
  targets.forEach(el=>revealObserver.observe(el));
}
setupReveals();
if(reduce.addEventListener)reduce.addEventListener('change',setupReveals);
else if(reduce.addListener)reduce.addListener(setupReveals);
// Elementos alcançados por teclado são mostrados imediatamente.
document.addEventListener('focusin',event=>{
  const target=event.target.closest('.reveal');
  if(target)target.classList.add('visible');
});
let ticking=false;function progress(){const max=document.documentElement.scrollHeight-window.innerHeight;$('.reading-progress').style.width=(max>0?Math.min(100,Math.max(0,window.scrollY/max*100)):100)+'%';ticking=false;}window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(progress);ticking=true;}},{passive:true});window.addEventListener('resize',progress);progress();
