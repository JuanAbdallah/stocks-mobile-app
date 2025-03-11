const db = require("../models");
const Acao = db.acoes;



exports.criarAcao = (req, res) => {
    const { nome, valor, quantidade, simbolo, usuarioId } = req.body; 
   
    if (!nome || !valor || quantidade === undefined || !usuarioId || !simbolo) {
        return res.status(400).send({
            message: "Todos os campos são obrigatórios, incluindo o símbolo da ação."
        });
    }

    const acao = {
        nome,
        valor,
        quantidade,
        usuarioId,
        simbolo
    };

    
    Acao.create(acao)
        .then(data => {
            res.status(201).send(data); 
        })
        .catch(err => {
            console.error("Erro ao criar a ação:", err.message, err.stack, err.errors);

            
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
                message: "Erro interno ao criar a ação",
                errors: err.errors || [err.message]
            });
        });
};




exports.buscarTodasAcoes = (req, res) => {
    Acao.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Erro ao buscar ações" });
        });
};


exports.buscarAcaoPorId = (req, res) => {
    const id = req.params.id;

    Acao.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({ message: `Ação com ID ${id} não encontrada` });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Erro ao buscar a ação com ID " + id });
        });
};

exports.atualizarAcao = (req, res) => {
    const id = req.params.id;

    Acao.update(req.body, { where: { id: id } })
        .then(num => {
            if (num[0] === 1) {
                res.send({ message: "Ação atualizada com sucesso!" });
            } else {
                res.send({ message: `Não foi possível atualizar a ação com ID ${id}. Ação pode não ter sido encontrada ou o corpo da requisição está vazio.` });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Erro ao atualizar a ação com ID " + id });
        });
};


exports.excluirAcao = (req, res) => {
    const id = req.params.id;

    Acao.destroy({ where: { id: id } })
        .then(num => {
            if (num === 1) {
                res.send({ message: "Ação excluída com sucesso!" });
            } else {
                res.send({ message: `Não foi possível excluir a ação com ID ${id}. Ação pode não ter sido encontrada.` });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Erro ao excluir a ação com ID " + id });
        });
};


exports.excluirTodasAcoes = (req, res) => {
    Acao.destroy({ where: {}, truncate: false })
        .then(nums => {
            res.send({ message: `${nums} ações foram excluídas com sucesso!` });
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Erro ao excluir todas as ações" });
        });
};

exports.buscarAcoesDoUsuario = (req, res) => {
    const userId = req.params.userId; 

    Acao.findAll({
        where: {
            usuarioId: userId 
        }
    })
    .then(data => {
        if (data.length === 0) {
            return res.status(404).send({ message: "Nenhuma ação encontrada para este usuário." });
        }
        res.send(data); 
    })
    .catch(err => {
        res.status(500).send({ message: err.message || "Erro ao buscar ações do usuário." });
    });
};
