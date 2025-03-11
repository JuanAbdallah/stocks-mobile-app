const express = require("express");
const cors = require("cors");

const app = express();

let corsOption = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOption));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//const db = require("./app/models");
//db.sequelize.sync({ force: true }).then(() => {
    //console.log("Drop and re-sync DB");
//});

app.get("/", (req, res) => {
    res.json({ message: "Welcome!" });
});

require("./app/routes/user.routes")(app);
require("./app/routes/acao.routes")(app);
require("./app/routes/historico.routes")(app);

const PORT = process.env.PORT || 8080;

app.listen(PORT,"192.168.100.2", () => {
    console.log("Server running at", PORT);
});
