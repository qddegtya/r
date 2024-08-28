import puppeteer from "puppeteer";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import TurndownService from "turndown";

export default async ({ url }) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);
  const content = await page.content();

  const doc = new JSDOM(content);
  const reader = new Readability(doc.window.document);
  const article = reader.parse();

  const turndownService = new TurndownService();
  const markdown = await turndownService.turndown(article?.content);

  return markdown;
};
