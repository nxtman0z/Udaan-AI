import mongoose from 'mongoose';
const { Schema } = mongoose;
const MessageSchema = new Schema({ role:String,content:String,createdAt:{type:Date,default:Date.now}});
const ConversationSchema = new Schema({ studentId:{type:Schema.Types.ObjectId,ref:'Student'},messages:[MessageSchema],updatedAt:{type:Date,default:Date.now}});
export default mongoose.model('Conversation', ConversationSchema);
