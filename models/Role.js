const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const roleSchema = new Schema({
    value: { type: String,unique:true ,default: "USER" }
});

const Role  = mongoose.model('Role', roleSchema);

module.exports={
    Role
}