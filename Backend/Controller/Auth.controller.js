import db from "../Config/db.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const Sendotp = async (req, res) => {
  const { Email } = req.body;
  console.log(Email);

  if (!Email)
    return res.status(400).json({ message: "email messing", success: false });

  const [existuser] = await db.query(`SELECT * FROM users WHERE email = ?`, [
    Email,
  ]);
  if (existuser.length > 0)
    return res.status(422).json({
      success: false,
      message: "User allready exist",
    });

  try {
    const OTP = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await db.query(
      `INSERT INTO email_otps (email, otp, expires_at) VALUES (?, ?, ?)`,
      [Email, OTP, expiresAt],
    );

    const mail = {
      from: process.env.SMTP_USER,
      to: Email,
      subject: "OTP varification",
      text: "OTP varification for Kharido  registration ",
      html: `<p> Your verification coad is ${OTP} valid for 5 minut`,
    };

    await transporter.sendMail(mail);
    console.log(OTP);

    res.status(200).json({ success: true, message: "opt sent to your mail" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

export const Verifyotp = async (req, res) => {
  const { Email, OTP } = req.body;
  if (!OTP || !Email)
    return res.status(422).json({
      success: false,
      message: "detail messing",
    });
  try {
    const [rows] = await db.query(
      `SELECT * FROM email_otps 
     WHERE email = ? AND otp = ? AND expires_at > NOW()`,
      [Email, OTP],
    );

    if (rows.length === 0) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    console.log("sendedotp", OTP);

    res.status(201).json({
      success: true,
      message: "OTP verify",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

export const RegisterUser = async (req, res) => {
  return
  const { Username, Email, Phone, Password } = req.body;

  if (!Username || !Email || !Phone || !Password)
    return res.status(422).json({
      success: false,
      message: "detail messing",
    });

  try {
    const [existuser] = await db.query(`SELECT * FROM users WHERE email = ?`, [
      Email,
    ]);
    if (existuser.length > 0)
      return res.json({
        success: false,
        message: "User allready exist",
      });

    const hashPassword = await bcrypt.hash(Password, 10);

    const [insert] = await db.query(
      `INSERT INTO users (name ,email  ,phone ,password ,roleid) VALUES (?,?,?,?)`,
      [Username.trim(), Email, Phone, hashPassword],
    );

    const [insertuser] = await db.query(`SELECT * FROM users WHERE id = ?`, [
      insert.insertId,
    ]);

    const user = insertuser[0];

    const Paylode = {
      id: user.id,
      roleid: user[0].roleid,
    };

    const jwtkey = process.env.jwt_key;

    const token = jwt.sign(Paylode, jwtkey, { expiresIn: "7d" });

    if (token) {
      res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
      });
    }

    res.status(200).json({
      success: true,
      message: "Register success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

export const LoginUser = async (req, res) => {
  console.log("Asd");

  const { Email, Password } = req.body;

  if (!Email || !Password)
    return res.status(422).json({
      success: false,
      message: "detail messing",
    });
  try {
    const [user] = await db.query(`SELECT * FROM users WHERE Email = ?`, [
      Email,
    ]);

    if (user.length == 0)
      return res.status(404).json({
        success: false,
        message: `users not exist`,
      });

    const comparPassword = await bcrypt.compare(Password, user[0].password);
    if (!comparPassword)
      return res.status(422).json({
        success: false,
        message: "Incorrect Password",
      });

    const Paylode = {
      id: user[0].id,
      roleid: user[0].roleid,
    };

    const jwtkey = process.env.jwt_key;

    const token = jwt.sign(Paylode, jwtkey, { expiresIn: "7d" });
    if (token) {
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }

    res.status(200).json({
      success: true,
      message: "Login success",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "server error",
    });
  }
};

export const Userdata = async (req, res) => {
  const { id } = req.user;

  try {
    const [user] = await db.query(
      `SELECT
            U.name ,
            U.email ,
            U.phone,
            R.name as role
            FROM users U
            left join roles R on U.roleid =  R.id WHERE U.id = ?`,
      [id],
    );

    if (user.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      userdata: user[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

export const LogoutUser = async (req, res) => {
  try {
    await res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logout success" });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: "server error",
    });
  }
};

export const EditProfile = async (req, res) => {
  const { id } = req.user;

  const { userdata } = req.body;

  try {
    if (!userdata.email)
      return res.status(422).json({
        success: false,
        message: "detail messing",
      });

    await db.query(`UPDATE users SET name = ?   WHERE id = ?`, [
      userdata.name,
      id,
    ]);

    res.status(200).json({
      success: true,
      message: "Profile update successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};
