require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user.route');
const questionRoutes = require('./routes/question.route');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);

if (process.env.NODE_ENV !== 'test') {
    const connectToMongoDB = async () => mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to MongoDB')).catch(error => console.error('Error connecting to MongoDB:', error));
    connectToMongoDB().catch((err) => console.log(err));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));