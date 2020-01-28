const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const errorHandler = require('./middleware/error-handler');
const authRouter = require('./auth/auth-router');
const userRouter = require('./users/users-router');
const listsRouter = require('./lists/lists-router');
const spotsRouter = require('./spots/spots-router');
const app = express();

app.use(
  morgan(NODE_ENV === 'production' ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test'
  })
);
app.use(cors());
app.use(helmet());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/lists', listsRouter);
app.use('/api/spots', spotsRouter);
app.route('/api').get((req, res, next) => {
  res.status(200).json({"message": "Im awake"})
})

app.use(errorHandler);

module.exports = app;
