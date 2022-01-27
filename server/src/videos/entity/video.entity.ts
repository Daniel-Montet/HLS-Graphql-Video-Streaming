import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Video {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	url!: string;

	@Column()
	title!: string;
}