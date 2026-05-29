const mongoose = require("mongoose"); // Importamos Mongoose para manejar la conexión a la base de datos MongoDB y definir los esquemas de los modelos (Usuario, Publicacion, etc.)

const conectarDB = async () => { // Función asíncrona para conectar a la base de datos MongoDB usando Mongoose 

    try { // Intentamos conectar a MongoDB que debe contener la información de conexión
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB conectado"); 

    } catch (error) { // Si hay un error al conectar a MongoDB, lo mostramos en la consola y terminamos el proceso 

        console.log("Error de conexión:", error);

        process.exit(1); // Terminamos el proceso con un código de error para indicar que la conexión falló
    } 
};

module.exports = conectarDB; // Exportamos la función de conexión para usarla en el archivo principal del backend 