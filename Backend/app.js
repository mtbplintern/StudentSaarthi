import express from "express";
import "dotenv/config"
import cors from "cors";

import Authroute from "./Routes/Auth.routes.js";
import Jobroute from "./Routes/Job.routes.js";
import Webroute from "./Routes/Webdata.routes.js";
import cookieParser from 'cookie-parser'
const app = express();

app.use(cors({    origin: [process.env.CLIENT_URL ,"http://192.168.0.185:5173"],
 credentials: true }));

app.get("/", (req, res) => {
  res.send("backend running");
});

app.use(express.json())
app.use(cookieParser())
app.use("/auth", Authroute);
app.use("/job", Jobroute);
app.use("/data", Webroute);


app.listen(3000, () => {
  console.log("server start");
});
