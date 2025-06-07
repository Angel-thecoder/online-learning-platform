import express from 'express';

const app = express();
const port = 5000;

app.get('/', (req, res) => {
    res.send('Test server is running!');
});

app.listen(port, '127.0.0.1', () => {
    console.log(`Test server running at http://127.0.0.1:${port}`);
}); 