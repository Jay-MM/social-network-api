const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: 'A username must be provided!',
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: 'An email must be provided!',
    trim: true,
    match:[/.+\@.+\..+/, 'The email address provided must be valid']
  },
  thoughts: [
      {
          type: Schema.Types.ObjectId,
          ref: 'Thought',
      }
    ],
  friends: [
      {
          type: Schema.Types.ObjectId,
          ref: 'User'
      }
  ]
  },
  { 
  toJSON: {
    virtuals: true,
    getters: true
  },
  id: false
}
);

UserSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

const User = model('User', UserSchema);

module.exports = User;