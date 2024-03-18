const express = require('express');
const app = express();
const rootRouter = require('./routes/index');
app.use('/api/v1', rootRouter);
