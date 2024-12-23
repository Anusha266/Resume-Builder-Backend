class customError extends Error{
        constructor(message,statusCode){
                super(message);
                //this.message=message;
                this.statusCode=statusCode;
                this.status=statusCode>=400&&statusCode<500 ?'failed':'error';
                this.isOperational=true;
                Error.captureStackTrace(this,this.constructor);

        }




}

module.exports=customError;
