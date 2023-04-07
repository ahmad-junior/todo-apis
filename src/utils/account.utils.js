import JWT from 'jsonwebtoken';
import client from '../config/connect_redis.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

export default {
    generateAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            // Token Creditionals
            const pyaload = {}
            const secrect_key = process.env.SECRET_KEY_TOKEN;
            const options = {
                expiresIn: `${process.env.EXP_TOKEN}s`.toString(),
                issuer: 'todo_apis',
                audience: userId
            }

            // Generate Token
            JWT.sign(pyaload, secrect_key, options, (err, token) => {
                if (err) {
                    reject(err);
                    // Write the error into the log file
                    utils.writeErrorToLog(err);
                } else {
                    resolve(token);
                }
            });
        });
    },
    verfiyAccessToken: (token) => {
        return new Promise((resolve, reject) => {
            const secrect_key = process.env.SECRET_KEY_TOKEN;
            JWT.verify(token, secrect_key, (err, payload) => {
                if (err) {
                    reject(err);
                    // Write the error into the log file
                    utils.writeErrorToLog(err);
                } else {
                    resolve(payload);
                }
            });
        });
    },
    generateRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
            // Token Creditionals
            const pyaload = {}
            const secrect_key = process.env.SECRET_KEY_REFRESH;
            const options = {
                expiresIn: `${process.env.EXP_REFRESH}s`.toString(),
                issuer: 'todo_apis',
                audience: userId
            }

            // Generate Token
            JWT.sign(pyaload, secrect_key, options, (err, token) => {
                if (err) {
                    reject(err);
                    // Write the error into the log file
                    utils.writeErrorToLog(err);
                    return;
                }

                try {
                    client.SETEX(userId, process.env.EXP_REFRESH, token, (err, reply) => {
                        if (err) {
                            reject(err);
                            // Write the error into the log file
                            utils.writeErrorToLog(err);
                            return;
                        }
                    });
                    resolve(token);
                } catch (error) {
                    reject(error);
                    // Write the error into the log file
                    utils.writeErrorToLog(err);
                }
            });
        });
    },
    verifyRefreshToken: async (token) => {
        const userId = JWT.decode(token).aud;
        const redisToken = await client.GET(userId);

        if (redisToken !== token) {
            throw new Error('Invalid Token!');
        }

        return new Promise((resolve, reject) => {
            const secrect_key = process.env.SECRET_KEY_REFRESH;
            JWT.verify(token, secrect_key, (err, payload) => {
                if (err) {
                    reject(err);
                    // Write the error into the log file
                    utils.writeErrorToLog(err);
                } else {
                    resolve(payload);
                }
            });
        });
    },
    hashPassword: (password) => {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    reject(err);
                    // Write the error into the log file
                    utils.writeErrorToLog(err);
                } else {
                    resolve(hash);
                }
            });
        });
    },
    comparePassword: (password, hash) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hash, (err, result) => {
                if (err) {
                    reject(err);
                    // Write the error into the log file
                    utils.writeErrorToLog(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    deleteRefreshToken: (userName) => {
        try {
            client.DEL(userName, (err, reply) => {
                if (err) {
                    // Write the error into the log file
                    utils.writeErrorToLog(err);
                    return;
                }
            });
        }
        catch (error) {
            // Write the error into the log file
            utils.writeErrorToLog(error);
        }
    }
}