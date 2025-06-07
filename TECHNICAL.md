# Technical Documentation: Online Learning Platform

## 📊 System Architecture

```mermaid
graph TD
    Client[Web Browser] --> |HTTP Requests| Server[Express Server]
    Server --> |Database Operations| DB[(SQLite Database)]
    Server --> |Render Views| Views[EJS Templates]
    Views --> |HTML/CSS/JS| Client

    subgraph Frontend
        Client
        Views
        Static[Static Files]
    end

    subgraph Backend
        Server
        DB
        API[AJAX Routes]
    end

    API --> |CRUD & Search| DB
    Static --> |Assets| Client
```

## 🏗️ Code Structure

### 1. Frontend Architecture

```mermaid
graph LR
    Views[EJS Views] --> Partials[Reusable Partials]
    Partials --> Header[Header]
    Partials --> Footer[Footer]

    Static[Static Assets] --> Styles[CSS Files]
    Static --> Scripts[main.js]

    Views --> Pages[Page Templates]
    Pages --> Home[Home Page]
    Pages --> Courses[Courses + AJAX Search]
    Pages --> Events[Events + AJAX Filters]
    Pages --> Instructors[Instructor Profiles]
    Pages --> Contact[Contact Form + AJAX Validation]
    Pages --> FAQ[FAQ Page]
    Pages --> Activity[Quiz Cube Game]
```

### 2. Backend Architecture

```mermaid
graph TD
    Server[Express Server] --> Routes[Route Handlers]
    Routes --> Views[EJS Render Engine]
    Routes --> Database[SQLite DB via better-sqlite3]
    Routes --> JSON[AJAX Endpoints]
```

## 💾 Database Design

```mermaid
erDiagram
    COURSES ||--o{ EVENTS : "has"
    INSTRUCTORS ||--o{ COURSES : "teaches"
    INSTRUCTORS ||--o{ EVENTS : "hosts"

    COURSES {
        int id PK
        string name
        string description
        string duration
        int instructor_id FK
        datetime created_at
    }

    INSTRUCTORS {
        int id PK
        string name
        string bio
        string contact_details
        string subjects_taught
        datetime created_at
    }

    EVENTS {
        int id PK
        string title
        string description
        datetime date_time
        string type
        int instructor_id FK
        int course_id FK
        datetime created_at
    }

    CONTACT_SUBMISSIONS {
        int id PK
        string name
        string email
        string message
        datetime submission_date
    }
```

## 🔄 AJAX Features & API Flow

### 1. AJAX Contact Form Flow
- User fills form → JS validates input
- Data sent via `fetch('/contact')`
- Server stores data in SQLite → responds with JSON
- Status message appears without reloading the page

### 2. AJAX Event Filters Flow
- User changes filter dropdowns
- JS sends dynamic query to `/events/filter`
- Server queries DB and returns filtered HTML
- Frontend replaces event list with new results

### 3. AJAX Search on Courses Page
- User types in search bar
- JS fetches results from `/courses/search`
- DB filters course titles/descriptions
- Matching courses displayed live

## 🔐 Security Considerations

- Input validation in forms (JS and server-side)
- Prepared statements used to prevent SQL injection
- AJAX responses sanitized
- Contact form uses `required` + length checks

## ♿ Accessibility & Standards

- All pages conform to **W3C validation**
- Clear heading structure (`<h1>`, `<h2>`)
- `aria-label`, `role`, and `aria-live` used in forms and AJAX UI
- All navigation uses semantic elements
- Yellow headings have contrast-enhancing `text-shadow`

## ⚙️ Performance Notes

- Database uses WAL mode for better speed
- Prepared statements optimize queries
- AJAX reduces full page reloads
- Static assets served from `/public`

## 📚 Tools Used

- [Express.js](https://expressjs.com/)
- [EJS](https://ejs.co/)
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
- [DB Browser for SQLite](https://sqlitebrowser.org/)
- [VS Code](https://code.visualstudio.com/)
- Git & GitHub for version control
