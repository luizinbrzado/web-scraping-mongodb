'use strict';

const now = new Date();

// Import mongoose
const mongoose = require("mongoose");

// Declare schema and assign Schema class
const Schema = mongoose.Schema;

// Create Schema Instance and add schema propertise
const resultadoSchema = new Schema({
    horario: {
        type: Date,
        default: Date.now
    },
    resultado: {
        type: Number,
        required: true
    }
});

// create and export model
module.exports = mongoose.model(`resultados`, resultadoSchema);