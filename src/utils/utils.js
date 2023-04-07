import fs from "fs";
import path from "path";

export default {
    writeErrorToLog: (error) => {
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
    },
}