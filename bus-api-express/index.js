const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// Import route files
const connectRoutes = require('./routes/connect');
const tablesRoutes = require('./routes/tables');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Use the routes
app.use('/api', connectRoutes); // /api/connect
app.use('/api', tablesRoutes);    // /api/users

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
