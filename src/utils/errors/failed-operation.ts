import { GraphQLError } from 'graphql';

class FailedOperationException extends GraphQLError {
  constructor(message: string = 'Operation failed', code: string = 'OPERATION_FAILED') {
    super(message, {
      extensions: {
        code,
        timestamp: new Date().toISOString(),
      },
    });
    
    this.name = 'FailedOperationException';
  }
}

export default FailedOperationException;
