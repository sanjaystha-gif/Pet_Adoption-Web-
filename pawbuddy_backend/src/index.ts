import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/environment.js';

const PORT = env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

