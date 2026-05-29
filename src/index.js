/**
 * PrivateMind Planner - Main Entry Point
 * Local AI Life Planner using QVAC SDK
 */

import modelService from './services/model.js';
import {startServer} from './web/server.js';

/**
 * Main function
 */
async function main() {
  console.log('🚀 PrivateMind Planner - Starting...\n');

  try {
    // Initialize AI models
    console.log('Step 1: Loading AI models...');
    await modelService.initialize();
    console.log('');

    // Start web server
    console.log('Step 2: Starting web server...');
    await startServer();
    console.log('');

    // Print instructions
    console.log('========================================');
    console.log('✅ PrivateMind Planner is ready!');
    console.log('========================================');
    console.log('');
    console.log('🌐 Open your browser and go to:');
    console.log('   http://localhost:3000');
    console.log('');
    console.log('📡 API endpoints:');
    console.log('   POST /api/chat     - Chat with AI');
    console.log('   GET  /api/health   - Check status');
    console.log('   GET  /api/welcome  - Get welcome message');
    console.log('');
    console.log('Press Ctrl+C to stop the server');
    console.log('========================================');

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n\n🛑 Shutting down...');
      await modelService.cleanup();
      console.log('👋 Goodbye!');
      process.exit(0);
    });
  } catch (error) {
    console.error('\n❌ Failed to start:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run main function
main();
