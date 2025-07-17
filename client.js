import fs from "fs";
import https from "https";
import { CompactEncrypt, importSPKI } from "jose";

(async () => {
  // Load server public key (SPKI PEM)
  const pubPem = fs.readFileSync("./keys/public.pem", "utf8");
  const publicKey = await importSPKI(pubPem, "RSA-OAEP");

  // Prepare payload
  const payload = { userId: "kh_048", action: "getJob" };
  const encoder = new TextEncoder();

  // Create JWE
  const jwe = await new CompactEncrypt(encoder.encode(JSON.stringify(payload)))
    .setProtectedHeader({ alg: "RSA-OAEP", enc: "A256GCM" })
    .encrypt(publicKey);


  // HTTPS request options with client cert for mTLS
  const reqOptions = {
    hostname: "localhost",
    port: 4433,
    path: "/secure-data",
    method: "POST",
    key: fs.readFileSync("./certs/client-key.pem"),
    cert: fs.readFileSync("./certs/client-cert.pem"),
    ca: fs.readFileSync("./certs/server.crt"),
    headers: { "Content-Type": "application/json" },
  };

  const req = https.request(reqOptions, (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => console.log("Server response:", data));
  });

  req.on("error", console.error);
  req.write(JSON.stringify({ jwe }));
  req.end();
})();
