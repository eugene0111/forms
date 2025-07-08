const express = require('express');
const userRouter = require('./userRouter');
const authRouter = require('./authRouter');
const adminRouter = require('./adminRouter');

const router = express.Router();
router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/admin', adminRouter);

module.exports = router