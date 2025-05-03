const fs = require("fs");
const path = require("path");

const UPLOADS_DIR = path.join(__dirname, "../uploads");
const SIX_HOURS = 6 * 60 * 60 * 1000;

function cleanupOldFiles() {
    const now = Date.now();

    fs.readdir(UPLOADS_DIR, (err, files) => {
        if (err) return console.error("Failed to read uploads directory:", err);

        files.forEach(file => {
            const filePath = path.join(UPLOADS_DIR, file);
            fs.stat(filePath, (err, stats) => {
                if (err) return console.error("Failed to get file stats:", err);

                const age = now - stats.mtimeMs;
                if (age > SIX_HOURS) {
                    fs.unlink(filePath, err => {
                        if (err) console.error("Failed to delete file:", err);
                        else console.log(`Deleted old file: ${file}`);
                    });
                }
            });
        });
    });
}

module.exports = cleanupOldFiles;
