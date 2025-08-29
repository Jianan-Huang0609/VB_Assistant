// Supabase API 服务层
// 提供认证、PoC项目和ToDo项目的CRUD操作

class SupabaseAPI {
  constructor() {
    this.supabase = window.supabaseClient;
    this.currentUser = null;
    this.init();
  }

  async init() {
    // 监听认证状态变化
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        this.currentUser = session.user;
        this.createProfileIfNotExists(session.user);
        this.onAuthChange?.(true, session.user);
      } else if (event === 'SIGNED_OUT') {
        this.currentUser = null;
        this.onAuthChange?.(false, null);
      }
    });

    // 获取当前会话
    const { data: { session } } = await this.supabase.auth.getSession();
    if (session) {
      this.currentUser = session.user;
      this.createProfileIfNotExists(session.user);
    }
  }

  // 认证相关方法
  async signInWithEmail(email) {
    const { error } = await this.supabase.auth.signInWithOtp({ 
      email,
      options: {
        emailRedirectTo: 'https://jianan-huang0609.github.io/VB_Assistant/auth-callback.html'
      }
    });
    return { error };
  }

  async signInWithGoogle() {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://jianan-huang0609.github.io/VB_Assistant/auth-callback.html'
      }
    });
    return { error };
  }

  async signInWithGitHub() {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: 'https://jianan-huang0609.github.io/VB_Assistant/auth-callback.html'
      }
    });
    return { error };
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    return { error };
  }

  async getCurrentUser() {
    const { data: { user }, error } = await this.supabase.auth.getUser();
    return { user, error };
  }

  // 用户资料管理
  async createProfileIfNotExists(user) {
    const { data: existingProfile } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!existingProfile) {
      await this.supabase.from('profiles').insert({
        id: user.id,
        username: user.email?.split('@')[0] || user.user_metadata?.full_name || 'User'
      });
    }
  }

  async updateProfile(updates) {
    const { data, error } = await this.supabase
      .from('profiles')
      .update(updates)
      .eq('id', this.currentUser.id)
      .select()
      .single();
    return { data, error };
  }

  // PoC项目相关方法
  async createPocProject(projectData) {
    if (!this.currentUser) throw new Error('用户未登录');

    const { data, error } = await this.supabase
      .from('poc_projects')
      .insert({
        ...projectData,
        owner: this.currentUser.id
      })
      .select()
      .single();
    return { data, error };
  }

  async getPocProjects(filters = {}) {
    if (!this.currentUser) throw new Error('用户未登录');

    let query = this.supabase
      .from('poc_projects')
      .select('*')
      .eq('owner', this.currentUser.id)
      .order('created_at', { ascending: false });

    // 应用过滤器
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.techStack) {
      query = query.contains('tech_stack', [filters.techStack]);
    }
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    return { data, error };
  }

  async updatePocProject(id, updates) {
    if (!this.currentUser) throw new Error('用户未登录');

    const { data, error } = await this.supabase
      .from('poc_projects')
      .update(updates)
      .eq('id', id)
      .eq('owner', this.currentUser.id)
      .select()
      .single();
    return { data, error };
  }

  async deletePocProject(id) {
    if (!this.currentUser) throw new Error('用户未登录');

    const { error } = await this.supabase
      .from('poc_projects')
      .delete()
      .eq('id', id)
      .eq('owner', this.currentUser.id);
    return { error };
  }

  // ToDo项目相关方法
  async createTodoProject(projectData) {
    if (!this.currentUser) throw new Error('用户未登录');

    const { data, error } = await this.supabase
      .from('todo_projects')
      .insert({
        ...projectData,
        owner: this.currentUser.id
      })
      .select()
      .single();
    return { data, error };
  }

  async getTodoProjects() {
    if (!this.currentUser) throw new Error('用户未登录');

    const { data, error } = await this.supabase
      .from('todo_projects')
      .select('*')
      .eq('owner', this.currentUser.id)
      .order('created_at', { ascending: false });
    return { data, error };
  }

  async updateTodoProject(id, updates) {
    if (!this.currentUser) throw new Error('用户未登录');

    const { data, error } = await this.supabase
      .from('todo_projects')
      .update(updates)
      .eq('id', id)
      .eq('owner', this.currentUser.id)
      .select()
      .single();
    return { data, error };
  }

  async deleteTodoProject(id) {
    if (!this.currentUser) throw new Error('用户未登录');

    const { error } = await this.supabase
      .from('todo_projects')
      .delete()
      .eq('id', id)
      .eq('owner', this.currentUser.id);
    return { error };
  }

  // ToDo任务相关方法
  async createTodoTask(taskData) {
    if (!this.currentUser) throw new Error('用户未登录');

    const { data, error } = await this.supabase
      .from('todo_tasks')
      .insert({
        ...taskData,
        owner: this.currentUser.id
      })
      .select()
      .single();
    return { data, error };
  }

  async getTodoTasks(projectId, filters = {}) {
    if (!this.currentUser) throw new Error('用户未登录');

    let query = this.supabase
      .from('todo_tasks')
      .select('*')
      .eq('project_id', projectId)
      .eq('owner', this.currentUser.id)
      .order('created_at', { ascending: false });

    // 应用过滤器
    if (filters.phase) {
      query = query.eq('phase', filters.phase);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    return { data, error };
  }

  async updateTodoTask(id, updates) {
    if (!this.currentUser) throw new Error('用户未登录');

    const { data, error } = await this.supabase
      .from('todo_tasks')
      .update(updates)
      .eq('id', id)
      .eq('owner', this.currentUser.id)
      .select()
      .single();
    return { data, error };
  }

  async deleteTodoTask(id) {
    if (!this.currentUser) throw new Error('用户未登录');

    const { error } = await this.supabase
      .from('todo_tasks')
      .delete()
      .eq('id', id)
      .eq('owner', this.currentUser.id);
    return { error };
  }

  // 文件上传相关方法
  async uploadFile(file, projectId, projectType) {
    if (!this.currentUser) throw new Error('用户未登录');

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${this.currentUser.id}/${projectType}/${projectId}/${fileName}`;

    // 上传到 Supabase Storage
    const { data: uploadData, error: uploadError } = await this.supabase.storage
      .from('vb-assistant')
      .upload(filePath, file);

    if (uploadError) return { error: uploadError };

    // 记录到数据库
    const { data, error } = await this.supabase
      .from('file_uploads')
      .insert({
        owner: this.currentUser.id,
        project_id: projectId,
        project_type: projectType,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type
      })
      .select()
      .single();

    return { data, error };
  }

  async getFileUrl(filePath) {
    const { data } = this.supabase.storage
      .from('vb-assistant')
      .getPublicUrl(filePath);
    return data.publicUrl;
  }

  // 数据导出方法
  async exportPocProjects() {
    const { data, error } = await this.getPocProjects();
    if (error) return { error };

    const csv = this.convertToCSV(data, [
      'name', 'description', 'status', 'tech_stack', 'priority', 
      'start_date', 'end_date', 'progress', 'created_at'
    ]);
    return { data: csv };
  }

  async exportTodoTasks(projectId) {
    const { data, error } = await this.getTodoTasks(projectId);
    if (error) return { error };

    const csv = this.convertToCSV(data, [
      'title', 'description', 'phase', 'priority', 'status', 
      'estimated_hours', 'actual_hours', 'due_date', 'created_at'
    ]);
    return { data: csv };
  }

  // 工具方法
  convertToCSV(data, fields) {
    if (!data || data.length === 0) return '';

    const headers = fields.join(',');
    const rows = data.map(item => 
      fields.map(field => {
        const value = item[field];
        if (Array.isArray(value)) {
          return `"${value.join(';')}"`;
        }
        return value ? `"${value}"` : '""';
      }).join(',')
    );

    return [headers, ...rows].join('\n');
  }

  // 设置认证状态变化回调
  setAuthChangeCallback(callback) {
    this.onAuthChange = callback;
  }
}

// 创建全局实例
window.supabaseAPI = new SupabaseAPI();
