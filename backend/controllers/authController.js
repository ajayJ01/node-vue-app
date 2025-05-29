const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.registerUser = async (req, reply) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return reply.code(400).send({ message: 'User already exists' });

    const user = await User.create({ name, email, password });
    reply.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
    });
};

exports.loginUser = async (req, reply) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        reply.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        reply.code(401).send({ message: 'Invalid email or password' });
    }
};

exports.getProfile = async (req, reply) => {
    try {
        reply.send({ message: 'Profile fetched', user: req.user });
    } catch (err) {
        reply.code(500).send({ message: 'Server Error' });
    }
};
