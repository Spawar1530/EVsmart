const pool = require("../db");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
require("dotenv").config();

exports.otpSend = async (req, res, next) => {
    try {
        const { phone } = req.body;
        const expiryStatus = await pool.query("UPDATE otp SET expiry_status = true WHERE otp_phone = $1", [phone]);
        const otp = await otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
        const timeInMinute = 30 * 60 * 1000//5 minutes to milliseconds
        const expire = Date.now() + timeInMinute;
        const data = `${phone}${otp}${expire}`;
        const saltRound = 9;
        const Salt = bcrypt.genSalt(saltRound);
        const bcryptHash = await bcrypt.hash(data, saltRound);
        req.bcryptHash = bcryptHash;
        req.otp = otp;
        req.expire = expire;
        next();
    } catch (err) {
        console.error(err.message);
        res.status(500).json("server error");
    };
};

exports.otpVerify = async (req, res, next) => {
    try {
        const { phone, otpToken } = req.body;
        const otpDb = await pool.query("SELECT * from otp WHERE otp_phone = $1 AND expiry_status = false", [phone])
        hash = otpDb.rows[0].otp_hash;
        expire = otpDb.rows[0].otp_expire;
        const validOtp = await bcrypt.compare(phone + otpToken + expire, hash);
        if (!validOtp) {
            return res.status(401).json("OTP is invalid");
        };
        res.json(true)
        const verifyStatus = pool.query("UPDATE otp SET otp_ver = true WHERE otp_phone = $1", [phone])
        next();
    } catch (err) {
        console.error(err.message);
        res.status(500).json("server error");
    };
};