// 认证组件
// 提供登录、注册和用户资料管理功能

class AuthComponent {
  constructor() {
    this.api = window.supabaseAPI;
    this.currentUser = null;
    this.init();
  }

  init() {
    // 设置认证状态变化回调
    this.api.setAuthChangeCallback((isAuthenticated, user) => {
      this.currentUser = user;
      this.updateUI();
    });

    // 初始化UI
    this.createAuthUI();
    this.updateUI();
  }

  createAuthUI() {
    // 创建认证UI容器
    const authContainer = document.createElement('div');
    authContainer.id = 'auth-container';
    authContainer.className = 'auth-container';
    authContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 16px;
      min-width: 300px;
      color: white;
    `;

    // 未登录状态UI
    const loginUI = `
      <div id="login-ui">
        <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">登录 VB Assistant</h3>
        <div style="margin-bottom: 12px;">
          <input type="email" id="login-email" placeholder="邮箱地址" 
                 style="width: 100%; padding: 8px 12px; border: 1px solid rgba(255,255,255,0.2); 
                        border-radius: 6px; background: rgba(255,255,255,0.1); color: white;">
        </div>
        <button id="login-btn" style="width: 100%; padding: 10px; background: #3b82f6; 
                                     color: white; border: none; border-radius: 6px; 
                                     font-weight: 600; cursor: pointer; margin-bottom: 8px;">
          发送登录链接
        </button>
        <div style="text-align: center; margin: 8px 0; color: rgba(255,255,255,0.6);">或</div>
        <button id="google-login-btn" style="width: 100%; padding: 10px; background: #ea4335; 
                                            color: white; border: none; border-radius: 6px; 
                                            font-weight: 600; cursor: pointer; margin-bottom: 8px;">
          <i class="ti ti-brand-google" style="margin-right: 8px;"></i>Google 登录
        </button>
        <button id="github-login-btn" style="width: 100%; padding: 10px; background: #333; 
                                            color: white; border: none; border-radius: 6px; 
                                            font-weight: 600; cursor: pointer;">
          <i class="ti ti-brand-github" style="margin-right: 8px;"></i>GitHub 登录
        </button>
        <div id="login-message" style="margin-top: 12px; padding: 8px; border-radius: 4px; display: none;"></div>
      </div>
    `;

    // 已登录状态UI
    const userUI = `
      <div id="user-ui" style="display: none;">
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
          <div style="width: 40px; height: 40px; border-radius: 50%; background: #3b82f6; 
                      display: flex; align-items: center; justify-content: center; 
                      font-weight: 600; margin-right: 12px;" id="user-avatar">
            U
          </div>
          <div>
            <div id="user-name" style="font-weight: 600; margin-bottom: 2px;">用户</div>
            <div id="user-email" style="font-size: 12px; color: rgba(255,255,255,0.6);">user@example.com</div>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button id="profile-btn" style="flex: 1; padding: 8px; background: rgba(255,255,255,0.1); 
                                         color: white; border: 1px solid rgba(255,255,255,0.2); 
                                         border-radius: 6px; cursor: pointer; font-size: 12px;">
            资料
          </button>
          <button id="logout-btn" style="flex: 1; padding: 8px; background: #ef4444; 
                                        color: white; border: none; border-radius: 6px; 
                                        cursor: pointer; font-size: 12px;">
            退出
          </button>
        </div>
      </div>
    `;

    authContainer.innerHTML = loginUI + userUI;
    document.body.appendChild(authContainer);

    // 绑定事件
    this.bindEvents();
  }

  bindEvents() {
    // 登录按钮
    document.getElementById('login-btn')?.addEventListener('click', () => {
      this.handleEmailLogin();
    });

    // Google登录
    document.getElementById('google-login-btn')?.addEventListener('click', () => {
      this.handleGoogleLogin();
    });

    // GitHub登录
    document.getElementById('github-login-btn')?.addEventListener('click', () => {
      this.handleGitHubLogin();
    });

    // 退出登录
    document.getElementById('logout-btn')?.addEventListener('click', () => {
      this.handleLogout();
    });

    // 资料按钮
    document.getElementById('profile-btn')?.addEventListener('click', () => {
      this.showProfileModal();
    });

    // 回车键登录
    document.getElementById('login-email')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleEmailLogin();
      }
    });
  }

  async handleEmailLogin() {
    const email = document.getElementById('login-email').value.trim();
    if (!email) {
      this.showMessage('请输入邮箱地址', 'error');
      return;
    }

    this.showMessage('正在发送登录链接...', 'info');
    const { error } = await this.api.signInWithEmail(email);
    
    if (error) {
      this.showMessage(`登录失败: ${error.message}`, 'error');
    } else {
      this.showMessage('登录链接已发送到您的邮箱，请查收', 'success');
    }
  }

  async handleGoogleLogin() {
    this.showMessage('正在跳转到Google登录...', 'info');
    const { error } = await this.api.signInWithGoogle();
    
    if (error) {
      this.showMessage(`Google登录失败: ${error.message}`, 'error');
    }
  }

  async handleGitHubLogin() {
    this.showMessage('正在跳转到GitHub登录...', 'info');
    const { error } = await this.api.signInWithGitHub();
    
    if (error) {
      this.showMessage(`GitHub登录失败: ${error.message}`, 'error');
    }
  }

  async handleLogout() {
    const { error } = await this.api.signOut();
    
    if (error) {
      this.showMessage(`退出失败: ${error.message}`, 'error');
    } else {
      this.showMessage('已成功退出登录', 'success');
    }
  }

  showProfileModal() {
    // 创建资料编辑模态框
    const modal = document.createElement('div');
    modal.id = 'profile-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    `;

    modal.innerHTML = `
      <div style="background: #1f2937; border-radius: 12px; padding: 24px; 
                  min-width: 400px; border: 1px solid rgba(255,255,255,0.1);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="margin: 0; color: white; font-size: 18px;">编辑资料</h3>
          <button id="close-profile-modal" style="background: none; border: none; color: white; 
                                                  font-size: 20px; cursor: pointer;">×</button>
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; color: white; margin-bottom: 8px;">用户名</label>
          <input type="text" id="profile-username" value="${this.currentUser?.user_metadata?.full_name || ''}"
                 style="width: 100%; padding: 8px 12px; border: 1px solid rgba(255,255,255,0.2); 
                        border-radius: 6px; background: rgba(255,255,255,0.1); color: white;">
        </div>
        <div style="margin-bottom: 20px;">
          <label style="display: block; color: white; margin-bottom: 8px;">邮箱</label>
          <input type="email" id="profile-email" value="${this.currentUser?.email || ''}" readonly
                 style="width: 100%; padding: 8px 12px; border: 1px solid rgba(255,255,255,0.2); 
                        border-radius: 6px; background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.5);">
        </div>
        <div style="display: flex; gap: 12px;">
          <button id="save-profile-btn" style="flex: 1; padding: 10px; background: #3b82f6; 
                                              color: white; border: none; border-radius: 6px; 
                                              font-weight: 600; cursor: pointer;">
            保存
          </button>
          <button id="cancel-profile-btn" style="flex: 1; padding: 10px; background: rgba(255,255,255,0.1); 
                                                color: white; border: 1px solid rgba(255,255,255,0.2); 
                                                border-radius: 6px; cursor: pointer;">
            取消
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // 绑定模态框事件
    document.getElementById('close-profile-modal').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    document.getElementById('cancel-profile-btn').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    document.getElementById('save-profile-btn').addEventListener('click', async () => {
      const username = document.getElementById('profile-username').value.trim();
      
      if (!username) {
        alert('请输入用户名');
        return;
      }

      const { error } = await this.api.updateProfile({ username });
      
      if (error) {
        alert(`保存失败: ${error.message}`);
      } else {
        alert('资料保存成功');
        document.body.removeChild(modal);
        this.updateUI();
      }
    });
  }

  updateUI() {
    const loginUI = document.getElementById('login-ui');
    const userUI = document.getElementById('user-ui');

    if (this.currentUser) {
      // 已登录状态
      loginUI.style.display = 'none';
      userUI.style.display = 'block';

      // 更新用户信息
      const userName = document.getElementById('user-name');
      const userEmail = document.getElementById('user-email');
      const userAvatar = document.getElementById('user-avatar');

      userName.textContent = this.currentUser.user_metadata?.full_name || 
                           this.currentUser.email?.split('@')[0] || '用户';
      userEmail.textContent = this.currentUser.email || '';
      userAvatar.textContent = (this.currentUser.user_metadata?.full_name || 
                               this.currentUser.email?.split('@')[0] || 'U').charAt(0).toUpperCase();
    } else {
      // 未登录状态
      loginUI.style.display = 'block';
      userUI.style.display = 'none';
      
      // 清空输入框
      document.getElementById('login-email').value = '';
    }
  }

  showMessage(message, type = 'info') {
    const messageEl = document.getElementById('login-message');
    if (!messageEl) return;

    messageEl.textContent = message;
    messageEl.style.display = 'block';
    
    // 设置样式
    messageEl.style.background = type === 'error' ? '#ef4444' : 
                                type === 'success' ? '#10b981' : '#3b82f6';
    messageEl.style.color = 'white';

    // 3秒后自动隐藏
    setTimeout(() => {
      messageEl.style.display = 'none';
    }, 3000);
  }

  // 检查是否已登录
  isAuthenticated() {
    return !!this.currentUser;
  }

  // 获取当前用户
  getCurrentUser() {
    return this.currentUser;
  }
}

// 创建全局实例
window.authComponent = new AuthComponent();
