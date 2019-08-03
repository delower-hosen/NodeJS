const auth = require('./../middleware/auth');
const express = require('express');
const _ = require('lodash');
const router = express.Router();
const Joi = require('joi');
const Book = require('../model/book.model');

router.use(express.json());

//get request to fetch one data /api/books/
router.get('/', (req,res)=>{
    const books = Book.find({}, (err, docs)=>{
        if(!err){
            res.json(docs);
        } else{
            res.status(404).send('something went wrong!')
            console.log('something went wrong!');
        }
    });
});

//post request /api/books/
router.post('/', auth, (req, res) => {
    const result = validateCourse(req.body);
    if(result.error){
        res.status(404).send(result.error.details[0].message);
        return;
    }

    const book = new Book(_.pick(req.body, ['name', 'author', 'price', 'imageurl', 'date', 'bookid']));

    book.save((err, docs)=>{
        if(!err){
            console.log('book has been pushed to database!');
            res.json(docs);
        }
        else {
            console.log('something went wrong!');
            res.send(err.message);
        }
    });
});

//put request /api/books/:id
router.put('/:id', (req, res) => {
    const result = validateCourse(req.body);
    if(result.error){
        res.status(400).send('Invalid update request!');
        return;
    }

    const book = Book.findById(req.params.id, (err, docs)=>{
        if(!err){
            docs.set(_.pick(req.body, ['name', 'author', 'price', 'imageurl', 'date', 'bookid','_id']));
            docs.save();
            res.json(docs);
            console.log('book was updated successfully!');
        } else{
            console.log('something wrong!');
            res.status(404).send('book to update not found!');
        }
    });

});

//delete /api/books/:id
router.delete('/:id', (req, res)=>{
    console.log(req.params.id);
    
    const book = Book.findByIdAndRemove({_id: req.params.id}, (err, docs)=>{
        if(!err){
            console.log('Deleted successfully!');
            res.json(docs);
        } else{
            res.status(404).send('The books with the given ID was not found!');
        }
    });
});

//get request specific id /api/books/:id
router.get('/:id', (req, res) =>{
    const book = Book.findById(req.params.id, (err, docs)=>{
        if(!err){
            res.json(docs);
        } else{
            console.log('The course with the given id was not found!');
            res.status(404).send('The Course with the given ID was not found!');
        }
    });
});


function validateCourse(book){
    const schema = {
        name: Joi.string().min(3).required(),
        author: Joi.string().min(3).required(),
        price: Joi.number().integer().min(1).required(),
        imageurl: Joi.string().required(),
        date: Joi.date(),
        bookid: Joi.string(),
        _id: Joi.string()
    }
    return Joi.validate(book, schema);
}

module.exports = router;