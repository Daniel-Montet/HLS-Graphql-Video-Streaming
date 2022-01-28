import "reflect-metadata";
import { Field, ID, ObjectType } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Entity()
@ObjectType()
export class Video extends BaseEntity {
	@PrimaryGeneratedColumn()
	@Field(() => ID, { description: "video ID" })
	id!: number;

	@Column()
	@Field({ description: "video URL" })
	url!: string;

	@Column()
	@Field({ description: "video title" })
	title!: string;
}