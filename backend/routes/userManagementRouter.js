const express = require('express');
const { User } = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware');
const bcrypt = require('bcryptjs');
const { createUserSchema, updateUserSchema } = require('../types');

const userManagementRouter = express.Router();

userManagementRouter.post(
  "/",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    const { success } = createUserSchema.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            message: "Invalid input formats"
        })
    }

    try {
      const { username, email, password, role = "user" } = req.body;

      if (!username || !email || !password) {
        return res
          .status(400)
          .json({ error: "Username, email, and password are required" });
      }

      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "Username or email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        username,
        email,
        password: hashedPassword,
        role,
      });

      await user.save();
      res.status(201).json({
        message: "User created successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

userManagementRouter.get(
  "/",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const users = await User.find({ role: "user" }).select("-password");
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

userManagementRouter.get(
  "/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

userManagementRouter.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    const { success } = updateUserSchema.safeParse(req.body);
    if (!success) {
        return res.status(200).json({
            message: "Invalid Input formats"
        });
    }
    try {
      const { username, email, password } = req.body;
      const updateData = { username, email };

      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const user = await User.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
      }).select("-password");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ message: "User updated successfully", user });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

userManagementRouter.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = userManagementRouter;
