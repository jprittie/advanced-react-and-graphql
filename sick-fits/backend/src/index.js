const cookieParser = require('cookie-parser');

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
// TODO use express middleware to populate current user

server.start({
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL
    }
}, deets => {
    console.log(`Server is now running on http:/localhost:${deets.port}`)
});
