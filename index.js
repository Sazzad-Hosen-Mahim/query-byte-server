import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import businessRoute from "./routes/businessRoute.js";

import path from "path";
//configure env
dotenv.config();

//database config
connectDB();

const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
// app.use(express.static(path.join(__dirname, "../query-byte-client/build")));

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/businessCard", businessRoute);

//REST api

app.use("*", function (req, res) {
  res.send("Hello");
  // res.sendFile(path.join(__dirname, "../query-byte-client/build/index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`.bgMagenta);
});
