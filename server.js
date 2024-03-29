// server.js

// Import the app instance from app.js
import app from './app.js';

// Define a port number
const PORT = 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
