// Institute field resolvers to handle data transformation
const InstituteResolvers = {
    status: (parent: any) => {
        // Convert database integer status to a readable format if needed
        // For now, keeping as integer since GraphQL schema expects Int
        return parent.status;
    },
    approvalStatus: (parent: any) => {
        // Ensure approval status is properly formatted (should already be correct from database)
        return parent.approvalStatus;
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

export default InstituteResolvers;
