const mongoose=require('mongoose')
const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});
const port=3000;
const app=require('./app');

mongoose.connect(process.env.CONN_STR,{
        useNewUrlParser:true
}).then((conn)=>{
        console.log("Database connection success")
}).catch((error)=>{
        console.log("error occured in DB connection");
});




 
app.listen(port,()=>{
        console.log("server has started...");
});

