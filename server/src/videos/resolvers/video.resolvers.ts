import "reflect-metadata";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Video } from "../entity/video.entity";


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
	@Mutation(() => Video)
	async create(@Arg("title") title: string) {
		return await Video.find({ title })
	}
}