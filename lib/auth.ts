import { cookies } from "next/headers";
import crypto from "node:crypto";
import { SESSION_COOKIE_NAME } from "./auth-constants";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

type SessionPayload = {
  exp: number;
};

function base64UrlEncode(input: string) {
  return Buffer.from(input).toString("base64url");
}

function base64UrlDecode(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function requireSessionSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("SESSION_SECRET is required");
  }

  return secret;
}

function sign(value: string) {
  return crypto.createHmac("sha256", requireSessionSecret()).update(value).digest("base64url");
}

export function createSessionValue() {
  const payload: SessionPayload = {
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function setSessionCookie() {
  cookies().set({
    name: SESSION_COOKIE_NAME,
    value: createSessionValue(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS
  });
}

export function verifySessionValue(value?: string) {
  if (!value) {
    return false;
  }

  const [encodedPayload, signature] = value.split(".");
  if (!encodedPayload || !signature) {
    return false;
  }

  const expectedSignature = sign(encodedPayload);
  const expected = Buffer.from(expectedSignature);
  const actual = Buffer.from(signature);

  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) {
    return false;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SessionPayload;
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function getSession() {
  const session = cookies().get(SESSION_COOKIE_NAME)?.value;

  return verifySessionValue(session) ? { authenticated: true } : null;
}

export function verifyPassword(password: string) {
  const passwordHash = process.env.AUTH_PASSWORD_HASH;

  if (!passwordHash) {
    throw new Error("AUTH_PASSWORD_HASH is required");
  }

  const [scheme, iterationsValue, salt, expectedHash] = passwordHash.split(":");
  if (scheme !== "pbkdf2" || !iterationsValue || !salt || !expectedHash) {
    throw new Error("AUTH_PASSWORD_HASH must use pbkdf2:iterations:salt:hash format");
  }

  const iterations = Number(iterationsValue);
  const hash = crypto.pbkdf2Sync(password, salt, iterations, 32, "sha256").toString("base64url");

  const expected = Buffer.from(expectedHash);
  const actual = Buffer.from(hash);

  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}
