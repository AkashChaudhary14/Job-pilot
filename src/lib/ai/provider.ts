import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

export function getModel(): LanguageModel | null {
  const modelOverride = process.env.AI_MODEL?.trim();

  if (process.env.OPENAI_API_KEY) {
    return openai(modelOverride ?? "gpt-4.1");
  }

  if (process.env.ANTHROPIC_API_KEY) {
    return anthropic(modelOverride ?? "claude-sonnet-4-5");
  }

  return null;
}

export function hasAiProvider(): boolean {
  return Boolean(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY);
}
