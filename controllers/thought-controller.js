const { Thought, User } = require('../models')
const messageNotFound = (id) => `The Data with the following ID has not been found:  ${id}!`
const messageDeleted = (id) => `The Data with the following ID has been deleted:  ${id} !`

const thoughtController = {
    getAllThoughts(req, res) {
        Thought.find({})
        .populate({ path: 'reactions' })
        .select('-__v')
        .then(thoughtData => res.json(thoughtData))
        .catch(err => res.status(500).json(err))
    },
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({ path: 'reactions'})
        .select('-__v')
        .then(thoughtData =>  thoughtData 
            ? res.json(thoughtData) 
            : res.status(404).json({ message: messageNotFound(params.id) }))
        .catch(err => res.status(404).json(err))
    },
    createThought({ body }, res) {
        Thought.create(
            {
                thoughtText: body.thoughtText, 
                username: body.username 
            })
        .then(({_id}) => User.findOneAndUpdate(
            { _id: body.userId}, 
            { $push: {
                 thoughts: _id 
                } 
            }, 
            { new: true }))
        .then(thoughtData => res.json(thoughtData))
        .catch(err => res.status(400).json(err))
    },
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body,{ 
            new: true, runValidators: true })
        .then(thoughtData =>  thoughtData 
            ? res.json(thoughtData) 
            : res.status(404).json({ message: messageNotFound(params.id) }))
        .catch(err => res.status(400).json(err))
    },
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then(thoughtData =>  thoughtData 
            ? res.json(messageDeleted(thoughtData._id)) 
            : res.status(404).json({ message: messageNotFound(params.id) }))
        .catch(err => res.status(404).json(err))
    },
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { 
                reactions: { 
                    reactionBody: body.reactionBody,
                    username: body.username} 
                } 
            },
            { new: true, runValidators: true }
        )
        .then(thoughtData =>  thoughtData 
            ? res.json(thoughtData) 
            : res.status(404).json({ message: messageNotFound(params.id) }))
        .catch(err => res.status(400).json(err))
    },
    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId}, 
            { 
                $pull: { 
                    reactions: { 
                        _id: params.reactionId
                    } 
                } 
            }, 
            { new: true}
        )
        .then(thoughtData =>  thoughtData 
            ? res.json(messageDeleted(params.thoughtId)) 
            : res.status(404).json({ message: messageNotFound(params.id) }))
        .catch(err => res.status(404).json(err))
    }
}

module.exports = thoughtController