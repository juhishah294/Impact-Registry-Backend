import { GraphQLScalarType, Kind } from 'graphql';

export const DateTimeType = new GraphQLScalarType({
    name: 'DateTime',
    description: 'Date custom scalar type',
    serialize(value: any) {
        return value instanceof Date ? value.toISOString() : value;
    },
    parseValue(value: any) {
        return new Date(value);
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value);
        }
        return null;
    },
});

export default DateTimeType;
