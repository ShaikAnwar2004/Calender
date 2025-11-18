📅 Google Calendar – Week View Clone

A full-stack, functional replica of Google Calendar’s Week View, built using React + TypeScript + Node.js + MongoDB.
Supports creating, updating, deleting events, drag-to-create selection, day highlighting, sticky headers, and a real-time “now line” indicator — just like the real Google Calendar.

🚀 Features
🎨 UI / UX (Google Calendar Style)

Weekly grid layout (Mon–Sun)
Sticky day headers
Hourly timeline (00:00 – 23:00)
Today column highlight
Real-time red “current time” line
Responsive layout — no horizontal scrolling
Smooth drag-to-create event creatio
Click an event to edit/delete
Scroll to current time button
Local time display

📦 Frontend (React + TypeScript)

Vite + React 19 + TypeScript
Context API for global state
date-fns for date utilities
Clean UI with custom CSS
Modular components:
WeekGrid
DayColumn
EventBlock
EventModal
ScrollToNow
CalendarContext

🛠 Backend (Node.js + Express + MongoDB)

Express API for events
CRUD operations
Mongoose models
TypeScript backend
ESM-compatible
Supports real dates and ISO timestamps

🧰 Tech Stack
Frontend

React 19
TypeScript
Vite
date-fns
Axios
CSS3

Backend

Node.js
Express
TypeScript
Mongoose
MongoDB

📁 Folder Structure
calendar-week-view/
│
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   └── Event.ts
│   │   ├── routes/
│   │   │   └── events.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── Shared/
│   │   │   └── WeekView/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── index.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── README.md

🛠 Installation & Setup
1️⃣ Clone the repo
git clone https://github.com/ShaikAnwar2004/Calender.git
cd Calender

🗄 Backend Setup (Node.js + MongoDB)
Install dependencies:
cd backend
npm install

Start MongoDB (if local)

Windows:

net start MongoDB


Linux/macOS:

sudo systemctl start mongod

Create .env (optional)
MONGO_URI=mongodb://127.0.0.1:27017/calendar
PORT=4000

Run backend:
npm run dev


Your backend runs at:

http://localhost:4000

🖥 Frontend Setup (React + Vite)
Install dependencies:
cd frontend
npm install

Add .env
VITE_API_URL=http://localhost:4000

Run frontend:
npm run dev


Your frontend runs at:

http://localhost:5173

🔌 API Endpoints
GET /api/events?start=ISO&end=ISO

Fetch all events in a date range.

POST /api/events

Create event
Body:

{
  "title": "Meeting",
  "start": "2025-11-20T10:00:00.000Z",
  "end": "2025-11-20T11:00:00.000Z",
  "color": "#3b82f6"
}

PUT /api/events/:id
Update event.
DELETE /api/events/:id
Delete event.


⭐ Future Enhancements

Monthly view
Drag-to-resize events
Overlapping event auto-layout
Multiple calendars & colors
Google login & cloud sync

❤️ Author

Shaik Anwar Basha
Full Stack Developer
GitHub: https://github.com/ShaikAnwar2004
