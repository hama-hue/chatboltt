// lib/ai/providers.ts

import OpenAI from "openai";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { isTestEnvironment } from "../constants";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Optional: map your model IDs to real OpenAI models
const modelMap = {
  "chat-model": "gpt-4o-mini",
  "chat-model-reasoning": "o3-mini",
  "title-model": "gpt-4o-mini",
  "artifact-model": "gpt-4o-mini",
};

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
        "chat-model": {
          providerId: "openai-direct",
          modelId: modelMap["chat-model"],
          client: openai,
        },

        // Add reasoning middleware
        "chat-model-reasoning": wrapLanguageModel({
          model: {
            providerId: "openai-direct",
            modelId: modelMap["chat-model-reasoning"],
            client: openai,
          },
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),

        "title-model": {
          providerId: "openai-direct",
          modelId: modelMap["title-model"],
          client: openai,
        },

        "artifact-model": {
          providerId: "openai-direct",
          modelId: modelMap["artifact-model"],
          client: openai,
        },
      },
    });
