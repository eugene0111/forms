const bcrypt = require("bcryptjs");
const { User } = require('../db');

async function createAdminUser() {
  const existing = await User.findOne({ username: "admin" });
  if (existing) {
    console.log("Admin user already exists");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash("admin", 10); // or your preferred password

  const adminUser = new User({
    username: "admin",
    email: "admin@example.com",
    password: hashedPassword,
    role: "admin",
  });

  await adminUser.save();
  console.log("Admin user created successfully");
  process.exit(0);
}

createAdminUser().catch((err) => {
  console.error("Error creating admin user:", err);
  process.exit(1);
});