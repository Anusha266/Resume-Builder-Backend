const customError = require("../Utils/customError");

const devErrors=(res,error)=>{

        res.status(error.statusCode).json({
                status:error.status,
                msg:error.message,
                stackTrace:error.stack,
                error:error

        });
        
}
const prodErrors=(res,error)=>{
        if(error.isOperational){
                res.status(error.statusCode).json({
                        status:error.status,
                        msg:error.message,
                        

                });
        }
        else{
                res.status(404).json({
                        status:"error",
                        msg:"please try againn"
                })
        }
        

}
const castHandleError=(err)=>{
        return new customError(`INvalid Value ${err.value}  for field ${err.path}`,400);
        
}
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  return new customError(`Invalid input data. ${errors.join('. ')}`, 400);
};

module.exports=GlobalErrorHandler=(error,req,res,next)=>{
        error.statusCode=error.statusCode || 500;
        error.status=error.status || "error";
        if(process.env.NODE_ENV === 'development'){
                devErrors(res,error);
                
        }
        
        else if(process.env.NODE_ENV === 'production'){
                let err = { ...error };

                if (error.name === 'ValidationError') {
                        err = handleValidationError(error);
                }
                else if (error.name === 'CastError') {
                        err = castHandleError(error);
                }
                else if (error.code === 11000) {
                        err = new customError(`Email already exists. Please use a different email.`, 400);
                }
                else if (error.name === 'TokenExpiredError') {
                        err = new customError("Login time expired", 400);
                }
                else if (error.name === 'JsonWebTokenError') {
                        err = new customError("Invalid token");
                }
                
                prodErrors(res,err);
        }
    
}