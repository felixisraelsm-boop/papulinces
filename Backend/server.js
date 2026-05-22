require("dotenv").config();

const path = require("path");
const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes");
const express = require("express");
const cors = require("cors");

const usuarioRoutes = require(
    "./routes/usuarioRoutes"
);

app.use("/api/usuarios", usuarioRoutes);

const conectarDB = require("./config/db");

const usuarioRoutes = require("./routes/usuarioRoutes");

conectarDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/posts", postRoutes);

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);

app.get("/", (req, res) => {
    res.send("API funcionando");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
});