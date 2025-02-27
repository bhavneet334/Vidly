const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book')

//All Authors Route
router.get('/' , async(req,res)=>{
    let searchOptions = {}
    if(req.query.name!=null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name ,'i');
    }
    try{
      const authors = await Author.find(searchOptions)
      res.render('authors/index' , {
          authors: authors,
          searchOptions: req.query 
      });
    }catch{
       res.redirect('/');
    }
});

//New Author Route
router.get('/new' ,(req,res)=>{
  res.render('authors/new',{author : new Author() })
});

//Create Author Route
router.post('/', async(req,res)=>{
    const author = new Author({
        name: req.body.name
    })
    try{
        const newAuthor = await author.save();
        res.redirect(`authors/${newAuthor.id}`)
    } catch (err) {
        console.error("Error creating author:", err);  // <-- This logs the actual error to terminal
        res.render('authors/new', {
          author: author,
          errorMessage: 'Error Creating Author'
        });
    }
      
})

router.get('/:id' , async(req,res) => {
    try{
        const author = await Author.findById(req.params.id)
        const books = await Book.find({author : author.id}).limit(10).exec()
        res.render('authors/show',{
            author:author,
            booksByAuthor : books
        })
    }catch{
      //console.log(err)
       res.redirect('/')
    }
})

router.get('/:id/edit' , async(req,res) => {
    try{
        const author = await Author.findById(req.params.id)
       res.render('authors/edit' , {author : author})
    }catch{
          res.redirect('/authors')
    }
})

router.put('/:id' , async(req,res) => {
    let author
    try{
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
         res.redirect(`/authors/${author.id}`)
    }catch{
        //if the author does not exist
        if(author == null){
            res.redirect('/');
        }else{
            res.render('authors/edit' ,{
                author : author,
                errorMessage : 'Error Updating Author'
            });
        }
    }
})

router.delete('/:id' , async(req,res) => {
    try{
        const response = await Author.deleteOne({_id:req.params.id});
        if (response.deletedCount === 1) {
            console.log("Delete one author.");
        }
        res.redirect('/authors')
    }catch(err){
            //  console.log(err);
            res.redirect(`/authors/${req.params.id}`)
        }
})

module.exports = router;