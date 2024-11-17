import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;
const JWT_SECRET = process.env.JWT_SECRET;
export const verifyAndDecrypt = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({success:false, message: "Please authenticate using a valid token" });
    }

    // Verify token and retrieve encrypted data and IV
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const encryptedData = decodedToken.data;
    const iv = Buffer.from(decodedToken.iv, "base64");

    // Decrypt payload using AES
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(SECRET_KEY,"hex"),
      iv
    );
    let decryptedData = decipher.update(encryptedData, "base64", "utf8");
    decryptedData += decipher.final("utf8");

    // Parse decrypted payload
    const payload = JSON.parse(decryptedData);

    //Storing the Logged In user info in req.user
    req.user = payload;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ success:false, message: "Invalid or expired token" });
  }
};
 