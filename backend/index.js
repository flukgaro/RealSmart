// index.js
const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/user');
const cors = require('cors'); // Import cors
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/users', userRouter);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB', err));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


