const startupDebugger = require('debug')('app: startup');
const dbDebugger = require('debug')('app: db');
const dbconncection = require('./dbconncection');
const config = require('config');
const mogran = require('morgan');
const helmet = require('helmet');
const Joi = require('joi');
const logger = require('./middleware/logger');
const courses = require('./routes/courses');
const home = require('./routes/home');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(helmet());
app.use('/api/courses', courses);
app.use('/', home);

// Configuration
// console.log(`Application name: ${config.get('name')}`);
// console.log(`Application name: ${config.get('mail.host')}`);
// console.log(`Mail Password: ${config.get('mail.password')}`);



if(app.get('env') == 'development'){ //environment specific 
    app.use(mogran('tiny'));
    startupDebugger('morgan enabled');
    
};


app.use(logger);  //custom midleware

const port = process.env.port || 3000;
app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});