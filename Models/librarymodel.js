const mongoose=require('mongoose');
const libschema = new mongoose.Schema(
  {
    title:{
      type:String,
      required:[true,'Book title is mandatory'],
      trim:true
    },
    author:{
      type:String,
      default:'Unknown Author',
      trim:true
    },
    category:{
      type:String,
      default:'General',
      trim:true
    },
    availability:{
      type:Boolean,
      default:true
    }
  },
  {
    timestamps:{createdAt:'creationDate',updatedAt:'lastModified'}
  }
);
module.exports = mongoose.model('Book',libschema);