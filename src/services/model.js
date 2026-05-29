/**
 * Model Service - Singleton model manager
 * Loads QVAC models once and provides them to all agents
 */

import {loadModel, unloadModel, completion, embed, QWEN3_1_7B_INST_Q4, GTE_LARGE_FP16} from '@qvac/sdk';

class ModelService {
  constructor() {
    this.llmModelId = null;
    this.embedModelId = null;
    this.isLoading = false;
    this.isReady = false;
  }

  /**
   * Initialize models (call once at startup)
   */
  async initialize() {
    if (this.isReady) {
      console.log('✅ Models already loaded');
      return;
    }

    if (this.isLoading) {
      console.log('⏳ Models are loading...');
      return;
    }

    this.isLoading = true;
    console.log('🧠 Loading AI models...');

    try {
      // Load LLM model
      console.log('📦 Loading LLM model (QWEN3_1_7B)...');
      this.llmModelId = await loadModel({
        modelSrc: QWEN3_1_7B_INST_Q4,
        modelType: 'llm',
        modelConfig: {
          ctx_size: 4096,
        },
        onProgress: (progress) => {
          process.stdout.write(`\r   LLM: ${progress.percentage.toFixed(1)}%`);
        },
      });
      console.log(`\n✅ LLM model loaded: ${this.llmModelId}`);

      // Load Embeddings model
      console.log('📦 Loading Embeddings model (GTE_LARGE)...');
      this.embedModelId = await loadModel({
        modelSrc: GTE_LARGE_FP16,
        modelType: 'embeddings',
        onProgress: (progress) => {
          process.stdout.write(`\r   Embeddings: ${progress.percentage.toFixed(1)}%`);
        },
      });
      console.log(`\n✅ Embeddings model loaded: ${this.embedModelId}`);

      this.isReady = true;
      console.log('✅ All models ready!\n');
    } catch (error) {
      console.error('❌ Failed to load models:', error.message);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Generate text completion
   */
  async complete(history, options = {}) {
    if (!this.isReady) {
      throw new Error('Models not initialized. Call initialize() first.');
    }

    const result = completion({
      modelId: this.llmModelId,
      history,
      stream: options.stream !== false,
      ...options,
    });

    return result;
  }

  /**
   * Generate embeddings
   */
  async getEmbedding(text) {
    if (!this.isReady) {
      throw new Error('Models not initialized. Call initialize() first.');
    }

    const {embedding} = await embed({
      modelId: this.embedModelId,
      text,
    });

    return embedding;
  }

  /**
   * Cleanup models
   */
  async cleanup() {
    console.log('🧹 Cleaning up models...');

    if (this.llmModelId) {
      await unloadModel({modelId: this.llmModelId});
      console.log('✅ LLM model unloaded');
      this.llmModelId = null;
    }

    if (this.embedModelId) {
      await unloadModel({modelId: this.embedModelId});
      console.log('✅ Embeddings model unloaded');
      this.embedModelId = null;
    }

    this.isReady = false;
  }

  /**
   * Check if models are ready
   */
  getStatus() {
    return {
      isReady: this.isReady,
      isLoading: this.isLoading,
      llmModelId: this.llmModelId,
      embedModelId: this.embedModelId,
    };
  }
}

// Singleton instance
const modelService = new ModelService();

export default modelService;
