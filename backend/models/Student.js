import mongoose from 'mongoose';
const { Schema } = mongoose;
const BadgeSchema = new Schema({ key:String,title:String,description:String,awardedAt:{type:Date,default:Date.now}});
const StudentSchema = new Schema({
  name:String,
  email:String,
  headline:String,
  education:[String],
  skills:[String],
  badges:[BadgeSchema],
  createdAt:{type:Date,default:Date.now}
});
export default mongoose.model('Student', StudentSchema);
