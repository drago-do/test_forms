import mongoose, { Connection } from "mongoose";

const { MONGOURI } = process.env;

if (!MONGOURI) {
  throw new Error("Please define the MongoDB environment variables.");
}

let dbConnection: Connection | null = null;

const connect = async (): Promise<Connection> => {
  if (dbConnection) {
    console.log(`Reusing existing MongoDB connection`);
    return dbConnection;
  }

  try {
    console.log(`Creating new connection to MongoDB`);
    await mongoose.connect(MONGOURI, {
      dbName: "Test_Nayeli", // Especifica la base de datos por defecto
    });

    dbConnection = mongoose.connection;
    console.log(`Connected to MongoDB`);

    return dbConnection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

export default connect;
