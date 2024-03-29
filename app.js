// app.js
// Importing required modules
import express from 'express';
import mongoose from 'mongoose';
import globalRouter from './route/routes.js';

// Create an instance of Express
const app = express();

// Serve static files from the "public" directory
app.use(express.static('public'));

app.use("/api/v1", globalRouter);
app.get("/api/v1", (req, res) => {
  res.status(200).json({ msg: "Server is up and running!"})
});

// Export the app instance
export default app;
