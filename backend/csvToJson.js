import fs from "fs";
import csvParser from "csv-parser";

export const csvToJson = () => {
    return new Promise((resolve, reject) => {
        const results = [];
        const csvFilePath = "indian_food.csv"; // Adjust the path as necessary

        fs.createReadStream(csvFilePath)
            .pipe(csvParser())
            .on("data", (data) => results.push(data))
            .on("end", () => {
                resolve(results);
            })
            .on("error", (error) => {
                reject(new Error("Failed to read CSV file: " + error.message));
            });
    });
};
