const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Book = require('./../db.model');

router.use(express.json());


//get request to fetch one data /api/books/
router.get('/',(req,res)=>{
    const books = Book.find({}, (err, docs)=>{
        if(!err){
            console.log(docs);
            res.json(docs);
        } else{
            res.status(404).send('something went wrong!')
            console.log('something went wrong!');
        }
    });
});

//post request /api/books/
router.post('/', (req, res) => {
     console.log(`post request arrived! ${req.body.name}`);
     
    const result = validateCourse(req.body);
    if(result.error){
        res.status(404).send(result.error.details[0].message);
        return;
    }

    const book = new Book({
        name: req.body.name,
        author: req.body.author,
        price: req.body.price,
        imageurl: req.body.imageurl,
        date: req.body.date
    });

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
            docs.set({
                name: req.body.name? req.body.name : docs.name,
                author: req.body.author? req.body.author : docs.author,
                price: req.body.price? req.body.price : docs.price,
                imageurl: req.body.imageurl? req.body.imageurl : docs.imageurl,
                date: req.body.date? req.body.date : docs.date
            });
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
    const book = Book.findByIdAndRemove(req.params.id, (err, docs)=>{
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
        date: Joi.date()
    }
    return Joi.validate(book, schema);
}

module.exports = router;