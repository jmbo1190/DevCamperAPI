const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');   // module name is bcryptjs
const jwt = require('jsonwebtoken');
                                      // a module named bcrypt exists but gives lots of problems

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

// Encrypt password (middleware) using bcrypt
UserSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10); // nb rounds (10 recommeded), 
                                           // higher = more secure but heavier
    this.password = await bcrypt.hash(this.password, salt);                                       
})

// Sign JWT (JasonWebToken) and return 
// see https://jwt.io, https://github.com/auth0/node-jsonwebtoken
// JWT has 3 Base-64 encode parts separated with dots:
//   1) Header: algorithm (default: HS256) & token type
//   2) Payload: sub (subject id), name, generated 'iat' (issuet at, seconds since Unix epoch)
//   3) Signature
// Define a method (not a 'static') which runs from an instantiated object
UserSchema.methods.getSignedJwt = function(){
    return jwt.sign({ id: this._id }
        , process.env.JWT_SECRET
        , { expiresIn: process.env.JWT_EXPIRE }
        );
}


// Match user-enetered password against hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// Create and export the User model, based on UserSchema
module.exports = mongoose.model('User', UserSchema);

