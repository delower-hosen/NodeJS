const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Course = require('./../db.model');

router.use(express.json());

//get request to fetch one data /api/courses/
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

//post request /api/courses/
router.post('/', (req, res) => {
     
    const result = validateCourse(req.body);
    if(result.error){
        res.status(404).send(result.error.details[0].message);
        return;
    }

    const course = new Course({
        name: req.body.name,
        author: req.body.author,
        price: req.body.price,
        imageurl: req.body.imageurl
    });

    course.save((err, docs)=>{
        if(!err){
            console.log('course has been pushed to database!');
            res.json(docs);
        }
        else console.log('something went wrong');
        res.send(err.message);
    });
});

//put request /api/courses/:id
router.put('/:id', (req, res) => {
    const result = validateCourse(req.body);
    if(result.error){
        res.status(400).send('Invalid update request!');
        return;
    }

    const course = Course.findById(req.params.id, (err, docs)=>{
        if(!err){
            docs.set({
                name: req.body.name? req.body.name : docs.name,
                author: req.body.author? req.body.author : docs.author,
                tags: req.body.tags? req.body.tags : docs.tags,
                isPublished: req.body.isPublished? req.body.isPublished : docs.isPublished
            });
            docs.save();
            res.json(docs);
            console.log('course was updated successfully!');
        } else{
            console.log('something wrong!');
            res.status(404).send('course to update not found!');
        }
    });

});

//delete /api/courses/:id
router.delete('/:id', (req, res)=>{
    const course = Course.findByIdAndRemove(req.params.id, (err, docs)=>{
        if(!err){
            console.log('Deleted successfully!');
            res.json(docs);
        } else{
            res.status(404).send('The Course with the given ID was not found!');
        }
    });
});

//get request specific id /api/courses/:id
router.get('/:id', (req, res) =>{
    const course = Course.findById(req.params.id, (err, docs)=>{
        if(!err){
            res.json(docs);
        } else{
            console.log('The course with the given id was not found!');
            res.status(404).send('The Course with the given ID was not found!');
        }
    });
});


function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required(),
        author: Joi.string().min(3).required(),
        price: Joi.number().integer().min(1).required(),
        imageurl: Joi.string().required()
    }
    return Joi.validate(course, schema);
}

module.exports = router;