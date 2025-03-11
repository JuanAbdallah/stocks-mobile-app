module.exports = app => {
    const usuarios = require("../controller/usuario.controller.js");
    const { authenticateToken } = require("../auth/auth.js"); 

    let router = require("express").Router();

    router.post("/login", usuarios.login);

    
    router.post("/", usuarios.cadastrarUsuario);

    router.get("/", authenticateToken, usuarios.buscarTodosUsuarios);

    router.get("/:id", authenticateToken, usuarios.buscarUsuarioPorId);

    router.put("/:id", authenticateToken, usuarios.atualizarUsuario);

    router.delete("/:id", authenticateToken, usuarios.excluirUsuario);

    router.delete("/", authenticateToken, usuarios.excluirTodosUsuarios);

    router.post("/:id/depositar", authenticateToken, usuarios.adicionarSaldo);

    router.post("/:id/retirar", authenticateToken, usuarios.retirarSaldo);

    app.use("/user", router);
};
