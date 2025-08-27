(function () {
  const app = document.getElementById('app');
  const links = document.querySelectorAll('.nav-item');
  const sidebar = document.querySelector('.sidebar');
  const toggleBtn = document.getElementById('toggleSidebar');
  const base = window.__BASE_PATH__ || '';

  // 设置导航项活跃状态
  function setActive(route) {
    links.forEach(a => {
      a.classList.toggle('active', a.dataset.route === route);
    });
  }

  // 加载模块
  async function loadModule(name) {
    app.innerHTML = '<div class="loading">正在加载模块...</div>';
    
    try {
      const res = await fetch(`${base}/modules/${name}.html`, { 
        cache: 'no-store',
        headers: {
          'Accept': 'text/html'
        }
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const html = await res.text();
      app.innerHTML = html;
      setActive(name.replace('_', '-')); // poctech, vb-todo
      
      // 滚动到顶部
      app.scrollTo({ top: 0, behavior: 'smooth' });
      
      // 执行模块内的脚本
      executeModuleScripts();
      
      console.log(`✅ 模块 ${name} 加载成功`);
      
    } catch (e) {
      console.error(`❌ 模块加载失败: ${name}`, e);
      app.innerHTML = `
        <div class="error">
          <h2>模块加载失败</h2>
          <p>无法加载模块: <strong>${name}</strong></p>
          <p>错误信息: ${e.message}</p>
          <button onclick="location.reload()" style="
            margin-top: 16px;
            padding: 8px 16px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
          ">重新加载</button>
        </div>
      `;
    }
  }

  // 执行模块内的脚本
  function executeModuleScripts() {
    const scripts = app.querySelectorAll('script');
    scripts.forEach(script => {
      if (script.src) {
        // 外部脚本
        const newScript = document.createElement('script');
        newScript.src = script.src;
        newScript.async = false;
        document.head.appendChild(newScript);
      } else {
        // 内联脚本
        try {
          new Function(script.textContent)();
        } catch (e) {
          console.warn('模块脚本执行失败:', e);
        }
      }
    });
  }

  // 路由解析
  function resolveRoute() {
    const hash = location.hash.replace(/^#/, '');
    
    if (hash.startsWith('/vb-todo')) {
      return 'vb_todo';
    }
    if (hash.startsWith('/poctech')) {
      return 'poctech';
    }
    
    // 默认路由
    return 'poctech';
  }

  // 路由变化处理
  function onRouteChange() {
    const name = resolveRoute();
    loadModule(name);
    
    // 移动端自动关闭侧边栏
    if (window.innerWidth <= 768) {
      sidebar.classList.remove('open');
      document.body.classList.remove('sidebar-open');
    }
  }

  // 侧边栏切换
  function toggleSidebar() {
    if (window.innerWidth <= 768) {
      // 移动端
      sidebar.classList.toggle('open');
      document.body.classList.toggle('sidebar-open');
    } else {
      // 桌面端
      document.body.classList.toggle('sidebar-collapsed');
    }
  }

  // 关闭移动端侧边栏
  function closeMobileSidebar(e) {
    if (window.innerWidth <= 768 && 
        sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) && 
        !toggleBtn.contains(e.target)) {
      sidebar.classList.remove('open');
      document.body.classList.remove('sidebar-open');
    }
  }

  // 初始化路由
  function initRouter() {
    // 如果没有 hash，设置默认路由
    if (!location.hash) {
      location.hash = '#/poctech';
    } else {
      onRouteChange();
    }
  }

  // 事件监听
  window.addEventListener('hashchange', onRouteChange);
  window.addEventListener('DOMContentLoaded', initRouter);
  document.addEventListener('click', closeMobileSidebar);
  
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleSidebar);
  }

  // 导航链接点击事件
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const hash = link.getAttribute('href');
      if (hash) {
        location.hash = hash;
      }
    });
  });

  // 窗口大小变化处理
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      sidebar.classList.remove('open');
      document.body.classList.remove('sidebar-open');
    }
  });

  // 调试信息
  console.log('VB Assistant App 初始化完成');
  console.log('Base Path:', base);
  console.log('Current Hash:', location.hash);

  // 暴露全局方法供调试
  window.VBAssistant = {
    loadModule,
    setActive,
    toggleSidebar,
    base
  };
})();
