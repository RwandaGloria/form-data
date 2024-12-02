import mongoose, { Schema, Document } from 'mongoose';

export enum Department {
    Engineering = "engineering",
    HR = "HR",
    Sales = "sales",
    Logistics = "logistics"
  }
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
  comments?: string;
  department: Department;
}

const userSchema: Schema = new Schema<IUser>({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  }, 
  comments: {
    type: String, 
    required: false
  },
  department: {
    type: String,
    enum: Object.values(Department),  
    required: true 
  }
}, {
  timestamps: true 
});
userSchema.index({ email: 1 });
const User = mongoose.model<IUser>('User', userSchema);

export default User;
