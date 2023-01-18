// Convention for model names: singular and capitalized

const mongoose = require('mongoose');

const BootcampSchema = new mongoose.Schema({
    // name: String,  // allowed if we do not need any validation
    name: {
        type: String,
        // required: true, // allowed but without custom message
        required: [true, "Please add a name"],  // with a custom message
        unique: true, // make sure bootcamp names are unique
        trim: true,   // avoid trailing spaces
        maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    slug: String,   // basically a URL-friendly version of the name
                    // e.g. for      name = "DevCentral Bootcamp",
                    // we could have slug = "devcentral-bootcamp"
                    // (created by package 'slugify')
    description: {
        type: String,
        // required: true, // allowed but without custom message
        required: [true, "Please add a description"],  // with a custom message
        maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    website: {
        type: String,
        match: [
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,   // regex validation 
          'Please use a valid URL with HTTP or HTTPS'
        ]
      },
      phone: {
        type: String,
        maxlength: [20, 'Phone number can not be longer than 20 characters']
      },
      email: {
        type: String,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ]
      },
      address: {
        type: String,
        required: [true, 'Please add an address'] // used by a GeoCoder to get long & lat
      },
      location: {
        // GeoJSON Point
        type: {
          type: String,
          //required: true,
          enum: ['Point'],  // enum indicates the list of allowed values
        },
        coordinates: {
          type: [Number],
          //required: true,
          index: '2dsphere',
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
      },
      careers: {
        // Array of strings
        type: [String],
        required: true,
        enum: [
          'Web Development',
          'Mobile Development',
          'UI/UX',
          'Data Science',
          'Business',
          'Other'
        ]
      },
      averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must can not be more than 10']
      },
      averageCost: Number,
      photo: {
        type: String,  // for the filename
        default: 'no-photo.jpg'
      },
      housing: {
        type: Boolean,
        default: false
      },
      jobAssistance: {
        type: Boolean,
        default: false
      },
      jobGuarantee: {
        type: Boolean,
        default: false
      },
      acceptGi: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now  // use current date and time as defaults
      },
    // ADD THIS LATER WHEN ATHENTICATION IS IN PLACE
    //   user: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'User',
    //     required: true
    //   }

});


module.exports = mongoose.model('Bootcamp', BootcampSchema);
