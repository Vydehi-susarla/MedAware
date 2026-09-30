# MedAware (Waste to Worth)

A full-stack platform where people donate unused medicines and others in need can claim them. It also has an NLP chatbot that answers questions about handling expired medicines.


## Features

- **Donate:** donors list unused medicines with name, expiry date and quantity.
- **Claim with a secret code:** a recipient claims a listing and uses a secret code to collect it from the donor.
- **Expired medicine chatbot:** an NLP chatbot answers safe-disposal and handling questions across 2 real-time user flows.
- **Secure login:** JWT-authenticated sessions for donors and recipients.
- **REST API** for all donation and claim operations.

## How the claim flow works

```
Donor lists medicine → Recipient requests it → Secret code generated
→ Recipient shares code at pickup → Donor verifies code → Claim completed
```

## Tech stack

| Layer | Tools |
| --- | --- |
| Frontend | React.js |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Auth | JWT |
| Chatbot | NLP-based query handling |

## Setup

**Requirements:** Node.js 18+, MongoDB (local or Atlas)



**Backend**
```bash
cd server
npm install
```


```bash
npm start
```

**Frontend**
```bash
cd client
npm install
npm start
```

## API overview

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/medicines` | List available medicines |
| POST | `/api/medicines` | Donate a medicine |
| POST | `/api/medicines/:id/claim` | Claim a medicine |
| POST | `/api/chatbot` | Ask the chatbot a question |

Change these to match your actual routes.


## Future work

- Expiry-date alerts for donors
- Location-based search for nearby donations
- Pharmacist verification of donated medicines
