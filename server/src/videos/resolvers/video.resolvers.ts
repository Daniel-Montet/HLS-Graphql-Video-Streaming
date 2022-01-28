import "reflect-metadata";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Video } from "../entity/video.entity";
import { GraphQLUpload, Upload } from "graphql-upload";
import { createWriteStream } from "fs";


@Resolver()
export class VideoResolver {
	@Query(() => Video)
	async findOne(@Arg("id") id: string) {
		return await Video.findOne(id)
	}

	@Query(() => [Video])
	async findAll() {
		return await Video.find();
	}
	@Mutation(() => String)
	async create(@Arg("video", () => GraphQLUpload) { file }: Upload) {
		// read file and write to storage
		const { createReadStream, filename } = file!;
		const url = __dirname + `/videos/${filename}`
		const uploaded = new Promise(async (resolve, reject) => {
			createReadStream().pipe(createWriteStream(url))
				.on("finish", () => resolve(true))
				.on("error", () => reject(false))
		})

		if (!uploaded) {
			return "Error uploading video"
		}

		// persist url to db
		const video = await Video.create({ title: filename, url })
		return video.url;
	}
}