<div align="center">

<img src="frontend/src/assets/chat-app-assets/logo.png" alt="QuickChat logo" width="220" />

# QuickChat

### A focused, real-time chat experience built with the MERN stack

<p>
	<a href="#features">Features</a> ·
	<a href="#tech-stack">Tech stack</a> ·
	<a href="#getting-started">Getting started</a> ·
	<a href="#api-overview">API</a>
</p>

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=111827)
![Node.js](https://img.shields.io/badge/Node.js-ESM-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?style=for-the-badge&logo=socket.io&logoColor=white)

</div>

<br />

<div align="center">
	<img src="frontend/src/assets/chat-app-assets/pic1.png" alt="QuickChat media preview" width="31%" />
	<img src="frontend/src/assets/chat-app-assets/pic2.png" alt="QuickChat shared media preview" width="31%" />
	<img src="frontend/src/assets/chat-app-assets/pic3.png" alt="QuickChat conversation preview" width="31%" />
</div>

## Overview

QuickChat is a full-stack messaging application for private, real-time conversations. It combines a responsive React interface with an Express API, MongoDB persistence, Socket.IO presence and messaging events, and Cloudinary image uploads.

The interface is designed around the everyday chat workflow: find a person, see their presence, open a conversation, share media, and keep the conversation moving.

## First WebSocket Project

> **QuickChat is my first application built with WebSockets.**

This project was an important step in learning how real-time applications work beyond standard request-and-response APIs. I used **Socket.IO** to build live online presence and instant message events between users. The app manages socket connections, identifies users through handshake data, broadcasts online users, delivers new messages, and cleans up disconnected users.

Building this chat app helped me understand real-time event-driven communication, client-server synchronization, connection lifecycle management, and how to combine WebSockets with REST APIs for a complete product experience.

## Features

| Area | What is included |
| --- | --- |
| Authentication | Sign up, log in, JWT-protected routes, logout, and profile updates |
| Conversations | Private user-to-user chats with message history |
| Realtime | Socket.IO online presence and incoming message events |
| Media | Image uploads through Cloudinary and a shared media panel |
| Inbox | Search users and display unseen message counts |
| Responsive UI | Desktop three-panel layout with mobile-friendly navigation |
| Feedback | Toast notifications for authentication, profile, and request states |

## Tech Stack

### Frontend

- React 19 with Vite
- React Router
- Tailwind CSS
- Axios
- Socket.IO Client
- React Hot Toast

### Backend

- Node.js with Express
- MongoDB with Mongoose
- Socket.IO
- JWT authentication
- bcryptjs password hashing
- Cloudinary media storage

## Project Structure

```text
chat-app/
├── backend/
│   ├── controllers/       # Authentication and message logic
│   ├── lib/               # Database, Cloudinary, and JWT helpers
│   ├── middleware/        # Protected route middleware
│   ├── models/            # User and message schemas
│   ├── routes/            # User and message API routes
│   └── server.js          # Express and Socket.IO server
├── frontend/
│   ├── context/           # Authentication and chat state
│   └── src/               # Pages, components, styles, and assets
└── Readme.md
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- A MongoDB database
- A Cloudinary account for image uploads

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/quickchat.git
cd quickchat
```

### 2. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 3. Configure environment variables

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET=replace-with-a-long-random-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Create `frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:5000
```

Never commit either `.env` file or any secret credentials.

### 4. Run the application

Open two terminals from the project root.

**Backend**

```bash
cd backend
npm run dev
```

**Frontend**

```bash
cd frontend
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

> Run only one backend process at a time. If port `5000` is already in use, stop the existing Node process before starting another server.

## API Overview

The backend serves these primary route groups:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/user/signup` | Create an account |
| `POST` | `/api/user/login` | Authenticate a user |
| `GET` | `/api/user/check` | Verify the current session |
| `PUT` | `/api/user/updateprofile` | Update profile details |
| `GET` | `/api/messages/users` | Load the sidebar user list |
| `GET` | `/api/messages/:id` | Load a conversation |
| `POST` | `/api/messages/send/:id` | Send a text or image message |
| `PUT` | `/api/messages/mark/:id` | Mark a message as seen |

Protected endpoints expect the JWT in the `token` request header.

## Available Scripts

### Frontend

```bash
npm run dev       # Start Vite development server
npm run build     # Create a production build
npm run lint      # Run ESLint
npm run preview   # Preview the production build
```

### Backend

```bash
npm run dev       # Start the API with Node watch mode
npm start         # Start the API normally
```

## Contributing

1. Create a feature branch.
2. Keep secrets out of commits.
3. Run the frontend build and lint checks before opening a pull request.
4. Describe the user-visible behavior and any environment changes in the pull request.

## License

This project is currently available for personal and educational use. Add a formal license before publishing it for wider reuse.

<div align="center">

Made with React, Node.js, MongoDB, and Socket.IO.

</div>
