import fs from "fs";
import https from "https";
import express from "express";
import { compactDecrypt } from "jose";
import { createPrivateKey } from "crypto";


const app = express();
app.use(express.json());

// TLS + mTLS options
const options = {
  key: fs.readFileSync("./certs/server.key"),
  cert: fs.readFileSync("./certs/server.crt"),
  ca: fs.readFileSync("./certs/client-cert.pem"),
  requestCert: true,
  rejectUnauthorized: true,
  minVersion: "TLSv1.3",
};

// Load RSA private key for JWE decryption
// const privateKey = fs.readFileSync("./keys/private.pem");

const privateKey = createPrivateKey({
  key: fs.readFileSync("./keys/private.pem"),
  format: "pem",
});

app.post("/secure-data", async (req, res) => {
  try {
    const { jwe } = req.body;
    const { plaintext } = await compactDecrypt(jwe, privateKey);
    const data = JSON.parse(new TextDecoder().decode(plaintext));
    console.log("[Decrypted Data]", data);
    res.json({ status: "success", data });
  } catch (err) {
    console.error("[Decryption Error]", err);
    res.status(400).json({ error: "Invalid JWE" });
  }
});

https.createServer(options, app).listen(4433, () => {
  console.log("🚀 Secure server running at https://localhost:4433");
});
