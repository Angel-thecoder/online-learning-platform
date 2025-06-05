import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5000;

// Basic middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database connection
const dbPath = path.join(__dirname, 'db', 'database.sqlite');
let db;
try {
    db = new Database(dbPath);
    // Enable WAL mode for better performance
    db.pragma('journal_mode = WAL');
    console.log('Database connected successfully');
} catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
}

// Home route
app.get('/', (req, res) => {
    res.render('pages/home', {
        title: 'Home - Online Learning Platform'
    });
});

// Courses route with better error handling
app.get('/courses', (req, res, next) => {
    try {
        console.log('Fetching courses...');
        const courses = db.prepare(`
            SELECT c.*, i.name as instructor_name 
            FROM courses c 
            LEFT JOIN instructors i ON c.instructor_id = i.id 
            ORDER BY c.created_at DESC
        `).all();
        
        console.log(`Found ${courses.length} courses`);
        res.render('pages/courses', {
            title: 'Courses - Online Learning Platform',
            courses: courses
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        next(error);
    }
});

// Instructors route
app.get('/instructors', (req, res, next) => {
    try {
        console.log('Fetching instructors...');
        const instructors = db.prepare('SELECT * FROM instructors ORDER BY name').all();
        
        console.log(`Found ${instructors.length} instructors`);
        res.render('pages/instructors', {
            title: 'Instructors - Online Learning Platform',
            instructors: instructors
        });
    } catch (error) {
        console.error('Error fetching instructors:', error);
        next(error);
    }
});

// Events route
app.get('/events', (req, res, next) => {
    try {
        console.log('Fetching events...');
        const events = db.prepare(`
            SELECT e.*, 
                   i.name as instructor_name,
                   c.name as course_name
            FROM events e
            LEFT JOIN instructors i ON e.instructor_id = i.id
            LEFT JOIN courses c ON e.course_id = c.id
            ORDER BY e.date_time DESC
        `).all();
        
        console.log(`Found ${events.length} events`);
        res.render('pages/events', {
            title: 'Events - Online Learning Platform',
            events: events
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        next(error);
    }
});

// FAQ route
app.get('/faq', (req, res) => {
    res.render('pages/faq', {
        title: 'FAQ - Online Learning Platform'
    });
});

// Contact routes
app.get('/contact', (req, res) => {
    res.render('pages/contact', {
        title: 'Contact Us - Online Learning Platform'
    });
});

app.post('/contact', (req, res, next) => {
    try {
        const { name, email, message } = req.body;
        
        // Validate input
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Store in database
        db.prepare(`
            INSERT INTO contact_submissions (name, email, message)
            VALUES (?, ?, ?)
        `).run(name, email, message);

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error saving contact submission:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Simple test route
app.get('/test', (req, res) => {
    res.send('Test route works!');
});

// Add this new test route after your existing routes
app.get('/test-db', (req, res) => {
    try {
        // Test database connection and queries
        const courses = db.prepare('SELECT * FROM courses').all();
        const instructors = db.prepare('SELECT * FROM instructors').all();
        
        res.json({
            status: 'success',
            message: 'Database connection working',
            data: {
                coursesCount: courses.length,
                instructorsCount: instructors.length,
                courses: courses,
                instructors: instructors
            }
        });
    } catch (error) {
        console.error('Database test error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Database test failed',
            error: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).send('Something went wrong!');
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Start server
app.listen(port, '127.0.0.1', () => {
    console.log(`Server running at http://127.0.0.1:${port}`);
    console.log(`Test route: http://127.0.0.1:${port}/test`);
});