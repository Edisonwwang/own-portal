"use server";

import fs from "node:fs";
import path from "node:path";
import nodemailer from "nodemailer";

const DB_PATH = process.env.DB_PATH ?? path.join(process.cwd(), "data", "portal.db");

export async function sendBackupEmail(): Promise<{ success: true } | { error: string }> {
  const { GMAIL_USER, GMAIL_APP_PASSWORD, GMAIL_BACKUP_TO } = process.env;

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !GMAIL_BACKUP_TO) {
    return { error: "Gmail credentials not configured. Check .env.local." };
  }

  if (!fs.existsSync(DB_PATH)) {
    return { error: `Database file not found at ${DB_PATH}` };
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
    await transporter.sendMail({
      from: `"Personal Portal Backup" <${GMAIL_USER}>`,
      to: GMAIL_BACKUP_TO,
      subject: `Portal backup ${new Date().toLocaleDateString("en-MY")}`,
      text: `Automated backup from your Personal Portal.\n\nDB path: ${DB_PATH}\nTimestamp: ${new Date().toISOString()}`,
      attachments: [
        {
          filename: `portal-backup-${timestamp}.db`,
          content: fs.readFileSync(DB_PATH),
          contentType: "application/octet-stream"
        }
      ]
    });

    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error sending backup email" };
  }
}
