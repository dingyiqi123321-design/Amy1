# Supabase MCP 安全配置文档

## 项目信息
- **项目名称**: hpfqiwenlzqdiltanuxu
- **项目URL**: https://hpfqiwenlzqdiltanuxu.supabase.co
- **配置模式**: 只读模式 + 项目范围限制

## 安全设置

### 1. 只读模式 (Read-Only Mode)
- ✅ **启用状态**: 已启用
- **配置位置**: `.cursor/mcp.json` 中的 `SUPABASE_READ_ONLY: "true"`
- **作用**: 所有数据库查询都以只读用户身份执行，防止意外的数据修改

### 2. 项目范围限制 (Project Scoping)
- ✅ **启用状态**: 已启用
- **配置位置**: `.cursor/mcp.json` 中的 `SUPABASE_PROJECT_REF`
- **作用**: 限制MCP服务器只能访问指定项目的资源

### 3. 环境变量隔离
- ✅ **项目级配置**: `.env.local` 文件
- **隔离范围**: 仅当前项目有效
- **安全措施**: 敏感信息不会影响其他项目

## 安全最佳实践

根据Supabase官方文档建议 <mcreference link="https://supabase.com/docs/guides/getting-started/mcp" index="0">0</mcreference>，本配置遵循以下安全原则：

1. **不连接生产环境**: 当前配置适用于开发环境
2. **只读权限**: 防止意外的数据修改操作
3. **项目范围限制**: 只能访问指定项目资源
4. **功能组控制**: 可以启用/禁用特定工具组

## 配置验证

### MCP服务器配置检查清单:
- [x] MCP配置文件已创建 (`.cursor/mcp.json`)
- [x] 环境变量已设置 (`.env.local`)
- [x] 只读模式已启用
- [x] 项目范围已限制
- [x] 访问令牌已配置
- [x] 项目URL已设置

## 使用说明

1. **重启Claude Code**: 配置生效需要重启IDE
2. **验证连接**: 可以尝试使用自然语言查询数据库
3. **安全提醒**: 当前为只读模式，无法执行写操作

## 故障排除

如果MCP连接出现问题，请检查：
1. 访问令牌是否有效
2. 项目URL是否正确
3. 网络连接是否正常
4. Claude Code是否已重启

## 配置文件位置

```
ai2/
├── .cursor/
│   ├── mcp.json              # MCP服务器配置
│   └── mcp-security.md       # 安全配置文档
├── .env.local                # 项目环境变量
└── ...
```