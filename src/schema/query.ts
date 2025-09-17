import UserQueryFields from './user/query';
import InstituteQueryFields from './institute/query';
import { PatientQueryFields } from './patient/query';

const queryFields = {
  hello: () => 'Hello from Clinical Trials Data Collector!',
  me: async (_parent: any, _args: any, context: any) => {
    // Check for authentication errors first
    if (context.authError) {
      const { GraphQLError } = await import('graphql');
      throw new GraphQLError(context.authError.message, {
        extensions: {
          code: context.authError.code,
          expiredAt: context.authError.expiredAt
        }
      });
    }

    if (!context.user) {
      return null;
    }

    // If user has an institute, fetch the institute details including approval status
    if (context.user.instituteId) {
      const { userService } = await import('./user/services/userService');
      const { instituteService } = await import('./institute/services/instituteService');

      try {
        const [user, institute] = await Promise.all([
          userService.getUserById(context.user.id),
          instituteService.getInstituteById(context.user.instituteId)
        ]);

        return {
          ...user,
          institute
        };
      } catch (error) {
        // If there's an error fetching institute, return user without institute
        return context.user;
      }
    }

    return context.user;
  },
  ...UserQueryFields,
  ...InstituteQueryFields,
  ...PatientQueryFields,
};

export default queryFields;