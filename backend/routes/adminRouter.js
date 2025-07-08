const express = require('express');
const userManagementRouter = require('./userManagementRouter');
const formRouter = require('./formRouter');
const responseRouter = require('./responseRouter');
const dashboardRouter = require('./dashboardRouter');

const adminRouter = express.Router();

adminRouter.use('/users', userManagementRouter);
adminRouter.use('/forms', formRouter);
adminRouter.use('/responses', responseRouter);
adminRouter.use('/dashboard', dashboardRouter);

module.exports = adminRouter;