# Online Learning Platform

A professional, full-stack web application built with **Node.js**, **Express**, and **SQLite**. The platform allows users to browse courses, view instructor profiles, explore live educational events, and interact with a dynamic contact form — all designed to support online learning.

---

## 🌟 Key Features

### 📚 Course Management
- View detailed course descriptions
- Instructor names and durations included
- AJAX-powered live course search
- Fully database-driven

### 👨‍🏫 Instructor Profiles
- Instructor bios, subjects taught, and contact details
- Connected to courses and events

### 📅 Events & Live Sessions
- Live sessions, webinars, and special guest lectures
- Filter events by year, type, instructor, and course category using AJAX
- Dynamic event detail page with registration status

### 📬 Contact Form
- Accessible form with client-side and AJAX validation
- Submissions stored in SQLite
- Realtime feedback without page reloads

### ❓ FAQ Page
- Clean, W3C-valid questions and answers
- Responsive layout with semantic markup

### 🎲 Interactive Activity Page
- Custom "Quiz Cube Spinner" using JavaScript and DOM interaction
- Questions tied to course topics
- Visual cube animation and interactive responses

---

## 🛠️ Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite (via better-sqlite3)
- **Template Engine:** EJS

### Frontend
- **HTML5**, **CSS3**, **JavaScript (ES6)**
- AJAX (native fetch API)
- Responsive and accessible UI
- Media queries and W3C-compliant markup

---

## 📁 Folder Structure

```
Online-Learning-Platform/
├── db/                  # SQLite DB and setup scripts
│   ├── cleanup.js
│   ├── database.sqlite
│   ├── database.sqlite-shm
│   ├── database.sqlite-wal
│   └── init.js
├── node_modules
├── public/              # Static assets
│   ├── styles/
│   │   └── style.css
│   └── scripts/
│       └── main.js
├── views/
│   ├── pages/
│   │   ├── activity.ejs
│   │   ├── contact.ejs
│   │   ├── courses.ejs
│   │   ├── event-detail.ejs
│   │   ├── events.ejs
│   │   ├── faq.ejs
│   │   ├── home.ejs
│   │   └── instructors.ejs
│   └── partials/
│       ├── header.ejs
│       └── footer.ejs
├── .gitignore
├── index.mjs
├── package-lock.json
├── package.json
├── README.md
├── TECHNICAL.md
└── test-server.js   #To test the server functioning properly
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js and npm installed
- Git installed
- SQLite and DB Browser (optional for visual inspection)

### Installation

```bash
git clone https://github.com/Angel-thecoder/online-learning-platform.git
cd online-learning-platform
npm install
```

### Run the Server

```bash
node index.mjs
```

Then open your browser at:  
🔗 `http://localhost:5000`

---

## 🔍 Useful Routes

- `/` – Home
- `/courses` – Course listings (with AJAX search)
- `/instructors` – Instructor profiles
- `/events` – Events and live sessions (with filters)
- `/contact` – AJAX-powered contact form
- `/faq` – FAQ page
- `/activity` – Interactive quiz game

---

## ✅ Standards & Validation

- All pages pass W3C validation
- Pages use semantic HTML and proper heading levels
- Accessibility features like `aria-label`, `aria-live`, and keyboard focus included
- AJAX used to enhance interactivity without full reloads

---

## 📦 Project Setup Scripts

You can also run:
```bash
npm run init-db     # Initializes database
npm run test-db     # Confirms DB connection
```

---

## 🔒 Security and Accessibility

- Server- and client-side validation
- Prepared SQL statements to prevent injection
- Responsive UI with high-contrast headings
- Text alternatives, role labels, and live regions

---

## ✍️ Author

Created as part of a university web technologies module — 2024/2025.  
For any queries, please use the [Contact Page](http://localhost:5000/contact).

