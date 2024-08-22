import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's URL and convert it to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const logFilePath = path.join(logDirectory, 'actions.log');

// Function to log messages
const logAction = (action, userId) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - User ID: ${userId} - ${action}\n`;

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Failed to write log:', err);
    }
  });
};

export default logAction;
