const startupDebugger = require('debug')('app: startup');
const dbDebugger = require('debug')('app: db');
const dbconncection = require('./database-connection/dbconncection');
const config = require('config');
const mogran = require('morgan');
const helmet = require('helmet');
const Joi = require('joi');
const bodyParser = require('body-parser');
const logger = require('./middleware/logger');
const books = require('./routes/books');
const home = require('./routes/home');
const users = require('./routes/users');
const login = require('./routes/login');
const confirmation = require('./routes/confirmation');
const express = require('express');
const cors = require('cors');
const app = express();

// if(!config.get('jwtPrivateKey')){
//     console.log('FATAL ERROR: jwtPrivateKey is not defined!');
//     process.exit(1);
// }

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(helmet());
app.use('/api/books', books);
app.use('/', home);
app.use('/api/users', users);
app.use('/api/login', login);
app.use('/api/confirmation', confirmation);


if(app.get('env') == 'development'){ //environment specific 
    app.use(mogran('tiny'));
    startupDebugger('morgan enabled');
};


app.use(logger);  //custom midleware
// console.log(config.get('name'));


const port = process.env.port || 3000;
app.listen(port, ()=>{
    console.log(`Running on port ${port}`);
});