const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email:{ type: String, unique: true, required: true},
    password: { type: String, select: false, required: true},
    createAt: {
        type: Date,
        default: Date.now,
    },
},{collection: 'user'})

UserSchema.pre('save', async function (next){
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next()
})

const User = mongoose.model("User", UserSchema);

module.exports = User;