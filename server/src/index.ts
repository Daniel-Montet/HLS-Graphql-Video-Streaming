import { createConnection, Connection, getConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import 'dotenv/config';
import http from 'http';
import { buildSchema } from "type-graphql";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { VideoResolver } from "./videos/resolvers/video.resolvers";
import { graphqlUploadExpress } from "graphql-upload";




(async () => {
	// initialize db connection
	try {
		await createConnection()
	} catch (err) {
		console.log("db error")
		console.log(err)
	}

	const db: Connection = getConnection();
	console.log("db connected: ", db.isConnected)

	// initialize express, apollo, typegraphql
	const port = process.env.PORT;
	const app = express();
	const httpServer = http.createServer(app);
	const schema = await buildSchema({ resolvers: [VideoResolver] })
	const server = new ApolloServer({
		schema,
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
		context: ({ req, res }: any) => ({ req, res })
	})

	await server.start()
	app.use(graphqlUploadExpress());
	server.applyMiddleware({ app });


	app.post("/", (_, res) => {
		res.send("Server up")
	})

	httpServer.listen(port, () => {
		console.log(`Server running on port ${port}`);
		console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
	})
})()