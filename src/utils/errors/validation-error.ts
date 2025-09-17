import { GraphQLError } from 'graphql';

class ValidationException extends GraphQLError {
  constructor(message: string = 'Validation failed', code: string = 'VALIDATION_ERROR') {
    super(message, {
      extensions: {
        code,
        timestamp: new Date().toISOString(),
      },
    });
    
    this.name = 'ValidationException';
  }
}

export default ValidationException;
