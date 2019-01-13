const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// NB anytime you add a query or mutation to your schema, you have to create corresponding resolver too

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
    },
    async deleteItem(parent, args, ctx, info) {
        const where = { id: args.id };
        // 1. find the item
        const item = await ctx.db.query.item({ where }, `{ id title}`);
        // 2. check if they own that item, or have permissions to delete it
        // TODO
        // 3. delete it!
        return ctx.db.mutation.deleteItem({ where }, info);
    },
    async signup(parent, args, ctx, info) {
        args.email = args.email.toLowerCase();
        // hash the password
        const password = await bcrypt.hash(args.password, 10);
        // create the user in the database
        const user = await ctx.db.mutation.createUser(
            {
                data: {
                    // name: args.name,
                    // email: args.email,
                    // password: args.password
                    ...args,
                    password,
                    permissions: { set: ['USER'] }
                }
            },
            info
        );
        // create the JWT token for them
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        // we set the jwt as a cookie on the response, so that every time a user
        // clicks to another page, the token comes along for the ride
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
        })
    }
};

module.exports = Mutations;
