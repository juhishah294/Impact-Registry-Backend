import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './typeDefs';
import mutationFields from './mutations';
import queryFields from './query';
import DateTimeScalar from './scalars/datetime';
import UserResolvers from './resolvers/userResolvers';
import InstituteResolvers from './resolvers/instituteResolvers';

// Combine all resolvers
const resolvers = {
  DateTime: DateTimeScalar,
  Query: queryFields,
  Mutation: mutationFields,
  User: UserResolvers,
  Institute: InstituteResolvers,
};

// Create executable schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
