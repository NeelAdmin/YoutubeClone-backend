import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import express from "express";

const app = express();

dotenv.config({ path: "./env" });

connectDB()
  .then(() => {
    app.on("error", (error) => console.log(error));
    app.listen(`${process.env.PORT}`, () => {
      console.log(`Listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => console.log(error));
