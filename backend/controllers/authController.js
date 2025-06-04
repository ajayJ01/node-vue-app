const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { success, error, validationError } = require('../utils/response');

exports.registerUser = async (req, reply) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return error(reply, 400, 'User already exists with this email');
        }

        const user = await User.create({ name, email, password });

        return success(reply, 'User registered successfully', {
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });

    } catch (err) {
        console.error('Registration Error:', err.message);
        return error(reply);
    }
};


exports.loginUser = async (req, reply) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            return success(reply, 'Logged In Successfully', {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            return error(reply, 401, 'Invalid email or password');
        }

    } catch (err) {
        console.error('Login error:', err);
        return error(reply);
    }
};

exports.getProfile = async (req, reply) => {
    try {
        reply.send({ message: 'Profile fetched', user: req.user });
    } catch (err) {
        reply.code(500).send({ message: 'Server Error' });
    }
};
