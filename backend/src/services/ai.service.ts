import { LearningMode } from '@ai-learning/shared';
import { config } from '../config';
import { getSystemPrompt } from '../config/learning-mode.prompts';

export interface AiChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface OpenAiChoice {
  message?: { content?: string };
}

interface OpenAiResponse {
  choices?: OpenAiChoice[];
  error?: { message?: string };
}

const MODE_TEMPERATURE: Record<LearningMode, number> = {
  [LearningMode.Explanation]: 0.7,
  [LearningMode.Practice]: 0.8,
  [LearningMode.Exam]: 0.5,
  [LearningMode.Hint]: 0.6,
};

export class AiService {
  async generateReply(
    subject: string,
    mode: LearningMode,
    history: AiChatMessage[],
  ): Promise<string> {
    if (!config.openaiApiKey) {
      return this.mockReply(subject, mode, history);
    }

    return this.openAiReply(subject, mode, history);
  }

  private async openAiReply(
    subject: string,
    mode: LearningMode,
    history: AiChatMessage[],
  ): Promise<string> {
    const systemPrompt = getSystemPrompt(subject, mode);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: config.openaiModel,
        messages: [{ role: 'system', content: systemPrompt }, ...history],
        temperature: MODE_TEMPERATURE[mode],
        max_tokens: 1024,
      }),
    });

    const data = (await response.json()) as OpenAiResponse;

    if (!response.ok) {
      throw new Error(data.error?.message ?? `OpenAI API error (${response.status})`);
    }

    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error('OpenAI returned an empty response');
    }

    return content;
  }

  private mockReply(
    subject: string,
    mode: LearningMode,
    history: AiChatMessage[],
  ): Promise<string> {
    const lastUserMessage = [...history].reverse().find((m) => m.role === 'user');
    const question = lastUserMessage?.content ?? 'your question';

    const modeResponses: Record<LearningMode, string> = {
      [LearningMode.Explanation]: `[Explanation Mode]\n\nLet me explain **${subject}** simply:\n\n"${question}" relates to a core concept in this subject. Think of it step by step: (1) identify the key idea, (2) connect it to what you already know, (3) apply it with a simple example. Would you like me to go deeper on any step?`,

      [LearningMode.Practice]: `[Practice Mode]\n\nHere's a practice exercise on **${subject}**:\n\n**Exercise 1:** Based on "${question}", write a short answer explaining the main concept in your own words.\n\n**Exercise 2:** Create one real-world example that demonstrates this idea.\n\nTry these first — I'll review your answers when you're ready!`,

      [LearningMode.Exam]: `[Exam Mode]\n\n**Question 1 of 3** (${subject})\n\nExplain the concept related to: "${question}"\n\nYou have 5 minutes. Provide your answer when ready. I will evaluate and proceed to the next question.`,

      [LearningMode.Hint]: `[Hint Mode]\n\nI won't give the full answer, but here's a hint for **${subject}**:\n\nThink about what "${question}" is really asking. What is the first small step you could take? Try breaking the problem into two parts and focus on the easier one first.`,
    };

    const reply =
      `[Mock AI — set OPENAI_API_KEY to enable real responses]\n\n` + modeResponses[mode];

    return Promise.resolve(reply);
  }
}
