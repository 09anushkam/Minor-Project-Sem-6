const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    permissions: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Admin', AdminSchema);
