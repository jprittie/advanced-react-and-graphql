const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: 'variables.env' });
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

// TODO use express middleware to handle cookies (JWT)
// server.express.use() allows us to use any existing express middleware
// we'll pass it an instance of cookieParser
// this will allow us to access cookies as a nice formatted object, rather than just a cookie string that it normally comes in as a header
server.express.use(cookieParser());
// we will be accepting the request, then parsing any cookies that came along with the request
// so that we can parse that JWT and be able to authenticate the current user


// decode the jwt so we can get the user id on each request
server.express.use((req, res, next) => {
    const { token } = req.cookies;
    // check for token - there might not be one, i.e. if user is signed out
    if (token) {
        const { userId } = jwt.verify(token, process.env.APP_SECRET );
        // put the userId onto the req for future requests to access
        req.userId = userId;
    }
    next();
});

// 2. Create a middleware that populates the user on each request if they are logged in
server.express.use(async (req, res, next) => {
    // if they aren't logged in, skip this
    if (!req.userId) return next();
    const user = await db.query.user(
      { where: { id: req.userId } },
      '{ id, permissions, email, name }'
    );
    req.user = user;
    next();
});


server.start({
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL
    }
}, deets => {
    console.log(`Server is now running on http:/localhost:${deets.port}`)
});
