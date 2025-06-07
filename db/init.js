import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Enable WAL mode
db.pragma('journal_mode = WAL');

// Drop existing tables
db.exec(`
  DROP TABLE IF EXISTS events;
  DROP TABLE IF EXISTS contact_submissions;
  DROP TABLE IF EXISTS courses;
  DROP TABLE IF EXISTS instructors;
`);

// Create instructors table
db.exec(`
  CREATE TABLE instructors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    bio TEXT,
    contact_details TEXT,
    subjects_taught TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Create courses table
db.exec(`
  CREATE TABLE courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    instructor_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES instructors(id)
  );
`);

// Create events table
db.exec(`
  CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date_time TEXT,
    type TEXT,
    instructor_id INTEGER,
    course_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES instructors(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
  );
`);

// Create contact_submissions table
db.exec(`
  CREATE TABLE contact_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    submission_date DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('Tables created. Now inserting sample data...');

// Sample instructors
db.exec(`
  INSERT INTO instructors (name, bio, contact_details, subjects_taught) VALUES
  ('Kesse Antwi', 'Full-stack developer and tech mentor passionate about web technologies.', 'kesse@learningplatform.com', 'Web Development, JavaScript'),
  ('Ewura Kwakye', 'Data engineer specializing in databases and backend systems.', 'ewura@learningplatform.com', 'SQL, Data Analysis'),
  ('Ama Boateng', 'UI/UX designer with 5+ years in product design.', 'ama@learningplatform.com', 'Design Thinking, Figma, UX'),
  ('Yaw Ofori', 'Cloud expert focusing on scalable backend systems and DevOps.', 'yaw@learningplatform.com', 'AWS, DevOps, Cloud Architecture');
`);

// Sample courses
db.exec(`
  INSERT INTO courses (name, description, duration, instructor_id) VALUES
  ('Modern Web Development', 'A hands-on course in HTML, CSS, JS, and responsive design.', '8 weeks', 1),
  ('Database Systems', 'Understand relational databases using SQLite and SQL queries.', '6 weeks', 2),
  ('UI/UX Design Essentials', 'Learn the principles of user interface and experience design.', '5 weeks', 3),
  ('Intro to Cloud Computing', 'Fundamentals of cloud platforms like AWS and deployment practices.', '6 weeks', 4);
`);

// Sample events
db.exec(`
  INSERT INTO events (title, description, date_time, type, instructor_id, course_id) VALUES
  ('Intro to HTML & CSS (Live Session)', 'A beginner-friendly live session with live Q&A.', '2025-06-10T18:00:00', 'Live Session', 1, 1),
  ('Advanced SQL Workshop', 'Dive into SQL joins, indexes, and optimization.', '2025-06-15T16:00:00', 'Workshop', 2, 2),
  ('Design Sprint Challenge', 'Live design collaboration session led by Ama.', '2025-06-17T14:00:00', 'Live Session', 3, 3),
  ('Cloud Setup Q&A', 'Live troubleshooting session for new cloud users.', '2025-06-20T18:00:00', 'Q&A Session', 4, 4),
  ('Guest Lecture: Web Technologies', 'Special guest lecture on new frontend tools.', '2025-06-25T14:00:00', 'Guest Lecture', 1, 1);
`);

// Sample contact submissions
db.exec(`
  INSERT INTO contact_submissions (name, email, message) VALUES
  ('Bobby Mensah', 'bobby@example.com', 'I would like to know more about the live sessions.'),
  ('Akua Yeboah', 'akua@example.com', 'Is the database course suitable for beginners?');
`);

console.log('Sample data inserted successfully.');
