/* 路由映射 */
const APPS = {
  'poc-tech': './apps/poc-tech/index.html',
  'vb-todo': './apps/vb-todo/index.html',
};

const root = document.documentElement;
const layout = document.querySelector('.layout');
const frame = document.getElementById('app-frame');
const crumbs = document.getElementById('crumb-active');
const navButtons = Array.from(document.querySelectorAll('.nav-item'));
const brand = document.querySelector('.brand');
const toggleBtn = document.getElementById('toggle');
const themeBtn = document.getElementById('theme');

/* 主题记忆（跟 UI_sidebar 的暗/亮切换习惯保持一致） */
const getTheme = ()=>localStorage.getItem('vb_theme')||'dark';
const setTheme = (t)=>localStorage.setItem('vb_theme',t);
function applyTheme(t){ root.classList.toggle('light', t==='light'); }
applyTheme(getTheme());

themeBtn.addEventListener('click', ()=>{
  const next = root.classList.contains('light') ? 'dark' : 'light';
  applyTheme(next); setTheme(next);
});

/* 展开/收起：默认记忆上次状态 */
const getOpen = ()=>localStorage.getItem('vb_sidebar_open')==='1';
const setOpen = (v)=>localStorage.setItem('vb_sidebar_open', v?'1':'0');
function applyOpen(v){ layout.classList.toggle('expanded', v); }
applyOpen(getOpen());

function toggleOpen(){ const v = !layout.classList.contains('expanded'); applyOpen(v); setOpen(v); }
brand.addEventListener('click', toggleOpen);
toggleBtn.addEventListener('click', toggleOpen);

/* 导航加载 + 高亮 + Hash 同步 */
function loadApp(key, push=true){
  const url = APPS[key]; if(!url) return;
  frame.src = url;
  crumbs.textContent = key==='poc-tech' ? 'PoC-Tech' : 'VB-ToDo';
  navButtons.forEach(b=>b.classList.toggle('active', b.dataset.target===key));
  if(push) location.hash = key;
}
navButtons.forEach(b=>{
  b.addEventListener('click', ()=>{
    const t = b.dataset.target;
    if(t.startsWith('_external:')){ const k=t.split(':')[1]; if(APPS[k]) window.open(APPS[k], '_blank', 'noreferrer'); return; }
    if(APPS[t]) loadApp(t, true);
  });
});
function boot(){
  const key = location.hash.replace('#','');
  if(APPS[key]) loadApp(key, false); else loadApp('poc-tech', false);
}
window.addEventListener('hashchange', boot); boot();
