// User field resolvers to handle data transformation
const UserResolvers = {
    status: (parent: any) => {
        // Convert database integer status to GraphQL enum
        switch (parent.status) {
            case 1:
                return 'ACTIVE';
            case 0:
                return 'INACTIVE';
            case 2:
                return 'SUSPENDED';
            case 3:
                return 'PENDING';
            default:
                return 'INACTIVE';
        }
    },
    role: (parent: any) => {
        // Ensure role is properly formatted (should already be correct from database)
        return parent.role;
    },
    updatedAt: (parent: any) => {
        // Handle null updatedAt by using createdAt or current time as fallback
        return parent.updatedAt || parent.createdAt || new Date();
    },
    createdAt: (parent: any) => {
        // Handle null createdAt by using current time as fallback
        return parent.createdAt || new Date();
    }
};

export default UserResolvers;
