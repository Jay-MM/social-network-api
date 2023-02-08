const { Schema, model, Types } = require('mongoose');
const moment = require('moment');

const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type: String, 
            required: 'A description must be provided!',
            maxLength: 300,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
          },
        username: {
            type: String,
            required: 'A username must be provided!',
        },
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
)
const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId,
        },
        reactionBody: {
            type: String,
            required: 'A reaction must be provided!',
            maxLength: 350,
        },
        username: {
            type: String,
            required: 'A username must be provided!',
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
        }
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
    )

ThoughtSchema.virtual("reactionCount").get(function () {
    return this.reactions.length
})
    
const Thought = model("Thought", ThoughtSchema)
    
module.exports = Thought
    