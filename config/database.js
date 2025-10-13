const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // MongoDB connection string - update this with your MongoDB URL
       const mongoURI = process.env.MONGODB_URI || 'mongodb://db:27017/simple-notes';
        
        await mongoose.connect(mongoURI);
        
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;