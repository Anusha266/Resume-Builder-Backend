//import package
const exp = require('constants');
const express= require('express');

const morgan=require('morgan');

const authRouter=require('./Routes/authroutes');

const customError=require('./Utils/customError');

const GlobalErrorHandler=require('./controllers/errorController');

const userRouter=require('./Routes/userRoutes');

const rateLimit=require('express-rate-limit');

const helmet=require('helmet');

const sanitize=require('express-mongo-sanitize');

const xss=require('xss-clean');

const hpp=require('hpp');

const app=express();



app.use(helmet())

let limiter=rateLimit({
        max: 1000,
        windowMs:60*60*1000,
        message:'we have received too many requests from this Ip.try after some time'
});

app.use('/api',limiter);



app.use(express.json());


app.use(sanitize());
app.use(xss());//changes html code in req body

app.use(hpp({whitelist:['duration']}));

if(process.env.NODE_ENV === 'development')
{
        app.use(morgan('dev'));
}



app.use(express.static('./public'));
//app.use(logger);


app.use((req,resp,next)=>{
        req.requestedAt=new Date().toISOString();
        next();

})





//*******************************Routes*************** 

const cors = require('cors');
app.use(cors({
  origin: [process.env.ALLOWED_ORIGINS],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Set-Cookie']
}));

app.get('/',(req,res)=>{
        res.send('Welcome to the Resume Builder');
});
app.use(process.env.AUTH_ROUTES_URL, authRouter);
app.use(process.env.USER_ROUTES_URL, userRouter);


app.all('*',(req,res,next)=>{

        const err=new customError(`can't find this url${req.originalUrl}`,404);
        next(err);


})

app.use(GlobalErrorHandler);


module.exports=app;
