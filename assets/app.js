// 1) 路由映射（保持与目录一致）
const APPS = {
  'poc-tech': './apps/poc-tech/index.html',
  'vb-todo': './apps/vb-todo/index.html',
};

// 2) 基础引用
const frame = document.getElementById('app-frame');
const buttons = Array.from(document.querySelectorAll('.nav-item'));
const crumbs = document.getElementById('crumb-active');

// 3) 加载指定子应用
function loadApp(key, pushHash = true) {
  const url = APPS[key];
  if (!url) return;

  frame.src = url;
  crumbs.textContent = key === 'poc-tech' ? 'PoC-Tech' : 'VB-ToDo';

  // 高亮
  buttons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.target === key);
  });

  // 同步 hash
  if (pushHash) location.hash = key;
}

// 4) 解析点击：支持 _external:* 打开新页
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;
    if (!target) return;

    if (target.startsWith('_external:')) {
      const key = target.split(':')[1];
      const url = APPS[key];
      if (url) window.open(url, '_blank', 'noreferrer');
      return;
    }

    if (APPS[target]) loadApp(target, true);
  });
});

// 5) hash 直达
function bootFromHash() {
  const key = location.hash.replace('#', '');
  if (APPS[key]) {
    loadApp(key, false);
  } else {
    loadApp('poc-tech', false);
  }
}
window.addEventListener('hashchange', bootFromHash);
bootFromHash();

// 6) 主题切换（明/暗）
const htmlRoot = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(mode) {
  if (mode === 'dark') htmlRoot.classList.add('dark');
  else htmlRoot.classList.remove('dark');
}
function getSavedTheme() {
  return localStorage.getItem('vb_theme') || 'light';
}
function setSavedTheme(mode) {
  localStorage.setItem('vb_theme', mode);
}

applyTheme(getSavedTheme());
themeToggle.addEventListener('click', () => {
  const next = htmlRoot.classList.contains('dark') ? 'light' : 'dark';
  applyTheme(next);
  setSavedTheme(next);
});
