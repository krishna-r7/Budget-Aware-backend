// const mongoose = require("mongoose");
// module.exports = async () => {
//   try { await mongoose.connect(process.env.MONGO_URI); }
//   catch (e) { console.error(e); process.exit(1); }
// };


const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;