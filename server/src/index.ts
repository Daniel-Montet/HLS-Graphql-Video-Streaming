import express from "express";
import 'dotenv/config'

const app = express()
const port = process.env.PORT

app.get("/", (_, res) => {
	res.send("Server up")
})

app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})