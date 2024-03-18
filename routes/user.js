const { sign } = require('crypto');
const express = require('express');
const app = express();
const { JWT_SECRET } = require('../config');
const jwt = require('jsonwebtoken');
const { zod } = require('zod');
const userRouter = express.Router();
const database = require('../db');
app.use(cors());
app.use(express.json());
const signUpSchema = zod.object({
  userName: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string().min(8),
});
userRouter.post('/signup', async (req, res) => {
  const { success } = signUpSchema.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: 'Email already taken/Incorrect inputs',
    });
  }
  const user = await database.findOne({
    userName: req.body.userName,
  });
  if (user) {
    res.status(411).json({
      message: 'User already exists',
    });
  }
  const newUser = await database.create({
    userName: req.body.userName,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
  });

  const user_id = newUser._id;

  const token = jwt.sign({ user_id }, JWT_SECRET);
  res.status({
    message: 'User created Successfully',
    token: token,
  });
});

const signInBody = zod.object({
  userName: zod.string().email(),
  password: zod.string(),
});
userRouter.post('/signin', async (req, res) => {
  const { success } = signInBody.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: 'Email already taken/Incorrect inputs',
    });
  }
  const result = await database.findOne({
    userName: req.body.userName,
    password: req.body.password,
  });
  if (result) {
    const token = jwt.sign(
      {
        userId: result._id,
      },
      JWT_SECRET
    );

    res.json({
      token: token,
    });
    return;
  }

  res.status(411).json({
    message: 'Error while logging in',
  });
});
module.exports = userRouter;
