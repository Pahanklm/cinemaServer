import { IsString } from 'class-validator'
export class actorDto {
	@IsString()
	name: string

	@IsString()
	slug: string

	@IsString()
	photo: string
}
