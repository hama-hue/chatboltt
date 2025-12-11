// lib/ai/providers.ts

import OpenAI from "openai";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { isTestEnvironment } from "../constants";

// ---------- PROVIDER CLIENTS (DIRECT, NO GATEWAY) ----------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const deepseek = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const grok = new OpenAI({
  baseURL: "https://api.x.ai/v1",
  apiKey: process.env.GROK_API_KEY,
});

// ---------- MODEL ASSIGNMENTS (YOUR CHOICES) ----------
const modelMap = {
  "chat-model": {
    client: grok,
    modelId: "grok-2-latest",
  },
  "chat-model-reasoning": {
    client: openai,
    modelId: "o3-mini",
  },
  "title-model": {
    client: deepseek,
    modelId: "deepseek-chat",
  },
  "artifact-model": {
    client: grok,
    modelId: "grok-2-latest",
  },
};

// ---------- PROVIDER DEFINITION ----------
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
          providerId: "grok-direct",
          modelId: modelMap["chat-model"].modelId,
          client: modelMap["chat-model"].client,
        },

        "chat-model-reasoning": wrapLanguageModel({
          model: {
            providerId: "openai-direct",
            modelId: modelMap["chat-model-reasoning"].modelId,
            client: modelMap["chat-model-reasoning"].client,
          },
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),

        "title-model": {
          providerId: "deepseek-direct",
          modelId: modelMap["title-model"].modelId,
          client: modelMap["title-model"].client,
        },

        "artifact-model": {
          providerId: "grok-direct",
          modelId: modelMap["artifact-model"].modelId,
          client: modelMap["artifact-model"].client,
        },
      },
    });
