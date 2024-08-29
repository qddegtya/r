const OpenAI = require("openai");
const fs = require("fs");

const client = new OpenAI({
  apiKey: "",
  baseURL: "https://api.moonshot.cn/v1",
});

export default async ({ post }) => {
  await fs.writeFileSync("./tmp.md", post, {
    encoding: "utf-8",
  });

  let file_object = await client.files.create({
    file: fs.createReadStream("./tmp.md"),
    purpose: "file-extract",
  });

  // 获取结果
  // file_content = client.files.retrieve_content(file_id=file_object.id)
  // 注意，之前 retrieve_content api 在最新版本标记了 warning, 可以用下面这行代替
  // 如果是旧版本，可以用 retrieve_content
  let file_content = await (await client.files.content(file_object.id)).text();

  // 把它放进请求中
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
    messages: messages,
    temperature: 0.3,
  });

  const ret = completion.choices[0].message.content;

  return ret;
};
