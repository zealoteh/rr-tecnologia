'use strict';
const steps=[
 {label:'Necessidade',title:'Autonomia para calcular e conferir.',text:'Desenvolver autonomia na elaboração e conferência de cálculos em planilhas.',why:'Primeiro, definimos o que a pessoa precisa conseguir realizar.'},
 {label:'Treinamento',title:'Excel — Básico',text:'O software e o nível são definidos a partir dos conhecimentos prévios e das atividades que serão desenvolvidas.',why:'A ferramenta faz parte do plano; o objetivo dá direção ao treinamento.'},
 {label:'Conteúdos',title:'Referências de células e funções iniciais.',text:'Os conteúdos são agrupados no treinamento para apoiar a elaboração e a conferência dos cálculos.',why:'Selecionamos conhecimentos que contribuam para a necessidade identificada.'},
 {label:'Situação de aprendizagem',title:'Construir uma planilha com propósito.',text:'Organizar informações e realizar os cálculos de uma tarefa contextualizada, produzindo uma planilha como entrega.',why:'O desafio conecta os conteúdos a uma aplicação concreta.'},
 {label:'Estratégia',title:'Oficina prática.',text:'Experimentar com orientação, discutir as soluções e receber feedback durante a atividade.',why:'A estratégia apoia o objetivo e pode mudar conforme o contexto.'},
 {label:'Avaliação',title:'Executar, explicar e conferir.',text:'Realizar uma tarefa e explicar como os resultados foram conferidos. A planilha e a demonstração comentada compõem as evidências.',why:'Observamos a aplicação do conhecimento com critérios definidos.'}
];
const $=s=>document.querySelector(s);let currentStep=0;
function renderStep(){const s=steps[currentStep];$('#demo-steps').innerHTML=steps.map((step,i)=>`<button class="demo-step ${i===currentStep?'active':i<currentStep?'done':''}" data-step="${i}" ${i===currentStep?'aria-current="step"':''}><span>${i<currentStep?'✓':String(i+1).padStart(2,'0')}</span><span>${step.label}</span></button>`).join('');$('#step-count').textContent=String(currentStep+1).padStart(2,'0')+' / 06';$('#demo-progress').style.width=((currentStep+1)/steps.length*100)+'%';$('#demo-detail').innerHTML=`<div class="detail-enter"><span class="detail-tag">${s.label.toUpperCase()}</span><h3 class="detail-title">${s.title}</h3><p class="detail-text">${s.text}</p><p class="detail-why">${s.why}</p></div>`;$('#built-plan').innerHTML=steps.slice(0,currentStep+1).map(step=>`<span class="built-chip">✓ ${step.label}</span>`).join('');$('#previous').disabled=currentStep===0;$('#next').textContent=currentStep===steps.length-1?'Recomeçar ↺':'Próxima etapa →';}
$('#demo-steps').addEventListener('click',e=>{const button=e.target.closest('[data-step]');if(!button)return;currentStep=Number(button.dataset.step);renderStep();$(`[data-step="${currentStep}"]`).focus();});
$('#previous').addEventListener('click',()=>{currentStep=Math.max(0,currentStep-1);renderStep();});
$('#next').addEventListener('click',()=>{currentStep=(currentStep+1)%steps.length;renderStep();});
const dialog=$('#plan-dialog');$('#full-plan').addEventListener('click',()=>{if(!dialog.open)dialog.showModal();});$('#close-plan').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
$('#plan-content').innerHTML=steps.map(s=>`<div class="plan-row"><h3>${s.label}</h3><div><p><strong>${s.title}</strong></p><p>${s.text}</p></div></div>`).join('');
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
  const selector='.hero-copy > *, .hero-visual, .section .eyebrow, .section h2, .section .lead, .section .body-copy, .question, .journey-step, .context-note, .demo, .method-list, .evidence, .deliverable-list li, .deliverable-note, .deliverables .section-grid > div > p, .profile-monogram, .footnote, .closing .shell > *';
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
    if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}
  }),{threshold:0.08,rootMargin:'0px 0px -20px 0px'});
  document.documentElement.classList.add('motion');
  targets.forEach(el=>revealObserver.observe(el));
}
setupReveals();
reduce.addEventListener('change',setupReveals);
// Elementos alcançados por teclado são mostrados imediatamente.
document.addEventListener('focusin',event=>{
  const target=event.target.closest('.reveal');
  if(target)target.classList.add('visible');
});
let ticking=false;function progress(){const max=document.documentElement.scrollHeight-window.innerHeight;$('.reading-progress').style.width=(max>0?Math.min(100,Math.max(0,window.scrollY/max*100)):100)+'%';ticking=false;}window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(progress);ticking=true;}},{passive:true});window.addEventListener('resize',progress);renderStep();progress();
