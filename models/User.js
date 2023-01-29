const mongoose = require('mongoose');

// Create the User Schema
const UserSchema = new mongoose.Schema(
    // define model fields
    {
        name: {
            type: String,
            required: [true, 'Please add a name']
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
            ]
        },
        role: {
            type: String,
            enum: ['user', 'publisher'],  // changing the role to admin will need to be done 
                                          // by directly accessing the database e.g. with Compass
            default: 'user',
        },
        password: {
            type: String,
            required: [true, 'please add a password'],
            minlength: 6,
            select: false   // will not show / return the password when we get a user through our API
        },
        restPasswordToken: String,
        restPasswordExpitre: Date,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
)

// Create and export the User model, based on UserSchema
module.exports = mongoose.model('User', UserSchema);

