import "reflect-metadata";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Video } from "../entity/video.entity";
import { GraphQLUpload, FileUpload } from "graphql-upload";
import { createWriteStream } from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";


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
		const out = createWriteStream(url)
		const isUploaded = new Promise(async (resolve, reject) => {
			ffmpeg(createReadStream())
				.addOptions([
					'-profile:v baseline', // baseline profile (level 3.0) for H264 video codec
					'-level 3.0',
					'-s 640x360',          // 640px width, 360px height output video dimensions
					'-start_number 0',     // start the first .ts segment at index 0
					'-hls_time 10',        // 10 second segment duration
					'-hls_list_size 0',    // Maxmimum number of playlist entries (0 means all entries/infinite)
					'-f hls'               // HLS format
				])
				.output(out)
				.on('error', (err) => {
					console.log('Cannot process video: ' + err.message);
					reject(false)
				})
				.on("end", () => resolve(true)).run();
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