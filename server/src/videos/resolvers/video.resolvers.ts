import "reflect-metadata";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Video } from "../entity/video.entity";
import { GraphQLUpload, FileUpload } from "graphql-upload";
import { createWriteStream } from "fs";
import path from "path";
const ffmpeg = require("fluent-ffmpeg");


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
	async create(@Arg("video", () => GraphQLUpload) { filename, createReadStream }: FileUpload) {
		// read file and write to storage
		const url = path.join('', 'videos', `${filename}`);
		// ffmpeg(fs.createReadStream('/path/to/file.avi'));
		const isUploaded = new Promise(async (resolve, reject) => {
			createReadStream().pipe(createWriteStream(url))
				.on("finish", () => resolve(true))
				.on("error", () => reject(false))
		})
		let result = await isUploaded;
		if (!result) {
			return "Error uploading video"
		}
		// persist url to db
		let video = await Video.create({ title: filename, url })
		video.save()
		return video.url;
	}
}