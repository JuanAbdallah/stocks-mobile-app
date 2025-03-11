const db = require("../models");
const Historico = db.historicos; 


exports.registrarHistorico = (req, res) => {
    const { nome, valor, quantidade, simbolo, usuarioId, status } = req.body;

    // Validação dos campos obrigatórios
    if (!nome || !valor || quantidade === undefined || !usuarioId || !simbolo) {
        return res.status(400).send({
            message: "Todos os campos são obrigatórios, incluindo o símbolo da ação."
        });
    }

    // Registro do histórico
    const historico = {
        nome,
        valor,
        quantidade,
        simbolo,
        usuarioId,
        status
    };

    Historico.create(historico)
        .then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            console.error("Erro ao registrar histórico:", err.message, err.stack, err.errors);

            if (err.name === 'SequelizeValidationError') {
                return res.status(400).send({
                    message: "Erro de validação",
                    errors: err.errors || [err.message]
                });
            } else if (err.name === 'SequelizeUniqueConstraintError') {
                return res.status(409).send({
                    message: "Erro de unicidade",
                    errors: err.errors || [err.message]
                });
            }

            res.status(500).send({
                message: "Erro interno ao registrar o histórico",
                errors: err.errors || [err.message]
            });
        });
};

exports.buscarHistoricoDoUsuario = (req, res) => {
    console.log('Rota chamada com usuarioId:', req.params.usuarioId);

    const usuarioId = req.params.usuarioId;

    Historico.findAll({
        where: {
            usuarioId: usuarioId,
        },
    })
        .then(data => {
            if (data.length === 0) {
                console.log('Nenhum registro encontrado.');
                return res.status(404).send({ message: "Nenhum histórico encontrado." });
            }
            res.send(data);
        })
        .catch(err => {
            console.error('Erro ao buscar histórico:', err);
            res.status(500).send({ message: "Erro interno ao buscar histórico." });
        });
};

