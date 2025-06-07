import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const app = express();
const port = 5000;

// Enable __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connect to SQLite database
const dbPath = path.join(__dirname, 'db', 'database.sqlite');
let db;
try {
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  console.log('Database connected');
} catch (error) {
  console.error('Failed to connect to database:', error);
  process.exit(1);
}

// Routes

// Home
app.get('/', (req, res) => {
  res.render('pages/home', {
    title: 'Home - Online Learning Platform'
  });
});

// Courses
app.get('/courses', (req, res, next) => {
  try {
    const courses = db.prepare(`
      SELECT c.*, i.name AS instructor_name
      FROM courses c
      LEFT JOIN instructors i ON c.instructor_id = i.id
      ORDER BY c.created_at DESC
    `).all();
    res.render('pages/courses', {
      title: 'Courses - Online Learning Platform',
      courses
    });
  } catch (error) {
    next(error);
  }
});

app.get('/courses/search', (req, res) => {
  try {
    const query = req.query.q?.toLowerCase() || '';

    const courses = db.prepare(`
      SELECT c.*, i.name AS instructor_name
      FROM courses c
      LEFT JOIN instructors i ON c.instructor_id = i.id
      WHERE LOWER(c.name) LIKE ? OR LOWER(c.description) LIKE ?
      ORDER BY c.created_at DESC
    `).all(`%${query}%`, `%${query}%`);

    res.render('partials/course-results', { courses });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).send('Server error');
  }
});


// Instructors
app.get('/instructors', (req, res, next) => {
  try {
    const instructors = db.prepare(`
      SELECT * FROM instructors ORDER BY name
    `).all();
    res.render('pages/instructors', {
      title: 'Instructors - Online Learning Platform',
      instructors
    });
  } catch (error) {
    next(error);
  }
});

// Events
app.get('/events', (req, res, next) => {
  try {
    const events = db.prepare(`
      SELECT e.*, i.name AS instructor_name, c.name AS course_name
      FROM events e
      LEFT JOIN instructors i ON e.instructor_id = i.id
      LEFT JOIN courses c ON e.course_id = c.id
      ORDER BY e.date_time DESC
    `).all();
    res.render('pages/events', {
      title: 'Events & Live Sessions - Online Learning Platform',
      events
    });
  } catch (error) {
    next(error);
  }
});

app.get('/events/filter', (req, res, next) => {
  try {
    const { year, type, course, instructor } = req.query;

    let query = `
      SELECT e.*, i.name AS instructor_name, c.name AS course_name
      FROM events e
      LEFT JOIN instructors i ON e.instructor_id = i.id
      LEFT JOIN courses c ON e.course_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (year) {
      query += ' AND strftime("%Y", e.date_time) = ?';
      params.push(year);
    }

    if (type) {
      query += ' AND e.type = ?';
      params.push(type);
    }

    if (course) {
      query += ' AND c.name = ?';
      params.push(course);
    }

    if (instructor) {
      query += ' AND i.name = ?';
      params.push(instructor);
    }

    query += ' ORDER BY e.date_time DESC';

    const filteredEvents = db.prepare(query).all(...params);

    res.render('partials/event-list.ejs', { events: filteredEvents });
  } catch (error) {
    console.error('Error filtering events:', error);
    res.status(500).send('Error loading events');
  }
});

app.get('/events/:id', (req, res, next) => {
  try {
    const eventId = req.params.id;

    const event = db.prepare(`
      SELECT e.*, i.name AS instructor_name, i.bio AS instructor_bio,
             c.name AS course_name
      FROM events e
      LEFT JOIN instructors i ON e.instructor_id = i.id
      LEFT JOIN courses c ON e.course_id = c.id
      WHERE e.id = ?
    `).get(eventId);

    if (!event) {
      return res.status(404).send('Event not found');
    }

    // Check if the event is in the past
    const eventDate = new Date(event.date_time);
    const isPast = eventDate < new Date();

    res.render('pages/event-detail', {
      title: `Event – ${event.title}`,
      event,
      isPast
    });
  } catch (error) {
    console.error('Error loading event detail:', error);
    next(error);
  }
});

app.get('/activity', (req, res) => {
  res.render('pages/activity', {
    title: 'Quiz Cube Spinner - Online Learning Platform'
  });
});


// FAQ (static page)
app.get('/faq', (req, res) => {
  res.render('pages/faq', {
    title: 'FAQ - Online Learning Platform'
  });
});

// Contact (GET)
app.get('/contact', (req, res) => {
  res.render('pages/contact', {
    title: 'Contact Us - Online Learning Platform'
  });
});

// Contact (POST)
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    db.prepare(`
      INSERT INTO contact_submissions (name, email, message)
      VALUES (?, ?, ?)
    `).run(name, email, message);
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Test route
app.get('/test', (req, res) => {
  res.send('Test route is working!');
});

// Test database route
app.get('/test-db', (req, res) => {
  try {
    const courses = db.prepare('SELECT * FROM courses').all();
    const instructors = db.prepare('SELECT * FROM instructors').all();
    res.json({
      message: 'Database is connected and queries are working',
      coursesCount: courses.length,
      instructorsCount: instructors.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Internal error:', err);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
