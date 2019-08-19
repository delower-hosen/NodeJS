const mongoose = require('mongoose');
mongoose.connect('mongodb://mongo:27017/mydb', {useNewUrlParser:true}, (err)=>{
    if(!err){
        console.log('Connected to MongoDB....');  
    } else{
        console.log(`Couldn't connect MongoDB: ${err}`); 
    }
});