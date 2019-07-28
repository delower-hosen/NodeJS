const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Course = require('./../db.model');

router.use(express.json());

// const courses = [
//     { id: 1, name: 'couse-1'},
//     { id: 2, name: 'couse-2'},
//     { id: 3, name: 'couse-3'}
// ]

//http get request to fetch one data /api/courses/
router.get('/',(req,res)=>{
    const courses = Course.find({}, (err, docs)=>{
        if(!err){
            console.log(docs);
            res.json(docs);
        } else{
            console.log('something went wrong!');
        }
    });
});

//http post request /api/courses/
router.post('/', (req, res) => {
    const course = new Course({
        name: req.body.name,
        author: req.body.author,
        tags: req.body.tags,
        isPublished: req.body.isPublished
    });

    course.save((err, docs)=>{
        if(!err){
            console.log('course has been pushed to database!');
            res.json(docs);
        }
        else console.log('something went wrong');
    });
    
    // const schema = {
    //     name: Joi.string().min(3).required()
    // }

    // const result = Joi.validate(req.body, schema);
    // if(result.error){
    //     res.status(404).send(result.error.details[0].message);
    //     return;
    // }
    
    // const course = {
    //     id: courses.length + 1,
    //     name: req.body.name
    // }
    // courses.push(course);
    // res.send(course);
});

//http put request /api/courses/:id
router.put('/:id', (req, res) => {
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

//http delete /api/courses/:id
router.delete('/:id', (req, res)=>{
    const course = courses.find(c=>{
        return c.id == req.params.id;
    });
    if(!course) res.status(404).send('The Course with the given ID was not found!');
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(course);
});

//http get request specific id /api/courses/:id
router.get('/:id', (req, res) =>{
    const course = courses.find(c=>{
        return c.id == req.params.id;
    });

    if(!course) res.status(404).send('The Course with the given ID was not found!');
    res.send(course);
});


function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(course, schema);
}

module.exports = router;