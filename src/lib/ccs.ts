import OpenAI from 'openai';
import type { AnswerType } from '@/types';

// 延迟初始化 CCS API 客户端
let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.CCS_API_KEY;
    if (!apiKey) {
      throw new Error('CCS_API_KEY is not configured');
    }
    client = new OpenAI({
      apiKey,
      baseURL: process.env.CCS_API_ENDPOINT || 'https://api.ccs.ai/v1',
    });
  }
  return client;
}

// 生成历史人物
export async function generateCharacter(existingNames: string[]): Promise<string> {
  const client = getClient();
  const existingList = existingNames.length > 0
    ? `已出现过的名字（不要重复）：${existingNames.join('、')}`
    : '';

  const response = await client.chat.completions.create({
    model: process.env.CCS_MODEL || 'default',
    messages: [{
      role: 'system',
      content: `你是一个中国古代历史专家。随机选择一个中国古代历史人物（真实存在的历史人物，不要虚构人物）。
${existingList}
请只返回人物姓名（2-4个字），不要其他内容。`
    }],
    max_tokens: 20,
  });

  const name = response.choices[0].message.content?.trim() || '李白';

  // 验证是否重复
  if (existingNames.includes(name)) {
    return generateCharacter(existingNames);
  }

  return name;
}

// 获取人物描述
export async function getCharacterDescription(name: string): Promise<string> {
  const client = getClient();
  const response = await client.chat.completions.create({
    model: process.env.CCS_MODEL || 'default',
    messages: [{
      role: 'system',
      content: `请用简洁的语言介绍 ${name} 的主要特征，包括朝代、身份职业、主要成就、性别。控制在50字以内。`
    }],
    max_tokens: 100,
  });

  return response.choices[0].message.content?.trim() || '';
}

// 生成初始提示（给玩家的线索）
export async function generateHints(name: string): Promise<string[]> {
  const client = getClient();
  const response = await client.chat.completions.create({
    model: process.env.CCS_MODEL || 'default',
    messages: [{
      role: 'system',
      content: `为历史人物"${name}"生成3条提示线索，帮助玩家猜测。

要求：
1. 从模糊到具体，循序渐进
2. 每条线索独立，不直接透露名字
3. 线索格式：简短一句话，10-20字
4. 按JSON数组格式返回，例如：["线索1","线索2","线索3"]

示例：
输入：李白
输出：["唐代著名诗人","被誉为诗仙","爱饮酒作诗"]

只返回JSON数组，不要其他内容。`
    }],
    max_tokens: 200,
  });

  const content = response.choices[0].message.content?.trim() || '[]';
  try {
    const hints = JSON.parse(content);
    if (Array.isArray(hints) && hints.length >= 2) {
      return hints.slice(0, 3);
    }
  } catch {
    // 解析失败，返回默认提示
  }
  return ['中国古代历史人物'];
}

// 判断用户问题
export async function judgeAnswer(
  characterName: string,
  characterDesc: string,
  question: string
): Promise<AnswerType> {
  const client = getClient();
  const response = await client.chat.completions.create({
    model: process.env.CCS_MODEL || 'default',
    messages: [{
      role: 'system',
      content: `你是一个判断者。根据以下人物信息回答用户问题。

人物：${characterName}
特征：${characterDesc}

用户问题：${question}

规则：
1. 如果用户猜出了人物名字，回答"猜对了"
2. 如果问题符合人物特征，回答"是"
3. 如果问题不符合人物特征，回答"不是"
4. 如果无法确定，回答"不确定"
5. 如果问题与人物无关，回答"无关"

只回答这五个选项之一，不要有其他内容。`
    }],
    max_tokens: 10,
  });

  const answer = response.choices[0].message.content?.trim() as AnswerType;

  const validAnswers: AnswerType[] = ['是', '不是', '不确定', '无关', '猜对了'];
  if (validAnswers.includes(answer)) {
    return answer;
  }

  return '不确定';
}
