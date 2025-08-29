// Supabase 配置
// 注意：在生产环境中，这些值应该从环境变量获取
// 由于是静态站点，这里直接配置（RLS会保护数据安全）

const SUPABASE_CONFIG = {
  // 你的 Supabase 项目 URL
  url: 'https://ebbitzscqizogrfyfklh.supabase.co',
  // 你的 Supabase anon key（公开密钥，安全）
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViYml0enNjcWl6b2dyZnlma2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NDAzNTMsImV4cCI6MjA3MjAxNjM1M30.f0gSCCHJ_sEFV9R6IGOcr3CYnaVrZsnIxP3VDFP_RZM'
};

// 初始化 Supabase 客户端
const supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// 导出配置供其他模块使用
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
window.supabaseClient = supabase;
