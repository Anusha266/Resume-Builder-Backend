const customError = require('../Utils/customError');
const user=require('../models/userModel');
const asyncErrorHandler=require('../Utils/asyncErrorHandler');
const jwt=require('jsonwebtoken');
const util=require('util');



const signToken=(id)=>{
        return jwt.sign(
                { id: id },
                process.env.SECRET_STR,
                { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );
}

const createSendResponse=(User,statuscode,res)=>{
        const  token=signToken(User._id);

        const options={
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
                httpOnly:true
        }
        if(process.env.NODE_ENV === 'production'){
                options.secure=true;
        }
        res.cookie('jwt',token,options);
        res.status(statuscode).json({
                status:"success",
                token,
                data:{
                        User
                }
        })
}


exports.signup=asyncErrorHandler(async(req,res,next)=>{
        try {
                
                // Define required fields with custom messages
                const requiredFields = {
                    firstName: 'First Name',
                    lastName: 'Last Name',
                    email: 'Email',
                    password: 'Password',
                    collegeName: 'College Name',
                    specialization: 'Specialization',
                    course: 'Course',
                    branch: 'Branch',
                    passoutYear: 'Passout Year',
                    cgpa: 'CGPA',
                    gender: 'Gender',
                    githubProfile: 'GitHub Profile',
                    linkedinProfile: 'LinkedIn Profile',
                    preferredCountries: 'Preferred Countries',
                    preferredStates: 'Preferred States',
                    preferredCities: 'Preferred Cities',
                    dateOfBirth: 'Date of Birth'
                };
                
                // Check for empty fields
                const emptyFields = Object.entries(requiredFields)
                    .filter(([key]) => !req.body[key] || req.body[key].toString().trim() === '')
                    .map(([_, label]) => label);

                if (emptyFields.length > 0) {
                    return next(new customError(
                        `Please fill in the required fields}`, 
                        400
                    ));
                }

                // Additional validations
                if (req.body.cgpa && (req.body.cgpa < 0 || req.body.cgpa > 10)) {
                    return next(new customError('CGPA must be between 0 and 10', 400));
                }

                

                const newUser = await user.create({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password,
                    collegeName: req.body.collegeName,
                    specialization: req.body.specialization,
                    course: req.body.course,
                    branch: req.body.branch,
                    passoutYear: req.body.passoutYear,
                    cgpa: req.body.cgpa,
                    gender: req.body.gender,
                    githubProfile: req.body.githubProfile,
                    linkedinProfile: req.body.linkedinProfile,
                    preferredCountries: req.body.preferredCountries,
                    preferredStates: req.body.preferredStates,
                    preferredCities: req.body.preferredCities,
                    dateOfBirth: req.body.dateOfBirth
                });

                createSendResponse(newUser, 201, res);
        } catch (error) {
                console.error('Signup Error:', error);
                if (error.name === 'ValidationError') {
                    const messages = Object.values(error.errors)
                        .map(err => err.message);
                    return next(new customError(messages.join('. '), 400));
                }
                if (error.code === 11000) {
                    return next(new customError('Email already exists. Please use a different email.', 400));
                }
                next(error);
        }
})


exports.login=asyncErrorHandler(async(req,res,next)=>{
        try {
                const { email, password } = req.body;

                // Check for empty fields
                const emptyFields = [];
                if (!email || email.trim() === '') emptyFields.push('Email');
                if (!password || password.trim() === '') emptyFields.push('Password');  

                if (emptyFields.length > 0) {
                    return next(new customError(
                        `Please provide ${emptyFields.join(' and ')}`, 
                        400
                    ));
                }

                // Check if user exists && password is correct
                const User = await user.findOne({ email }).select('+password');

                if (!User || !(await User.comparePassword(password, User.password))) {
                    return next(new customError('Incorrect email or password', 401));
                }

                createSendResponse(User, 200, res);
        } catch (error) {
                next(error);
        }
})



exports.protect=asyncErrorHandler(async(req,res,next)=>{
        //1.read the token & check if it exists
        

        const testToken=req.headers.authorization;
        let token;
        if(testToken && testToken.startsWith('Bearer')){
                token=testToken.split(' ')[1];
        }

        if(!token){
                return next();
        }
        //2.validate te the token
        const decodedToken=await util.promisify(jwt.verify)(token,process.env.SECRET_STR);

        //3.user is logged in or not
        const User=await user.findById(decodedToken.id);

        if(!User){
                const error=new customError(`user not exists with this id::${decodedToken.id}`,401);
                next(error);
        }


        req.user=User;

        next();

})

const getUserProfileByEmail=asyncErrorHandler(async(req,res,next)=>{
        const email=req.params.email;
        const User=await user.findOne({email});
        if(!User){
                return next(new customError(`User does not exists with this email::${email}`,404));
        }
        res.status(200).json({
                status:"success",
                data:User
        })
})

