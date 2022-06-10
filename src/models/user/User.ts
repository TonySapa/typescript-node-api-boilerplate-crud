import { model, Schema, Types } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { typesOfAccountStatus } from '../../domain'

export interface UserType {
  _id?: Types.ObjectId
  email?: string,
  passwordHash?: string,
  account_status?: string,
  account_status_token?: string
}

const userSchema = new Schema<UserType>({
  email: {
    type: String,
    unique: true,
    minlength: 3,
    maxlength: 254,
    required: true
  },
  passwordHash: {
    type: String,
    minlength: 8,
    maxlength: 254,
    required: true
  },
  account_status: {
    type: String,
    enum: typesOfAccountStatus,
    default: typesOfAccountStatus[0],
    required: true
  },
  account_status_token: {
    type: String
  }
})

userSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = `${returnedObject._id}`.toString()
    // delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

userSchema.plugin(uniqueValidator)

const User = model<UserType>('User', userSchema)

export default User
