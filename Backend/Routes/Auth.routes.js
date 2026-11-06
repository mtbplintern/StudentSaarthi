import { Router } from "express";

import { Cheaklogin } from "../Middleware/authMiddleware.js";
import {
  Userdata,
  RegisterUser,
  Verifyotp,
  LoginUser,
  Sendotp,
  LogoutUser,
  EditProfile,
} from "../Controller/Auth.controller.js";

const route = Router();

route.post("/send-otp", Sendotp);
route.post("/register", RegisterUser);
route.post("/verify-otp", Verifyotp);
route.post("/login", LoginUser);
route.get("/logout", LogoutUser);

route.put("/edit-profile", Cheaklogin, EditProfile);
route.get("/userdata", Cheaklogin, Userdata);

export default route;
