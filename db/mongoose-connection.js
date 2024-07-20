//db/mongoose-connection.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}`
    );
    console.log(
      `\n MongoDB connected !! ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    // Node JS's 'process' proides a way to stop the program and signals an error
    // There are other code of exit also like 0, 1, ... etc
    process.exit(1);
  }
};

module.exports = connectDB;
