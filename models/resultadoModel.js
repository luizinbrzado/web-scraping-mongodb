'use strict';

const now = new Date();

// Import mongoose
const mongoose = require("mongoose");

// Declare schema and assign Schema class
const Schema = mongoose.Schema;

// Create Schema Instance and add schema propertise
const resultadoSchema = new Schema({
    date: {
        type: String,
        default: now.toLocaleDateString('BRT')
    },
    time: {
        type: String,
        default: now.toLocaleTimeString('BRT').slice(0,5)
    },
    result: {
        type: Number,
        required: true
    }
});

// create and export model
module.exports = mongoose.model(`resultados`, resultadoSchema);