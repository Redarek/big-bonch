const { Schema, model } = require('mongoose');

const userSchema =  new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    walletAddress: {
        type: String,
        unique: true,
        required: true
    },
    isActivated: {
        type: Boolean,
        default: false
    },
    activationLink: {
        type: String
    },
    universityData: {
        firstName: { type: String, required: true},
        secondName: { type: String, required: true},
        patronymic: { type: String, required: true},
        faculty: { type: String, required: true},
        job: { type: String, required: true},
        sex: { type: String, required: true}
    },
});

module.exports = model('User', userSchema);