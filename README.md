
# Fastify + Vue 3 (Vite + TypeScript) Full Stack Starter

This is a full-stack boilerplate using **Fastify** for the backend and **Vue 3 with Vite + TypeScript** for the frontend. It allows for quick full-stack development with a clean structure and concurrent dev server.

---

## 📁 Folder Structure

```
my-app/
├── backend/         # Fastify backend
│   ├── server.js
│   └── .env
│
├── frontend/        # Vue 3 frontend with Vite
│   ├── src/
│   ├── index.html
│   └── vite.config.ts
│
├── package.json     # Root file with combined scripts
└── README.md
```

---

## 🚀 Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/ajayJ01/node-vue-app.git
cd your-repo-name
```

### 2. Install dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Go back to root
cd ..
```

### 3. Create `.env` file inside `backend/`

```env
PORT=3000
```

### 4. Run both frontend and backend together (from root)
```bash
npm run dev
```

---

## 🔧 Available Commands

From **project root**:

```bash
npm run dev          # Starts both backend and frontend
```

From **backend** folder:

```bash
npm run dev          # Starts only Fastify (nodemon)
```

From **frontend** folder:

```bash
npm run dev          # Starts only Vue app (Vite)
```

---

## 🔁 Working Flow

1. Fastify backend starts at [http://localhost:3000](http://localhost:3000)
2. Vue frontend starts at [http://localhost:5173](http://localhost:5173)
3. Vue can make API calls to backend (CORS enabled)
4. Example endpoint: `GET /` returns `{ message: "Hello from Fastify!" }`
5. Frontend fetches and displays this data using `fetch` or `axios`

---

## ⚙️ Tech Stack

- **Backend:** Fastify, Nodemon, Dotenv
- **Frontend:** Vue 3, Vite, TypeScript
- **Others:** Concurrently (for combined dev), CORS

---

## 📝 Future Improvements

- Add Vue Router
- Add Pinia for state management
- Add Axios for API calls
- Production build and deployment instructions

---

## 💡 Author

Made with ❤️ by Ajay Jakhar
