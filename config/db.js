const mysql = require("mysql")

const conectar = () => {
    try {
        return mysql.createPool({
            host: "",
            user: "",
            password: "",
            database: ""
        })
    } catch (error) {
        return null
    }

}
exports.conexion = conectar()


