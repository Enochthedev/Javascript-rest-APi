const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    key: {type:String},
},{
    timestamps: true,
});

const Admin = mongoose.model('admin', adminSchema)

module.exports = Admin