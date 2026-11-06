import express from "express";
import "dotenv/config"
import cors from "cors";

import Authroute from "./Routes/Auth.routes.js";
import Jobroute from "./Routes/Job.routes.js";
import Webroute from "./Routes/Webdata.routes.js";
import cookieParser from 'cookie-parser'
const app = express();

const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "https://student-saarthi-ten.vercel.app/"
].filter(Boolean);


app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.get("/", (req, res) => {
  res.send("backend running");
});

app.use(express.json())
app.use(cookieParser())
app.use("/auth", Authroute);
app.use("/job", Jobroute);
app.use("/data", Webroute);
const PORT = process.env.PORT || 3000;

console.log(PORT);


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});