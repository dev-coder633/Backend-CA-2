require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Book = require('./model/librarymodel.js');
app.use(express.json())
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to Library Data Repository'))
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });
app.post('/api/books',async(req, res) => {
  try{
    const { title, author, category } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
     const newBook = new Book({
      title:title,
      author:author,
      category:category
    });
    await newBook.save();
    res.status(201).json({ message: 'Book added successfully', book: newBook });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/books',async(req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const books = await Book.find().skip(skip).limit(limit);
    const totalRecords = await Book.countDocuments();

    res.status(200).json({
      currentPage: page,
      totalRecords: totalRecords,
      books: books
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/books/:id', async (req, res) => {
  try{
    const{id} = req.params;
    const{availability} = req.body;
    const updatedBook=await Book.findByIdAndUpdate(
      id,
      {availability:availability},
      {new:true}
    );
    if (!updatedBook){
      return res.status(404).json({message:'Book not found'});
    }
    res.status(200).json({message:'Availability updated',book:updatedBook});
  } catch (error) {
    res.status(500).json({error:error.message});
  }
});
app.listen(5000,()=>{
    console.log("Server is running")
});