const customError = require('../Utils/customError');
const User = require('../models/userModel');

exports.getUserProfile = async (req, res, next) => {
  try {
    
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
        user,
        message: 'User profile fetched successfully'
      }
    });
  } catch (error) {
    next(new customError(error.message,500));
  }
};



exports.getUserProfileByEmail=asyncErrorHandler(async(req,res,next)=>{
  const email=req.body.email;
  const user=await User.findOne({email});
  if(!user){
          return next(new customError(`User does not exists with this email::${email}`,404));
  }
  res.status(200).json({
          status:"success",
          data:user
  })
})