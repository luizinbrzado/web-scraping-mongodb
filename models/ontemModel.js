'use strict';

const now = new Date();
now.setHours(-24);

// Import mongoose
const mongoose = require("mongoose");

// Declare schema and assign Schema class
const Schema = mongoose.Schema;

// Create Schema Instance and add schema propertise
const resultadoSchema = new Schema({
    result: {
        type: Number,
        required: true
    }
});

// create and export model
module.exports = mongoose.model(`${now.toLocaleDateString('BRT').replace(/\//g, '_')}`, resultadoSchema);