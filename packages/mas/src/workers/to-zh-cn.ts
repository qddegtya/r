import OpenAI from "openai";
import { marked } from "marked";
import TurndownService from "turndown";

const client = new OpenAI({
  apiKey: process.env.MOONSHOT_API_KEY || "",
  baseURL: "https://api.moonshot.cn/v1",
});

const sleep = (ms) => {
  return new Promise((a, _) => {
    setTimeout(a, ms);
  });
};

export default async ({ post }) => {
  const translations = [] as any;
  const tokens = marked.lexer(post);
  let context = "";

  marked.walkTokens(tokens, (token) => {
    if (token.type === "text") {
      translations.push(async () => {
        const completion = await client.chat.completions.create({
          model: "moonshot-v1-128k",
          messages: [
            {
              role: "system",
              content:
                "你是一个专业的翻译助手，请将给定的英文文本翻译成中文。保持原文的语气和风格，确保翻译的准确性和流畅性。",
            },
            {
              role: "user",
              content: `请翻译以下文本，并参考之前的上下文：\n\n上下文：${context}\n\n待翻译文本：${token.text}`,
            },
          ],
          temperature: 0.3
        });

        const ret = completion.choices[0].message.content;

        console.log(`translation result: ${ret}`);

        // token.raw = ret;
        token.text = ret;

        // 更新上下文
        context += ret;
      });
    }
  });

  // rate control
  for (let translationTask of translations) {
    await translationTask();
  }

  const html = marked.parser(tokens);

  const turndownService = new TurndownService();
  const markdown = await turndownService.turndown(html);

  return markdown;
};
