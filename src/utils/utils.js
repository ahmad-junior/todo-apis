import fs from "fs";
import path from "path";
import connection from "../config/connect_db.js";

const writeErrorToLog = (error) => {
    const logPath = path.join(`${process.cwd()}/src/logs`, `/${process.env.LOG_FILE_NAME}`);
    const logData = `${new Date().toLocaleString()} | ${error.message} \n`;

    // Create the log file if not exists
    if (!fs.existsSync(logPath)) {
        fs.writeFileSync(logPath, "");
    }

    // Append the error into the log file
    fs.appendFile(logPath, logData, (err) => {
        if (err) {
            console.log(err);
        }
    });
}

const createUserTable = (userName) => {
    // Set Query
    const sql = `CREATE TABLE IF NOT EXISTS ${userName}_todos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        todoTitle TEXT NOT NULL,
        todoStartDate DATE NOT NULL DEFAULT CURRENT_DATE,
        todoImp BOOLEAN NOT NULL DEFAULT FALSE,
        todoRecycle BOOLEAN NOT NULL DEFAULT FALSE,
        todoDone BOOLEAN NOT NULL DEFAULT FALSE
    )`;

    // Execute Query
    try {
        connection.query(sql, (err) => {
            if (err) {
                // Write error to log file
                writeErrorToLog(err);
            }
        });
    } catch (error) {
        writeErrorToLog(error);
    }
}

const convertToJSON = (data) => {
    return JSON.stringify(data);
}

export default {
    writeErrorToLog,
    createUserTable,
    convertToJSON
}