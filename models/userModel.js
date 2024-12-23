const mongoose=require('mongoose');

const validator=require('validator');

const bcrypt=require('bcryptjs');

const userSchema=new mongoose.Schema({
        firstName: {
                type: String,
                required: [true, "Please enter your first name"],
                trim: true
        },
        lastName: {
                type: String,
                required: [true, "Please enter your last name"],
                trim: true
        },
        email: {
                type: String,
                required: [true, "Please enter your email"],
                unique: true,
                lowercase: true,
                validate: [validator.isEmail, 'Please enter a valid email']
        },
        photo:String,
        
        password:{
                type:String,
                required:[true,'please enter a password'],
                minlength:5,
                select:false

        },
        
        active:{
                type:Boolean,
                default:true,
                select:false
        },

        
        collegeName: {
                type: String,
                required: [true, "Please enter your college name"],
                trim: true
        },
        specialization: {
                type: String,
                required: [true, "Please enter your specialization"],
                enum: ['Undergraduate', 'Postgraduate', 'Doctorate'],
        },
        course: {
                type: String,
                required: [true, "Please enter your course"],
                trim: true
        },
        branch: {
                type: String,
                required: [true, "Please enter your branch/stream"],
                trim: true
        },
        passoutYear: {
                type: Number,
                required: [true, "Please enter your pass-out year"],
                min: [2024, "Pass-out year cannot be in the past"],
                max: [2030, "Pass-out year too far in the future"]
        },
        cgpa: {
                type: Number,
                required: [true, "Please enter your CGPA"],
                min: [0, "CGPA cannot be negative"],
                max: [10, "CGPA cannot be more than 10"]
        },
        gender: {
                type: String,
                required: [true, "Please specify your gender"],
                enum: ['Male', 'Female', 'Other']
        },
        githubProfile: {
                type: String,
                required: [true, "Please enter your GitHub profile"],
                validate: {
                        validator: function(v) {
                                return validator.isURL(v);
                        },
                        message: "Please enter a valid GitHub URL"
                }
        },
        linkedinProfile: {
                type: String,
                required: [true, "Please enter your LinkedIn profile"],
                validate: {
                        validator: function(v) {
                                return validator.isURL(v);
                        },
                        message: "Please enter a valid LinkedIn URL"
                }
        },
        preferredCountries: {
                type: [String],
                required: [true, "Please enter at least one preferred country"],
                validate: {
                        validator: function(v) {
                                return v.length > 0;
                        },
                        message: "At least one preferred country is required"
                }
        },
        preferredStates: {
                type: [String],
                required: [true, "Please enter at least one preferred state"],
                validate: {
                        validator: function(v) {
                                return v.length > 0;
                        },
                        message: "At least one preferred state is required"
                }
        },
        preferredCities: {
                type: [String],
                required: [true, "Please enter at least one preferred city"],
                validate: {
                        validator: function(v) {
                                return v.length > 0;
                        },
                        message: "At least one preferred city is required"
                }
        },
        dateOfBirth: {
                type: Date,
                required: [true, "Please enter your date of birth"],
                validate: {
                        validator: function(v) {
                                return v <= new Date();
                        },
                        message: "Date of birth cannot be in the future"
                }
        },

})

userSchema.pre(/^find/, function(next) {
        this.find({ active: { $ne: false } });
        next();
    });

userSchema.pre('save', async function(next) {
    
    // Hash password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword, userPassword) {
        return await bcrypt.compare(candidatePassword, userPassword);
    };

const User=mongoose.model('User',userSchema);

module.exports=User;