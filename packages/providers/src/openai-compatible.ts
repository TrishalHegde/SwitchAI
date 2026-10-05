import OpenAI from "openai";

import type {
  AIProvider,
} from "./provider.js";

import type {
  ChatRequest,
  ChatResponse,
  ModelInfo,
  ProviderConfig,
} from "./types.js";

export class OpenAICompatibleProvider implements AIProvider {
  readonly config: ProviderConfig;

  private readonly client: OpenAI;

  constructor(config: ProviderConfig) {
    this.config = config;

    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseUrl,
    });
  }

  async listModels(): Promise<ModelInfo[]> {
    const response = await this.client.models.list();

    return response.data.map((model) => ({
      id: model.id,
      providerId: this.config.id,
      name: model.id,
      capabilities: [],
      free: false,
    }));
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    const response = await this.client.chat.completions.create({
      model: request.model,
      messages: request.messages,
      temperature: request.temperature,
      max_tokens: request.maxTokens,
    });

    const choice = response.choices[0];

    return {
      id: response.id,
      provider: this.config.id,
      model: response.model,
      content: choice?.message?.content ?? "",
      usage: response.usage
        ? {
            promptTokens: response.usage.prompt_tokens,
            completionTokens: response.usage.completion_tokens,
            totalTokens: response.usage.total_tokens,
          }
        : undefined,
    };
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.client.models.list();
      return true;
    } catch {
      return false;
    }
  }
}