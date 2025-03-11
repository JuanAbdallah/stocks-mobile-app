const express = require("express");
const router = express.Router();
const acaoController = require("../controller/acao.controller");


router.post("/", acaoController.criarAcao); 
router.get("/", acaoController.buscarTodasAcoes);
router.get("/:id", acaoController.buscarAcaoPorId); 
router.put("/:id", acaoController.atualizarAcao); 
router.delete("/:id", acaoController.excluirAcao); 
router.delete("/", acaoController.excluirTodasAcoes); 
router.get('/user/:userId', acaoController.buscarAcoesDoUsuario);

module.exports = (app) => {
    app.use("/acoes", router);
};