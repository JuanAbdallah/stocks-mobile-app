const db = require("../models");
const Usuario = db.usuarios;
const jwt = require('jsonwebtoken');
const Op = db.Sequelize.Op;
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    if (!req.body.email || !req.body.senha) {
        res.status(400).send({ message: "Email e senha são obrigatórios" });
        return;
    }

    const { email, senha } = req.body;

    Usuario.findOne({ where: { email: email } })
        .then(async user => {
            if (!user) {
                res.status(404).send({ message: "Usuário não encontrado" });
                return;
            }

            
            const match = await bcrypt.compare(senha, user.senha);
            if (!match) {
                res.status(401).send({ message: "Senha incorreta" });
                return;
            }

            const token = jwt.sign({ id: user.id }, 'chave', { expiresIn: 86400 });

            res.send({
                message: "Login realizado com sucesso",
                token,
                user: {
                    id: user.id,
                    nomeUsuario: user.nomeUsuario,
                    email: user.email,
                    saldo: user.saldo,
                    avaliacao: user.avaliacao
                }
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Erro ao fazer login" });
        });
};


exports.cadastrarUsuario = async (req, res) => {
    if (!req.body.nomeUsuario || !req.body.email || !req.body.senha) { 
        res.status(400).send({ message: "Os campos nome, email e senha são obrigatórios" });
        return;
    }

   
    const hashedPassword = await bcrypt.hash(req.body.senha, 10);

    const usuario = {
        nomeUsuario: req.body.nomeUsuario,
        email: req.body.email,
        senha: hashedPassword, 
        saldo: 0,
        avaliacao:0
    };

    Usuario.create(usuario)
        .then(data => {
            const token = jwt.sign({ id: data.id }, 'chave', { expiresIn: 86400 });
            res.send({
                message: "Usuário cadastrado com sucesso!",
                data,
                token 
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Erro ao cadastrar o usuário" });
        });
};

exports.buscarTodosUsuarios = (req, res) => {
    Usuario.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Erro ao buscar usuários" });
        });
};


exports.buscarUsuarioPorId = (req, res) => {
    const id = req.params.id;

    Usuario.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({ message: `Usuário com ID ${id} não encontrado` });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Erro ao buscar o usuário com ID " + id });
        });
};


exports.atualizarUsuario = (req, res) => {
    const id = req.params.id;

    Usuario.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Usuário atualizado com sucesso" });
            } else {
                res.send({ message: `Não foi possível atualizar o usuário com ID ${id}. Usuário pode não ter sido encontrado ou o corpo da requisição está vazio.` });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Erro ao atualizar o usuário com ID " + id });
        });
};

exports.excluirUsuario = (req, res) => {
    const id = req.params.id;

    Usuario.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Usuário excluído com sucesso!" });
            } else {
                res.send({ message: `Não foi possível excluir o usuário com ID ${id}. Usuário pode não ter sido encontrado.` });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Erro ao excluir o usuário com ID " + id });
        });
};


exports.excluirTodosUsuarios = (req, res) => {
    Usuario.destroy({ where: {}, truncate: false })
        .then(nums => {
            res.send({ message: `${nums} usuários foram excluídos com sucesso!` });
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Erro ao excluir todos os usuários" });
        });
};

exports.adicionarSaldo = (req, res) => {
    const id = req.params.id;
    const { valor } = req.body;

    if (valor <= 0) {
        res.status(400).send({ message: "O valor para adicionar deve ser positivo." });
        return;
    }

    Usuario.findByPk(id)
        .then(user => {
            if (!user) {
                res.status(404).send({ message: `Usuário com ID ${id} não encontrado.` });
                return;
            }

            const novoSaldo = user.saldo + valor;

            user.update({ saldo: novoSaldo })
                .then(() => res.send({ message: "Saldo adicionado com sucesso!", saldo: novoSaldo }))
                .catch(err => res.status(500).send({ message: "Erro ao adicionar saldo." }));
        })
        .catch(err => res.status(500).send({ message: "Erro ao buscar o usuário." }));
};

exports.retirarSaldo = (req, res) => {
    const id = req.params.id;
    const { valor } = req.body;

    if (valor <= 0) {
        res.status(400).send({ message: "O valor para retirar deve ser positivo." });
        return;
    }

    Usuario.findByPk(id)
        .then(user => {
            if (!user) {
                res.status(404).send({ message: `Usuário com ID ${id} não encontrado.` });
                return;
            }

            if (user.saldo < valor) {
                res.status(400).send({ message: "Saldo insuficiente." });
                return;
            }

            const novoSaldo = user.saldo - valor;

            user.update({ saldo: novoSaldo })
                .then(() => res.send({ message: "Saldo retirado com sucesso!", saldo: novoSaldo }))
                .catch(err => res.status(500).send({ message: "Erro ao retirar saldo." }));
        })
        .catch(err => res.status(500).send({ message: "Erro ao buscar o usuário." }));
};


