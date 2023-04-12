import accountUtils from "../utils/account.utils.js";
import connection from "../config/connect_db.js";
import userSchema from "../models/User.model.js";
import utils from "../utils/utils.js";
import dotenv from "dotenv";
dotenv.config();

export default {
    register: async (req, res) => {

        // Check if the user is already in the database
        try {
            const values = [req.body.userName.toLowerCase(), req.body.fullName.toUpperCase(), req.body.userPassword.toLowerCase(), req.body.userEmail.toLowerCase()];
        } catch (error) {
            // Write the error into the log file
            utils.writeErrorToLog(error);
            res.status(500).json({ message: "Please Provide requried details. userName, Password, Name, Email" });
            return;
        }

        try {
            const sqlCheck = "SELECT * FROM users WHERE userName = ? OR userEmail = ?";
            const valuesCheck = [req.body.userName.toLowerCase(), req.body.userEmail.toLowerCase()];

            // Insert if the user not exists
            const sqlInsert = "INSERT INTO users (userName, fullName, userPassword, userEmail) VALUES (?, ?, ?, ?)";
            const password = await accountUtils.hashPassword(req.body.userPassword);
            const valuesInsert = [req.body.userName.toLowerCase(), req.body.fullName.toUpperCase(), password, req.body.userEmail.toLowerCase()];

            const token = await accountUtils.generateAccessToken(req.body.userName.toLowerCase());
            const resfreshToken = await accountUtils.generateRefreshToken(req.body.userName.toLowerCase());

            // Validate User
            const { error } = userSchema.validate(req.body);
            if (error) {
                res.status(400).json({ message: "Please fill all the fields! with valid data" });
                return;
            }

            // Save User into database if not exists
            connection.query(sqlCheck, valuesCheck, (err, result) => {
                if (err) {
                    // Write the error into the log file
                    utils.writeErrorToLog(error);
                    res.status(500).json({ message: "Internal Server Error!" });
                } else {
                    if (result.length > 0) {
                        res.status(409).json({ message: "User already exists!" });
                    } else {
                        connection.query(sqlInsert, valuesInsert, (err, result) => {
                            if (err) {
                                // Write the error into the log file
                                utils.writeErrorToLog(error);
                                res.status(500).json({ message: "Internal Server Error!" });
                            } else {
                                res.send({
                                    access_token: token,
                                    refresh_token: resfreshToken,
                                    status: "success",
                                    message: "User registered successfully"
                                });
                            }
                        });
                    }
                }
            });

            // Create user Table in database
            utils.createUserTable(req.body.userName.toLowerCase());
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error!" });
        }
    },

    login: async (req, res) => {

        try {
            // Check if the user is in the database
            const sqlCheck = "SELECT * FROM users WHERE userName = ? OR userEmail = ?";
            const valuesCheck = [req.body.userName.toLowerCase(), req.body.userName.toLowerCase()];

            // Check if the user exists
            connection.query(sqlCheck, valuesCheck, async (err, result) => {
                if (err) {
                    // Write the error into the log file
                    utils.writeErrorToLog(err);
                    res.status(500).json({ message: "Internal Server Error!" });
                } else {
                    if (result.length > 0) {
                        // We generate the tokens with userName because it's unique
                        const token = await accountUtils.generateAccessToken(result[0].userName);
                        const resfreshToken = await accountUtils.generateRefreshToken(result[0].userName);

                        // Check if the password is correct
                        const password = result[0].userPassword;
                        const isPasswordCorrect = await accountUtils.comparePassword(req.body.userPassword, password);
                        
                        if (isPasswordCorrect) {
                            res.send({
                                access_token: token,
                                refresh_token: resfreshToken,
                                status: "success",
                                message: "User logged in successfully"
                            });
                        } else {
                            res.status(401).json({ message: "Wrong Credentials!" });
                        }
                    } else {
                        res.status(404).json({ message: "User not found!" });
                    }
                }
            });
        } catch (error) {
            // Write the error into the log file
            utils.writeErrorToLog(error);
            res.status(500).json({ message: "Internal Server Error!" });
        }
    },

    logout: async (req, res) => {
        const { userName } = req.body;
        if (userName) {
            accountUtils.deleteRefreshToken(userName);
            res.send({ message: "User logged out successfully" });
        } else {
            res.status(400).send({ message: "Bad Request!" });
        }
    },

    refreshTokens: async (req, res) => {
        const { refreshToken, userName } = req.body;

        if (!refreshToken || !userName) {
            return res.status(403).send({ message: "Invalid Credientials" });
        }

        try {
            await accountUtils.verifyRefreshToken(refreshToken);

            // Find the user in the database
            const sql = "SELECT * FROM users WHERE userName = ?";
            const values = [userName];

            connection.query(sql, values, async (err, result) => {
                if (err) {
                    // Write the error into the log file
                    utils.writeErrorToLog(error);
                    res.status(500).json({ message: "Internal Server Error!" });
                } else {
                    if (result.length > 0) {
                        // We generate the tokens with userName because it's unique
                        const token = await accountUtils.generateAccessToken(result[0].userName);
                        const resfreshToken = await accountUtils.generateRefreshToken(result[0].userName);

                        res.send({
                            access_token: token,
                            refresh_token: resfreshToken,
                            status: "success",
                            message: "Tokens Resfreshed successfully"
                        });
                    } else {
                        res.status(400).json({ message: "Bad Request!" });
                    }
                }
            });
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                res.status(401).send({ message: "Please Login Again! You Session Has Expired!" });
            } else {
                // Write the error into the log file
                utils.writeErrorToLog(error);
                res.status(401).send({ message: "Unauthorized!" });
            }
        }
    }
}