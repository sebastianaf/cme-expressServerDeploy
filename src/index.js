const express = require("express")
const morgan = require("morgan")
const db = require('../config/db.js')
const c = console.log



var app = express()
const puerto = 5000

app.use(morgan("dev"))

app.get("/", (peticion, respuesta) => {
    try {
        respuesta.send("<h1>Servidor corriendo exitosamente</h1>")
    } catch (error) {
        respuesta.send("<h1>Servidor corriendo exitosamente</h1>")
    }
})


app.post("/ventas", async (peticion, respuesta) => {
    try {
        const data = await correrQuery("select * from venta")
        respuesta
            .header('Access-Control-Allow-Origin', '*')
            .send({ data: data.resultado })
    } catch (error) {
        console.log(`/ventas: ${error}`)
        respuesta.send({ data: [] })
    }

})

app.post("/top_productos", async (peticion, respuesta) => {
    try {
        const data = await correrQuery(
            `select 
                producto.nombre as producto,
                sum(producto_venta.cantidad) as cantidad
            from
                producto, producto_venta
            where
                producto_venta.id_producto = producto.id
            
                group by producto
                order by cantidad desc
                limit 5`)
        respuesta
            .header('Access-Control-Allow-Origin', '*')
            .send({ data: data.resultado })
    } catch (error) {
        console.log(`/mas_vendidos: ${error}`)
        respuesta.send({ data: [] })
    }

})

app.post("/top_almacenes", async (peticion, respuesta) => {
    try {
        const data = await correrQuery(
            `select 
                almacen.nombre as almacen,
                count(venta.id) as cantidad
            from
                almacen, venta
            where
                venta.id_almacen = almacen.id
            group by almacen
            order by cantidad desc
            limit 5`)
        respuesta
            .header('Access-Control-Allow-Origin', '*')
            .send({ data: data.resultado })
    } catch (error) {
        console.log(`/mas_vendidos: ${error}`)
        respuesta.send({ data: [] })
    }

})

app.post("/top_clientes", async (peticion, respuesta) => {
    try {
        const data = await correrQuery(
            `select 
                cliente.nombre as cliente,
                count(venta.id) as cantidad
            from
                cliente, venta
            where
                venta.id_cliente = cliente.id
            group by cliente
            order by cantidad desc
            limit 5`)
        respuesta
            .header('Access-Control-Allow-Origin', '*')
            .send({ data: data.resultado })
    } catch (error) {
        console.log(`/mas_vendidos: ${error}`)
        respuesta.send({ data: [] })
    }

})

app.post("/top_marcas", async (peticion, respuesta) => {
    try {
        const data = await correrQuery(
            `select 
                marca.nombre as marca,
                sum(producto_venta.cantidad) as cantidad
            from
                marca, producto_venta, producto
            where
                marca.id = producto.id_marca and
                producto.id = producto_venta.id_producto
            group by marca
            order by cantidad desc
            limit 5`)
        respuesta
            .header('Access-Control-Allow-Origin', '*')
            .send({ data: data.resultado })
    } catch (error) {
        console.log(`/mas_vendidos: ${error}`)
        respuesta.send({ data: [] })
    }

})

app.post("/clientes", async (peticion, respuesta) => {
    try {
        const data = await correrQuery("select * from cliente")
        respuesta
            .header('Access-Control-Allow-Origin', '*')
            .send({ data: data.resultado })
    } catch (error) {
        console.log(`/clientes: ${error}`)
        respuesta.send({ data: [] })
    }
})

app.post("/producto_venta", async (peticion, respuesta) => {
    try {
        const data = await correrQuery('select * from producto_venta')
        respuesta
            .header('Access-Control-Allow-Origin', '*')
            .send({ data: data.resultado })
    } catch (error) {
        console.log(`/producto_venta: ${error}`)
        respuesta.send({ data: [] })
    }
})


//Solo ejecutar depués de conectar
const correrQuery = (SQLquery) => {
    return new Promise((resolver, reyectar) => {
        db.conexion.query(SQLquery, (error, resultado, campos) => {
            resolver({
                error,
                resultado,
                campos
            })
        })

    })
}


app.listen(process.env.PORT || puerto, () => {
    console.log(`Servidor corriendo en puerto ${puerto}`)
})