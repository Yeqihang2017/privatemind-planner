/**
 * PrivateMind Planner - Main Entry Point
 * Local AI Life Planner using QVAC SDK
 */

import {loadModel, unloadModel, completion, embed, QWEN3_1_7B_INST_Q4, GTE_LARGE_FP16} from '@qvac/sdk';

// Model IDs (will be set after loading)
let llmModelId = null;
let embedModelId = null;

/**
 * Load AI models
 */
async function initializeModels() {
  console.log('🧠 Loading AI models...');

  // Load LLM model
  console.log('📦 Loading LLM model (QWEN3_1_7B)...');
  llmModelId = await loadModel({
    modelSrc: QWEN3_1_7B_INST_Q4,
    modelType: 'llm',
    modelConfig: {
      ctx_size: 4096,
    },
    onProgress: (progress) => {
      process.stdout.write(`\r   LLM: ${progress.percentage.toFixed(1)}%`);
    },
  });
  console.log(`\n✅ LLM model loaded: ${llmModelId}`);

  // Load Embeddings model
  console.log('📦 Loading Embeddings model (GTE_LARGE)...');
  embedModelId = await loadModel({
    modelSrc: GTE_LARGE_FP16,
    modelType: 'embeddings',
    onProgress: (progress) => {
      process.stdout.write(`\r   Embeddings: ${progress.percentage.toFixed(1)}%`);
    },
  });
  console.log(`\n✅ Embeddings model loaded: ${embedModelId}`);
}

/**
 * Test basic completion
 */
async function testCompletion() {
  console.log('\n🤖 Testing completion...');

  const result = completion({
    modelId: llmModelId,
    history: [
      {
        role: 'user',
        content: 'Hello! Who are you?',
      },
    ],
    stream: true,
  });

  process.stdout.write('AI: ');
  for await (const token of result.tokenStream) {
    process.stdout.write(token);
  }
  console.log('\n');
}

/**
 * Test embeddings
 */
async function testEmbeddings() {
  console.log('🔢 Testing embeddings...');

  const {embedding} = await embed({
    modelId: embedModelId,
    text: 'Hello, this is a test',
  });

  console.log(`✅ Embedding generated: ${embedding.length} dimensions`);
  console.log(`   First 5 values: [${embedding.slice(0, 5).map(v => v.toFixed(4)).join(', ')}...]`);
}

/**
 * Cleanup models
 */
async function cleanup() {
  console.log('\n🧹 Cleaning up...');
  if (llmModelId) {
    await unloadModel({modelId: llmModelId});
    console.log('✅ LLM model unloaded');
  }
  if (embedModelId) {
    await unloadModel({modelId: embedModelId});
    console.log('✅ Embeddings model unloaded');
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 PrivateMind Planner - Development Test\n');

  try {
    // Initialize models
    await initializeModels();

    // Test completion
    await testCompletion();

    // Test embeddings
    await testEmbeddings();

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await cleanup();
  }
}

// Run main function
main();
