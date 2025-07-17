## About:-

-> Secure Data Prototype is a proof-of-concept Express.js application that demonstrates secure communication using TLS 1.3, mutual TLS (mTLS), and JSON Web Encryption (JWE). 

-> It ensures end-to-end confidentiality by encrypting both the transport channel and the data payload, suitable for scenarios requiring high-assurance data transfer between verified parties.

## Setup:-

1. Generate TLS certs and RSA keys (see earlier instructions).
    ### Generating Keys and Certificates:-
    #### 1) Server and Client TLS Certs (for mTLS): 
        # Note:- Use /CN=localhost when generating the server cert, and /CN=YourName or anything else for client cert — but the CN of server must be localhost to match client hostname in HTTPS.
        
        # Commands:-

        mkdir certs
       
        openssl req -x509 -newkey rsa:4096 -keyout certs/server.key -out certs/server.crt -days 365 -nodes
       
        openssl req -x509 -newkey rsa:4096 -keyout certs/client-key.pem -out certs/client-cert.pem -days 365 -nodes

    #### 3) RSA Key Pair for JWE:
        # Commands:-
   
        mkdir keys
   
        openssl genrsa -out keys/private.pem 2048
   
        openssl rsa -in keys/private.pem -pubout -out keys/public.pem


3. Install dependencies:
   ```bash
   npm install
   ```

## Usage:-

1. **Start server** (listening on https://localhost:4433):
   ```bash
   node server.js
   ```
2. **Run client** to send a JWE payload:
   ```bash
   node client.js
   ```


Note:- Folder structure:

<img width="287" height="327" alt="image" src="https://github.com/user-attachments/assets/ce9725ed-8c0d-4261-88d0-b1830e7c462e" />
