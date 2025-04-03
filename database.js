const mongoose = require("mongoose");
require("dotenv").config(); 

const uri = process.env.MONGODB_URI; 

async function connectDB() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Atlas connecté !");
  } catch (error) {
    console.error("❌ Erreur de connexion MongoDB:", error);
    process.exit(1);
  }
}

module.exports = connectDB; 
