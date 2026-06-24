import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env.local");
const logPath = path.join(__dirname, "..", "logs", "backup.log");

function log(message) {
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${message}\n`);
}

if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
    }
  }
}

const DB_PATH = process.env.DB_PATH ?? path.join(__dirname, "..", "data", "portal.db");
const { GMAIL_USER, GMAIL_APP_PASSWORD, GMAIL_BACKUP_TO } = process.env;

if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !GMAIL_BACKUP_TO) {
  console.error("Missing env vars: GMAIL_USER, GMAIL_APP_PASSWORD, GMAIL_BACKUP_TO");
  log("Missing env vars: GMAIL_USER, GMAIL_APP_PASSWORD, GMAIL_BACKUP_TO");
  process.exit(1);
}

if (!fs.existsSync(DB_PATH)) {
  console.error(`DB not found at: ${DB_PATH}`);
  log(`DB not found at: ${DB_PATH}`);
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD.replace(/\s/g, "")
  }
});
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

try {
  const info = await transporter.sendMail({
    from: `"Portal Backup" <${GMAIL_USER}>`,
    to: GMAIL_BACKUP_TO,
    subject: `Portal backup ${new Date().toLocaleDateString("en-MY")}`,
    text: `Automated backup.\n\nDB: ${DB_PATH}\nTime: ${new Date().toISOString()}`,
    attachments: [{ filename: `portal-backup-${timestamp}.db`, content: fs.readFileSync(DB_PATH) }]
  });
  console.log("Backup sent:", info.messageId);
  log(`Backup sent: ${info.messageId}`);
  process.exit(0);
} catch (err) {
  console.error("Backup failed:", err instanceof Error ? err.message : err);
  log(`Backup failed: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
}
