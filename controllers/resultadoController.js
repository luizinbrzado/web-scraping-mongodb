// import Model
const Resultado = require("../models/resultadoModel.js");

// DEFINE CONTROLLER FUNCTIONS

// listAllTodos function - To list all todos
exports.listAll = (req, res) => {
    Resultado.find({}, (err, todo) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).json(todo);
    });
};

// createNewTodo function - To create new todo
exports.createNew = (req, res) => {
    let newResultado = new Resultado(req.body);
    newResultado.save((err, todo) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(201).json(todo);
    });
};