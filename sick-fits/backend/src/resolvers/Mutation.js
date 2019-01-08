const Mutations = {
    async createItem(parent, args, ctx, info) {
        // TODO: Check if they are logged in

        // ctx.db.mutation.createItem returns a Promise
        const item = await ctx.db.mutation.createItem(
            {
                data: {
                    ...args
                }
            },
            info
        );

        return item;
    },
    updateItem( parent, args, ctx, info ) {
        // first take a copy of the updates
        const updates = { ...args };
        // remove id from the updates
        delete updates.id;
        // run the update method
        return ctx.db.mutation.updateItem(
            {
                data: updates,
                where: {
                    id: args.id
                }
            },
            info
        );
    }
};

module.exports = Mutations;
