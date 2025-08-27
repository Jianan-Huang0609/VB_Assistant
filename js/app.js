(function () {
  const app = document.getElementById('app');
  const base = window.__BASE__ || '';
  const navItems = document.querySelectorAll('.nav-item');

  // 配置：优先加载片段 /modules/*.html；如果不存在，回退到整页 /raw/*.html 并自动抽取
  const SOURCES = {
    poctech: {
      fragment: `${base}/modules/poctech.html`,
      fallbackPage: `${base}/raw/PoC-Tech_Path.html`,
      slice: 'main, #root, .main, body' // 从整页里优先取这些容器
    },
    vb_todo: {
      fragment: `${base}/modules/vb_todo.html`,
      fallbackPage: `${base}/raw/Vibe_Coding_ToDo.html`,
      slice: 'main, #app, #root, .main, body'
    }
  };

  function setActive(name) {
    navItems.forEach(btn => btn.classList.toggle('active', btn.dataset.load === name));
  }

  async function fetchText(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return res.text();
  }

  // 将整页 HTML 中的主体抽出，并重写相对路径到当前 base
  function extractAndRewrite(html, sliceSelectors, pageUrl) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    let picked = null;
    for (const sel of sliceSelectors.split(',')) {
      const node = doc.querySelector(sel.trim());
      if (node) { picked = node; break; }
    }
    if (!picked) picked = doc.body;

    // 重写 <img src>, <link href>, <script src> 为相对当前站点子路径
    const rewriteUrl = (u) => {
      if (!u || /^https?:\/\//i.test(u) || u.startsWith('data:')) return u;
      // 去掉开头的 './' 或 '/'
      const clean = u.replace(/^\.\//, '').replace(/^\//, '');
      return `${base}/${clean}`;
    };

    picked.querySelectorAll('img[src]').forEach(el => el.src = rewriteUrl(el.getAttribute('src')));
    picked.querySelectorAll('link[href]').forEach(el => el.href = rewriteUrl(el.getAttribute('href')));
    picked.querySelectorAll('a[href]').forEach(el => {
      const href = el.getAttribute('href');
      if (href && !/^https?:\/\//i.test(href) && !href.startsWith('#') && !href.startsWith('mailto:')) {
        el.setAttribute('href', rewriteUrl(href));
      }
    });

    // 处理脚本：重新创建 <script> 以便执行
    const scripts = [...picked.querySelectorAll('script')];
    scripts.forEach(s => s.remove()); // 先从片段移除

    const htmlStr = picked.innerHTML;
    return { htmlStr, scripts };
  }

  function runScripts(scripts) {
    scripts.forEach(old => {
      const s = document.createElement('script');
      if (old.src) {
        s.src = old.src;
      } else {
        s.textContent = old.textContent || '';
      }
      // 复制常见属性
      ['type','async','defer','crossorigin','referrerpolicy'].forEach(k => {
        if (old.hasAttribute(k)) s.setAttribute(k, old.getAttribute(k));
      });
      document.body.appendChild(s);
    });
  }

  async function load(name) {
    const src = SOURCES[name];
    if (!src) return;

    setActive(name);
    app.innerHTML = '<div class="loading">Loading…</div>';

    // 优先尝试片段
    try {
      const fragment = await fetchText(src.fragment);
      app.innerHTML = `<section class="container">${fragment}</section>`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    } catch (e) {
      // 片段不存在，回退到整页抽取
    }

    try {
      const pageHtml = await fetchText(src.fallbackPage);
      const { htmlStr, scripts } = extractAndRewrite(pageHtml, src.slice, src.fallbackPage);
      app.innerHTML = `<section class="container">${htmlStr}</section>`;
      runScripts(scripts);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      app.innerHTML = `<div class="error">模块加载失败：${name}<br>${e.message}</div>`;
      console.error(e);
    }
  }

  // 绑定侧栏切换
  navItems.forEach(btn => {
    btn.addEventListener('click', () => load(btn.dataset.load));
  });

  // 默认加载 PoC-Tech
  window.addEventListener('DOMContentLoaded', () => load('poctech'));

  // 侧栏折叠
  document.getElementById('toggleSidebar')?.addEventListener('click', () => {
    document.body.classList.toggle('sidebar-collapsed');
  });
})();
