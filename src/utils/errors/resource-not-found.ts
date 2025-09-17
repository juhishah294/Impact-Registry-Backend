import { GraphQLError } from 'graphql';

class ResourceNotFoundException extends GraphQLError {
  constructor(resource: string, identifier?: string) {
    const message = identifier 
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;
    
    super(message, {
      extensions: {
        code: 'RESOURCE_NOT_FOUND',
        resource,
        identifier,
      },
    });
  }
}

export default ResourceNotFoundException;
