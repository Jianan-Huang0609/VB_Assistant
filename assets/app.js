/* 路由映射 */
const APPS = {
  'poc-tech': './apps/poc-tech/index.html',
  'vb-todo': './apps/vb-todo/index.html',
};

const root = document.documentElement;
const layout = document.querySelector('.layout');
const sidebar = document.querySelector('.sidebar');
const frame = document.getElementById('app-frame');
const crumbs = document.getElementById('crumb-active');
const navButtons = Array.from(document.querySelectorAll('.nav-item'));
const brand = document.querySelector('.brand');
const toggleBtn = document.getElementById('toggle');
const themeBtn = document.getElementById('theme');

/* ===== 主题（默认浅色；保留暗色） ===== */
const getTheme = () => localStorage.getItem('vb_theme') || 'light';
const setTheme = (t) => localStorage.setItem('vb_theme', t);
function applyTheme(t){ if(t==='dark') root.classList.add('dark'); else root.classList.remove('dark'); }
applyTheme(getTheme());
themeBtn?.addEventListener('click', ()=>{
  const next = root.classList.contains('dark') ? 'light' : 'dark';
  applyTheme(next); setTheme(next);
});

/* ===== 锁定展开（点击按钮/品牌） =====
   expanded = 常驻展开；未 expanded = 悬停展开 */
const getLocked = () => localStorage.getItem('vb_sidebar_locked') === '1';
const setLocked = (v) => localStorage.setItem('vb_sidebar_locked', v ? '1' : '0');
function applyLocked(v){ layout.classList.toggle('expanded', v); }
applyLocked(getLocked());

function toggleLocked(){
  const v = !layout.classList.contains('expanded');
  applyLocked(v); setLocked(v);
}
brand?.addEventListener('click', toggleLocked);
toggleBtn?.addEventListener('click', toggleLocked);

/* ===== 悬停展开兜底（给不支持 :has 的浏览器） ===== */
let hasSupportHas = CSS.supports('selector(:has(*))');
if (!hasSupportHas) {
  sidebar.addEventListener('mouseenter', ()=>{ if(!layout.classList.contains('expanded')) layout.classList.add('hover-open'); });
  sidebar.addEventListener('mouseleave', ()=> layout.classList.remove('hover-open'));
}

/* ===== 导航加载 + 高亮 + Hash 同步 ===== */
function loadApp(key, push=true){
  const url = APPS[key]; if(!url) return;
  frame.src = url;
  crumbs.textContent = key==='poc-tech' ? 'PoC-Tech' : 'VB-ToDo';
  navButtons.forEach(b=>b.classList.toggle('active', b.dataset.target===key));
  if (push) location.hash = key;
}
navButtons.forEach(b=>{
  b.addEventListener('click', ()=>{
    const t = b.dataset.target;
    if (!t) return;
    if (t.startsWith('_external:')) {
      const k = t.split(':')[1]; if (APPS[k]) window.open(APPS[k], '_blank', 'noreferrer');
      return;
    }
    if (APPS[t]) loadApp(t, true);
  });
});
function boot(){
  const key = location.hash.replace('#','');
  if (APPS[key]) loadApp(key, false); else loadApp('poc-tech', false);
}
window.addEventListener('hashchange', boot); boot();

/* ===== 认证功能 ===== */
let currentUser = null;

// 初始化 Supabase
const supabase = window.supabaseClient;

// 登录按钮和用户信息元素
const loginBtn = document.getElementById('login-btn');
const userInfo = document.getElementById('user-info');
const userName = document.getElementById('user-name');
const logoutBtn = document.getElementById('logout-btn');

// 检查认证状态
async function checkAuth() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      currentUser = session.user;
      showUserInfo();
    } else {
      showLoginButton();
    }
  } catch (error) {
    console.error('检查认证状态失败:', error);
    showLoginButton();
  }
}

// 显示登录按钮
function showLoginButton() {
  loginBtn.style.display = 'flex';
  userInfo.style.display = 'none';
}

// 显示用户信息
function showUserInfo() {
  loginBtn.style.display = 'none';
  userInfo.style.display = 'flex';
  userName.textContent = currentUser?.email || currentUser?.user_metadata?.name || '用户';
}

// 登录按钮点击事件
loginBtn?.addEventListener('click', () => {
  window.location.href = './login.html';
});

// 退出登录
logoutBtn?.addEventListener('click', async () => {
  try {
    await supabase.auth.signOut();
    currentUser = null;
    showLoginButton();
  } catch (error) {
    console.error('退出登录失败:', error);
  }
});

// 监听认证状态变化
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN') {
    currentUser = session.user;
    showUserInfo();
  } else if (event === 'SIGNED_OUT') {
    currentUser = null;
    showLoginButton();
  }
});

// 初始化认证状态
checkAuth();
