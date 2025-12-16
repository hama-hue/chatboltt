import { gateway } from "@ai-sdk/gateway";
import { groq } from "@ai-sdk/groq";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
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
  : customProvider({
      languageModels: {
        // MAIN CHAT (FREE)
        "chat-model": groq("llama-3.1-8b-instant"),

        // REASONING MODEL (FREE)
        "chat-model-reasoning": wrapLanguageModel({
          model: groq("mixtral-8x7b-32768"),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),

        // TITLES
        "title-model": groq("llama-3.1-8b-instant"),

        // ARTIFACTS
        "artifact-model": groq("llama-3.1-8b-instant"),
      },
    });
