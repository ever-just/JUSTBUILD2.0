import { Hono } from "hono";
import { cors } from "hono/cors";
import { issueWebhookHandler } from "./github/issue-webhook.js";

export const app = new Hono();

// Add CORS middleware to allow frontend requests
app.use("*", cors({
  origin: [
    "https://justbuild.everjust.com",
    "http://localhost:3000",
    "https://localhost:3000"
  ],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: [
    "Content-Type", 
    "Authorization", 
    "X-Requested-With",
    "Accept",
    "Origin",
    "User-Agent",
    "DNT",
    "Cache-Control",
    "X-Mx-ReqToken",
    "Keep-Alive",
    "X-Requested-With",
    "If-Modified-Since",
    "X-Hub-Signature-256",
    "x-github-delivery",
    "x-github-event",
    // Authentication headers for direct browser connections
    "x-github-installation-name",
    "x-github-installation-id", 
    "x-github-installation-token",
    "x-github-token",
    "x-github-user-id",
    "x-github-user-login"
  ],
  credentials: true
}));

app.post("/webhooks/github", issueWebhookHandler);
