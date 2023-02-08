const { User, Thought } = require('../models')
const messageNotFound = (id) => `The user with the following ID has not been found:  ${id}!`
const messageDeleted = (id) => `The user with the following ID has not been found:  ${id}!`

const userController = {
    getAllUsers(req, res) {
        User.find({})
        .populate({ path: 'friends', select: '-__v'})
        .populate({ path: 'thoughts', select: '-__v'})
        .select('-__v')
        .sort({ _id: -1 })
        .then(userData => res.json(userData))
        .catch(err => res.status(500).json(err))
    },
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate( { path: 'friends'} )
        .populate( { path: 'thoughts'} )
        .select('-__v')
        .then(userData =>  userData 
            ? res.json(userData) 
            : res.status(404).json({ message: messageNotFound(params.id) }))
        .catch(err => res.status(404).json(err))
    },
    createUser({ body }, res) {
        User.create({ username: body.username, email: body.email})
        .then(userData => res.json(userData))
        .catch(err => res.status(400).json(err))
    },
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, {
            new: true, runValidators: true })
        .then(userData =>  userData 
            ? res.json(userData) 
            : res.status(404).json({ message: messageNotFound(params.id) }))
        .catch(err => res.status(400).json(err))
    },
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(userData => {
            if (!userData) {
                return res.status(404).json({ message: messageNotFound(params.id) })
            }
            Thought.deleteMany({ username: userData.username})
            .then(deletedThoughts => deletedThoughts 
            ? res.json({ message: messageDeleted(params.id)}) 
            : res.status(404).json({ message: messageNotFound(params.id) }))
        })
        .catch(err => res.status(400).json(err))
    },
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId}, 
            { 
                $push: { 
                    friends: params.friendId 
                } 
            },
            { new: true, runValidators: true }
        )
        .then(userData => res.json(userData))
        .catch(err => res.status(400).json(err))
    },
    removeFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId}, 
            { 
                $pull: { 
                    friends: params.friendId
                } 
            })
        .then(userData => res.status(200).json(messageDeleted(params.friendId, 'User')))
        .catch(err => res.json(err))
    }
}

module.exports = userController
