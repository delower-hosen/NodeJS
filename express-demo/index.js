const startupDebugger = require('debug')('app: startup');
const dbDebugger = require('debug')('app: db');
const dbconncection = require('./dbconncection');
const config = require('config');
const mogran = require('morgan');
const helmet = require('helmet');
const Joi = require('joi');
const bodyParser = require('body-parser');
const logger = require('./middleware/logger');
const books = require('./routes/books');
const home = require('./routes/home');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());
app.use(bodyParser.json());
app.all("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
  });
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(helmet());
app.use('/api/books', books);
app.use('/', home);


if(app.get('env') == 'development'){ //environment specific 
    app.use(mogran('tiny'));
    startupDebugger('morgan enabled');
    
};


app.use(logger);  //custom midleware

const port = process.env.port || 3000;
app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});