require("dotenv").config();

const express = require("express");
const cors = require("cors");

const usuarioRoutes = require("./routes/usuarioRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/usuarios", usuarioRoutes);

app.get("/", (req, res) => {
    res.send("Backend funcionando");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});