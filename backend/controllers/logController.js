import asyncHandler from 'express-async-handler';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's URL and convert it to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFilePath = path.join(__dirname, '../logs/actions.log');

// @desc    Get all logs
// @route   GET /api/logs
// @access  Private/Admin
const getLogs = asyncHandler(async (req, res) => {
  fs.readFile(logFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to read log file' });
    }
    
    // Split the log data into lines and filter out empty lines
    const logEntries = data.trim().split('\n').filter(line => line);

    // Parse log entries
    const logs = logEntries.map(line => {
      // Example: "2024-08-17T14:32:00.000Z - User ID: 12345 - User logged in"
      const parts = line.split(' - ');
      if (parts.length < 3) return null; // Skip malformed entries

      const timestamp = parts[0].trim();
      const userId = parts[1].replace('User ID:', '').trim();
      const action = parts.slice(2).join(' - ').trim(); // Join remaining parts

      return { timestamp, userId, action };
    }).filter(log => log !== null);

    res.json(logs);
  });
});

export { getLogs };
