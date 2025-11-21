import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import reviewRouter from "./routes/review.js";
import extractRouter from "./routes/extractContext.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/review", reviewRouter);
app.use("/api/extractContext", extractRouter);

app.get("/ping", (req, res) => {
    res.status(200).send("pong");
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
