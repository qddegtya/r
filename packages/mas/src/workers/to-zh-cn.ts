import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const chatModel = new ChatOpenAI({
  model: "gpt-4o-mini"
});

export default async ({ post }) => {
  const template =
    "You will be provided with a sentence in {input_language}, and your task is to translate it into {output_language}.";
  const humanTemplate = "{text}";

  const chatPrompt = ChatPromptTemplate.fromMessages([
    ["system", template],
    ["human", humanTemplate],
  ]);

  const translatePrompt = await chatPrompt.formatMessages({
    input_language: "English",
    output_language: "Chinese",
    text: "I love programming.",
  });

  console.log(translatePrompt);

  const response = await chatModel.invoke(translatePrompt, {
    timeout: 5000,
  });

  console.log(response);

  return post;
};
