const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: 'variables.env' });
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

// TODO Use express middlware to handle cookies (JWT)
server.express.use(cookieParser());
// TODO Use express middlware to populate current user
server.express.use((req, res, next) => {
  // decode the JWT so we can get the user Id on each request
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // use APP_SECRET in verify to further prove tempering
    // put the userId onto the req for future requests to access
    req.userId = userId;
  }
  next();
});
server.start(
  {
    cors: {
      // only specific url can access the app
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  deets => {
    console.log(`Server is now running on port http:/localhost:${deets.port}`);
  }
);
