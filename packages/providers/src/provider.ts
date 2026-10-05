import type {
  ChatRequest,
  ChatResponse,
  ModelInfo,
  ProviderConfig,
} from "./types.js";

export interface AIProvider {
  readonly config: ProviderConfig;

  listModels(): Promise<ModelInfo[]>;

  chat(request: ChatRequest): Promise<ChatResponse>;

  healthCheck(): Promise<boolean>;
}