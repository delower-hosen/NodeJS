
const mongoose=require('mongoose')

mongoose.connect('mongodb://localhost:27017/firstdb',{useNewUrlParser:true},(err)=>{
if(!err){
console.log("connection success")
}
else{
console.log("error:" +err)
}
});