const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const path = require("path")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// doc file db.json
const rawData = fs.readFileSync("db.json")
const data = JSON.parse(rawData)
app.use(cors())

// doc duong dan
const pathUser = path.join(__dirname, "./db.json")
const userJson = fs.readFileSync(pathUser, "utf-8")
const listUser = JSON.parse(userJson)

//router post
app.post("/api/v1/addTodo", (req, res) => {
    const newUser = {
        ...req.body,
    }
    data.todos.unshift(newUser)
    fs.writeFileSync("db.json", JSON.stringify(data))
    res.status(200).json({
        message: "Them thanh cong",
        add: data.todos
    })
})

app.get("/api/v1/todo", (req, res) => {
    const {per_page} = req.query
    const arr = data.todos.slice(0, per_page)
    res.status(200).json(arr)
    
})

app.put("/api/v1/todo/:id", (req, res) => {
    const { id } = req.params
    const index = data.todos.findIndex((item) => item.id == id)
    data.todos[index] = req.body
    fs.writeFileSync("db.json", JSON.stringify(data))
    res.status(200).json({
        message: "Sua thanh cong",
        todo: data.todos
    })
})

app.delete("/api/v1/todo/:id", (req, res) => {
    const { id } = req.params
    const newArr = data.todos.filter((item) => item.id != id)
    data.todos = newArr
    fs.writeFileSync("db.json", JSON.stringify(data))
    res.status(200).json({
        message: "Xoa thanh cong",
        todo: data.todos
    })
})

app.delete("/api/v1/todo", (req, res) => {
    data.todos = [];
    fs.writeFileSync("db.json", JSON.stringify(data));
    res.status(201).json({
        message: "Xoa thanh cong",
        todo: data.todos
    });
})

app.patch("/api/v1/todo/:id", (req, res) => {
    const { id } = req.params
    const index = data.todos.findIndex((item) => item.id == id)
    data.todos[index].completed = !data.todos[index].completed
    fs.writeFileSync("db.json", JSON.stringify(data))
    res.status(200).json({
        message: "Sua thanh cong",
        todo: data.todos
    })
})

app.listen(8386, (req, res) => {
    console.log('server is running on port 8386')
})