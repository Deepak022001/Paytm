const express = require('express');
const app = express();
const user = require('./user');
const rootRouter = express.Router();
userRouter.use('/user', user);
module.exports = rootRouter;
