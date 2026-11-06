import jwt from "jsonwebtoken";
 
export const Cheaklogin = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token)
      return res.status(401).json({
        success: false,
        message: "User not Login",
      });
    const verify = jwt.verify(token, process.env.jwt_key);

    if (!verify) {
      await res.clearCookie("token");

      return res.status(401).json({
        success: false,
        message: "Token not valid",
      });
    }

    req.user = verify;
    next();
  } catch (error) {
    console.log(error);
    await res.clearCookie("token");

    return res.json({
      success: false,
      message: "Server error",
    });
  }
};
