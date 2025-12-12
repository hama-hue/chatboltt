import { customProvider } from "ai";
import OpenAI from "openai";
import { xAI } from "@ai-sdk/xai";
import DeepSeek from "@ai-sdk/deepseek";
import { extractReasoningMiddleware, wrapLanguageModel } from "ai";
import { isTestEnvironment } from "../constants";

export const myProvider = isTestEnvironment
  ? (() => {
      const {
        artifactModel,
        chatModel,
        reasoningModel,
        titleModel,
      } = require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "chat-model-reasoning": reasoningModel,
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      });
    })()
  : (() => {
      const xai = new xAI({
        apiKey: process.env.XAI_API_KEY!,
      });

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY!,
      });

      const deepseek = new DeepSeek({
        apiKey: process.env.DEEPSEEK_API_KEY!,
      });

      return customProvider({
        languageModels: {
          // ➤ Main chat model (Grok)
          "chat-model": xai.languageModel("grok-2-latest"),

          // ➤ Reasoning model (GPT)
          "chat-model-reasoning": wrapLanguageModel({
            model: openai.languageModel("gpt-4o"), // latest reasoning-capable
            middleware: extractReasoningMiddleware({ tagName: "think" }),
          }),

          // ➤ Title model (DeepSeek)
          "title-model": deepseek.languageModel("deepseek-chat"),

          // ➤ Artifact model (Grok)
          "artifact-model": xai.languageModel("grok-2-latest"),
        },
      });
    })();
