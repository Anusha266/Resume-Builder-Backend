const customError = require('../Utils/customError');

exports.getUserProfile = async (req, res, next) => {
  try {
    const User = require('../models/userModel');
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'you are not authenticated'
      });
    }
   
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        githubProfile: user.githubProfile,
        linkedinProfile: user.linkedinProfile,
        collegeName: user.collegeName,
        specialization: user.specialization,
        course: user.course,
        branch: user.branch,
        passoutYear: user.passoutYear,
        cgpa: user.cgpa,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth
      }
    });
  } catch (error) {
    next(new customError(error.message,500));
  }
};
