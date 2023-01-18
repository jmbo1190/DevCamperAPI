const mongoose =require('mongoose');

const connectDB = async () => {
    mongoose.set('strictQuery', true);  // DeprecationWarning: Mongoose: the `strictQuery` option will be
                                        // switched back to `false` by default in Mongoose 7.
    const conn = await(mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        //useCreateIndex: true,
        //useFindandModify: false,
    }));

    // From the Mongoose 6.0 docs(https://mongoosejs.com/docs/migrating_to_6.html#no-more-deprecation-warning-options):
    //
    // useNewUrlParser, useUnifiedTopology, useFindAndModify, and useCreateIndex are no longer supported options. 
    // Mongoose 6 always behaves as if useNewUrlParser, useUnifiedTopology, and useCreateIndex are true, 
    // and useFindAndModify is false. Please remove these options from your code.
        
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
}

module.exports = connectDB;
