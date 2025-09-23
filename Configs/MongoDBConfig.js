import mongoose from "mongoose";

async function ConnectDB() {
  console.log("🔗 Connecting to DB...");

  try {
    await mongoose.connect(process.env.MONGODB_ATLAS_CONNECTION);
    console.log("✅ DB Connected successfully");
  } catch (err) {
    console.error("❌ DB Connection failed:", err.message);
  }
}

export default ConnectDB;
