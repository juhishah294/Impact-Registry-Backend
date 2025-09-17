import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import express from 'express';
import dotenv from 'dotenv';
import depthLimit from 'graphql-depth-limit';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { JwtPayload, verify } from 'jsonwebtoken';
import cors from 'cors';
import { cirkleLogger, logger } from './utils/logger';
import { generateReferenceId, returnSuccessHTTPResponse } from './utils/misc';
import schema from './schema/index';
import { userService } from './schema/user/services/userService';
import packageJson from '../package.json';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Body parser middleware
app.use(json({ limit: '50mb' }));

// File upload middleware
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json(returnSuccessHTTPResponse({
    status: 'OK',
    version: packageJson.version,
    timestamp: new Date().toISOString(),
    referenceId: generateReferenceId()
  }));
});

// Version endpoint
app.get('/version', (_req, res) => {
  getVersion(res);
});

function getVersion(res: any) {
  res.json(returnSuccessHTTPResponse({
    version: packageJson.version,
    name: packageJson.name,
    description: packageJson.description
  }));
}

// Context function for GraphQL
interface GraphQLContext {
  user?: any;
  token?: string;
  authError?: {
    code: string;
    message: string;
    expiredAt?: Date;
  };
  req: express.Request;
  res: express.Response;
}

const createContext = async ({ req, res }: { req: express.Request; res: express.Response }): Promise<GraphQLContext> => {
  const context: GraphQLContext = { req, res };

  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      context.token = token;

      // Verify JWT token
      const decoded = verify(token, process.env.JWT_SECRET || 'default-secret') as JwtPayload;
      if (decoded && decoded.userId) {
        // Get user from database
        const user = await userService.getUserById(decoded.userId);
        if (user) {
          context.user = user;
        }
      }
    }
  } catch (error: any) {
    // Handle JWT specific errors
    if (error.name === 'TokenExpiredError') {
      logger.warn('JWT token expired:', { expiredAt: error.expiredAt });
      context.authError = {
        code: 'JWT_EXPIRED',
        message: 'Your session has expired. Please log in again.',
        expiredAt: error.expiredAt
      };
    } else if (error.name === 'JsonWebTokenError') {
      logger.warn('Invalid JWT token:', error.message);
      context.authError = {
        code: 'INVALID_TOKEN',
        message: 'Invalid authentication token. Please log in again.'
      };
    } else {
      logger.warn('Authentication failed:', error);
      context.authError = {
        code: 'AUTH_FAILED',
        message: 'Authentication failed. Please log in again.'
      };
    }
  }

  return context;
};

// Apply middleware to schema - disable permissions for development
const schemaWithMiddleware = schema;

// Create Apollo Server
const server = new ApolloServer({
  schema: schemaWithMiddleware,
  validationRules: [depthLimit(10)],
  formatError: (error) => {
    logger.error('GraphQL Error:', error);
    return {
      message: error.message,
      code: error.extensions?.code,
      path: error.path,
    };
  },
  plugins: [
    {
      async requestDidStart() {
        return {
          async didResolveOperation(requestContext) {
            cirkleLogger.info('GraphQL Operation:', {
              operationName: requestContext.request.operationName,
              query: requestContext.request.query,
            });
          },
          async didEncounterErrors(requestContext) {
            cirkleLogger.error('GraphQL Errors:', requestContext.errors);
          },
        };
      },
    },
  ],
});

// Start server
async function startServer() {
  try {
    await server.start();

    // Apply GraphQL middleware
    app.use(
      '/graphql',
      expressMiddleware(server, {
        context: createContext,
      })
    );

    // Start HTTP server
    app.listen(PORT, () => {
      logger.info(`🚀 Clinical Trials Data Collector Server ready at http://localhost:${PORT}`);
      logger.info(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
      logger.info(`🏥 Health check: http://localhost:${PORT}/health`);
      logger.info(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await server.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await server.stop();
  process.exit(0);
});

// Start the server
startServer().catch((error) => {
  logger.error('Server startup failed:', error);
  process.exit(1);
});
