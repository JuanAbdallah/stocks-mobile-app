const express = require("express");
const router = express.Router();
const historicoController = require("../controller/historico.controller");

router.post("/", historicoController.registrarHistorico);

router.get("/:usuarioId", historicoController.buscarHistoricoDoUsuario);

module.exports = (app) => {
    app.use("/historico", router);
};
