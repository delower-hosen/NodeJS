const startupDebugger = require('debug')('app: startup');
const dbDebugger = require('debug')('app: db');

const config = require('config');
const mogran = require('morgan');
const helmet = require('helmet');
const Joi = require('joi');
const logger = require('./logger');
const express = require('express');
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(helmet());

// Configuration
// console.log(`Application name: ${config.get('name')}`);
// console.log(`Application name: ${config.get('mail.host')}`);
// console.log(`Mail Password: ${config.get('mail.password')}`);



if(app.get('env') == 'development'){
    app.use(mogran('tiny'));
    startupDebugger('morgan enabled');
    
}

//Db work
dbDebugger('Db connected successfully!');


app.use(logger);  //custom midleware

const courses = [
    { id: 1, name: 'course-1' },
    { id: 2, name: 'course-2' },
    { id: 3, name: 'course-3' }
]

app.get('/', (req, res)=>{
    res.send('Hello world');
});

app.get('/api/courses', (req, res)=>{
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) =>{
    const course = courses.find(c=>{
        return c.id == req.params.id;
    });

    if(!course) res.status(404).send('The Course with the given ID was not found!');
    res.send(course);
});

app.post('/api/courses', (req, res) => {
    
    const schema = {
        name: Joi.string().min(3).required()
    }

    const result = Joi.validate(req.body, schema);
    if(result.error){
        res.status(404).send(result.error.details[0].message);
        return;
    }
    
    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c=>{
        return c.id == parseInt(req.params.id);
    });

    if(!course){
        res.status(404).send('course to update not found!');
        return;
    }

    const result = validateCourse(req.body);
    if(result.error){
        res.status(400).send('Invalid update request!');
        return;
    }

    course.name = req.body.name;
    res.send(course);
});

function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(course, schema);
}


const port = process.env.port || 3000;
app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
})