# JWT密钥生成指南

## 🚀 快速生成

### 已为您生成的密钥（64位高强度）
```
smPXXkmMKss7yunfLK7bvwkPOOTc7Elu0aMX697pGm6cDsDcxceWrqjmUpa9aTpQWeHRxIUY5ErqZrxXx/oaXQ==
```

### 32位标准密钥
```
HpCbGVKllBSoQsIPjTsOgANHx4BX/HBcoRzjQyKVWG4=
```

## 🔧 不同平台的生成方法

### Linux/Mac (推荐)
```bash
# 32位密钥
openssl rand -base64 32

# 64位密钥（推荐）
openssl rand -base64 64

# 128位密钥（最高安全级别）
openssl rand -base64 128
```

### Windows PowerShell
```powershell
# 32位密钥
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})

# 64位密钥
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})

# 生成Base64格式的密钥
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes(-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})))
```

### Windows CMD (使用certutil)
```cmd
# 生成随机字节并转换为Base64
certutil -encode -f NUL random.bin 2>nul && certutil -decode -f random.bin random.txt 2>nul && type random.txt && del random.bin random.txt 2>nul
```

### Node.js脚本
```javascript
// 生成JWT密钥脚本
const crypto = require('crypto');

function generateJWTKey(length = 64) {
  return crypto.randomBytes(length).toString('base64');
}

console.log('32位密钥:', generateJWTKey(32));
console.log('64位密钥:', generateJWTKey(64));
console.log('128位密钥:', generateJWTKey(128));
}

generateJWTKey();
```

### Python脚本
```python
import secrets
import base64

def generate_jwt_key(length=64):
    """生成JWT密钥"""
    random_bytes = secrets.token_bytes(length)
    return base64.b64encode(random_bytes).decode('utf-8')

print("32位密钥:", generate_jwt_key(32))
print("64位密钥:", generate_jwt_key(64))
print("128位密钥:", generate_jwt_key(128))
```

## 📝 使用说明

### 1. 复制生成的密钥
选择上面生成的任意一个密钥，复制到您的环境变量中。

### 2. 配置环境变量

#### 在 `.env.production` 文件中：
```env
NEXTAUTH_SECRET=smPXXkmMKss7yunfLK7bvwkPOOTc7Elu0aMX697pGm6cDsDcxceWrqjmUpa9aTpQWeHRxIUY5ErqZrxXx/oaXQ==
```

#### 在 Vercel 控制台中：
1. 进入项目设置
2. 选择 "Environment Variables"
3. 添加新的环境变量：
   - 名称：`NEXTAUTH_SECRET`
   - 值：生成的密钥
   - 环境：`Production`

### 3. 验证配置
```bash
# 检查环境变量是否正确设置
vercel env ls

# 重新部署应用
vercel --prod
```

## 🔒 安全建议

### 密钥管理最佳实践
1. **生成新的密钥**：每次部署都要生成新的密钥
2. **足够长度**：推荐使用64位或更长的密钥
3. **随机性**：使用加密安全的随机数生成器
4. **保密性**：不要将密钥提交到代码仓库
5. **定期更换**：定期轮换密钥以提高安全性

### 生产环境注意事项
- 使用强随机密钥生成器
- 将密钥存储在安全的环境变量中
- 限制对环境变量的访问权限
- 定期审计密钥使用情况
- 在密钥泄露时立即更换

## 🚨 重要提醒

⚠️ **不要**使用示例中的密钥进行生产部署
⚠️ **不要**将密钥硬编码在代码中
⚠️ **不要**将密钥提交到Git仓库
⚠️ **不要**在不同的环境中使用相同的密钥

## 🔧 故障排除

### 常见问题
1. **密钥无效**：确保使用Base64格式
2. **认证失败**：检查密钥长度和格式
3. **部署错误**：验证环境变量是否正确设置

### 验证密钥格式
```bash
# 检查Base64格式
echo "your-key" | base64 -d

# 验证密钥强度
openssl rand -base64 64 | wc -c
```

## 🎯 完成

现在您已经有了安全的JWT密钥，可以将其配置到您的Vercel部署中。密钥已准备就绪，祝部署顺利！ 🚀

## 📋 快速参考

### 推荐密钥（64位）
```
smPXXkmMKss7yunfLK7bvwkPOOTc7Elu0aMX697pGm6cDsDcxceWrqjmUpa9aTpQWeHRxIUY5ErqZrxXx/oaXQ==
```

### 备用密钥（32位）
```
HpCbGVKllBSoQsIPjTsOgANHx4BX/HBcoRzjQyKVWG4=
```

**复制其中一个密钥，立即开始部署！**