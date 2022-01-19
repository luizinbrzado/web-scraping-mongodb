// import Model
const Resultado = require("../models/resultadoModel.js");
const Hoje = require("../models/hojeModel.js");
const Ontem = require("../models/ontemModel.js");

// DEFINE CONTROLLER FUNCTIONS

//
// listAllTodos function - To list all todos
//
exports.listAll = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    Resultado.find({}, (err, todo) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).json(todo);
    });
};

exports.listAllToday = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    Hoje.find({}, (err, todo) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).json(todo);
    });
};

exports.listAllYesterday = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    Ontem.find({}, (err, todo) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).json(todo);
    });
};

// exports.listAllByDate = (req, res) => {
//     Resultado.find({ date: `${req.params.dia}/${req.params.mes}/${req.params.ano}` }, (err, todo) => {
//         if (err) {
//             res.status(500).send(err);
//         }
//         res.status(200).json(todo);
//     });
// };

// exports.listAllByTime = (req, res) => {
//     Resultado.find({ time: `${req.params.hora}:${req.params.minuto}` }, (err, todo) => {
//         if (err) {
//             res.status(500).send(err);
//         }
//         res.status(200).json(todo);
//     });
// };






//
// createNewTodo function - To create new todo
//
exports.createNew = (req, res) => {
    let newResultado = new Resultado(req.body);
    newResultado.save((err, todo) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(201).json(todo);
    });
};

exports.createNewToday = (req, res) => {
    let newHoje = new Hoje(req.body);
    newHoje.save((err, todo) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(201).json(todo);
    });
};