import { GraphQLError } from 'graphql';

class AuthenticationError extends GraphQLError {
  constructor(message: string = 'Authentication failed') {
    super(message, {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: {
          status: 401,
        },
      },
    });
  }
}

export default AuthenticationError;
