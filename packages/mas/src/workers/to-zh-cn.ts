import OpenAI from "openai";
import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();

const client = new OpenAI({
  apiKey: "",
  baseURL: "https://api.moonshot.cn/v1",
});

export default async ({ post }) => {
  const TMP_MD_FILE = path.join(cwd, "tmp.md");

  await fs.writeFileSync(TMP_MD_FILE, post, {
    encoding: "utf-8",
  });

  let file_object = await client.files.create({
    file: fs.createReadStream("./tmp.md"),
    purpose: "file-extract" as any,
  });

  let file_content = await (await client.files.content(file_object.id)).text();
  let messages = [
    {
      role: "system",
      content: "你是 Kimi 翻译助手，你擅长内容翻译",
    },
    {
      role: "system",
      content: file_content,
    },
    {
      role: "user",
      content:
        "现在，你接收到的输入是一份 Markdown 格式的文件，请仅仅将该文档中的内容翻译成中文，这意味着你必须严格保留原有的 Markdown 格式进行最后的结果输出",
    },
  ];

  const completion = await client.chat.completions.create({
    model: "moonshot-v1-128k",
    messages: messages as any,
    temperature: 0.3,
  });

  const ret = completion.choices[0].message.content;

  // delete tmp md file
  await fs.unlinkSync(TMP_MD_FILE);

  return ret;
};
