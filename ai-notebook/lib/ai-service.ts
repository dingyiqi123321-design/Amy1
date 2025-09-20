import { getApiKey } from './storage';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'deepseek/deepseek-chat';

interface GenerateResult {
  title: string;
  summary: string;
}

export async function callOpenRouter(
  content: string, 
  type: 'generate' | 'chat'
): Promise<GenerateResult | string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API密钥未配置');
  }

  let prompt: string;
  
  if (type === 'generate') {
    prompt = `请为以下笔记内容生成一个不超过10个字的标题和一段50字以内的摘要。请以JSON格式返回，格式为：{"title": "标题", "summary": "摘要"}\n\n笔记内容：\n${content}`;
  } else {
    prompt = content;
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'AI Notebook'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: type === 'generate' 
              ? '你是一个专业的笔记助手，擅长为笔记生成简洁准确的标题和摘要。'
              : '你是一个智能助手，能够基于用户的笔记内容回答问题。请用中文回答。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: type === 'generate' ? 200 : 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API请求失败: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;
    
    if (!result) {
      throw new Error('API返回数据格式错误');
    }

    if (type === 'generate') {
      try {
        // 尝试解析JSON响应
        const parsed = JSON.parse(result);
        if (parsed.title && parsed.summary) {
          return {
            title: parsed.title.substring(0, 20), // 限制标题长度
            summary: parsed.summary.substring(0, 100) // 限制摘要长度
          };
        }
      } catch (parseError) {
        // 如果JSON解析失败，使用默认值
        console.warn('AI返回格式不正确，使用默认值');
      }
      
      // 如果解析失败，返回默认值
      return {
        title: '新笔记',
        summary: '暂无摘要'
      };
    }

    return result;
  } catch (error) {
    console.error('AI服务调用失败:', error);
    
    if (type === 'generate') {
      return {
        title: '新笔记',
        summary: '暂无摘要'
      };
    }
    
    throw error;
  }
}