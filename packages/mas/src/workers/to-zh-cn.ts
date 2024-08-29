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

  marked.walkTokens(tokens, (token) => {
    if (token.type === "text") {
      translations.push(async () => {
        const completion = await client.chat.completions.create({
          model: "moonshot-v1-128k",
          messages: [
            {
              role: "system",
              content:
                "You will be provided with a sentence in English, and your task is to translate it into Chinese.",
            },
            {
              role: "user",
              content: token.text,
            },
          ],
          temperature: 0.3,
        });

        const ret = completion.choices[0].message.content;

        console.log(`translation result: ${ret}`);

        // token.raw = ret;
        token.text = ret;
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
