import { createConnection, Connection, getConnection } from "typeorm";
import express from "express";
import 'dotenv/config'

const app = express();
const port = process.env.PORT;

(async () => {
	// init db connection
	try {
		await createConnection()
	} catch (err) {
		console.log("db error")
		console.log(err)
	}

	const db: Connection = getConnection();
	console.log("db connected: ", db.isConnected)


	app.get("/", (_, res) => {
		res.send("Server up")
	})

	app.listen(port, () => {
		console.log(`Server running on port ${port}`)
	})
})()