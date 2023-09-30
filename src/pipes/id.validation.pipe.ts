import { BadRequestException, PipeTransform } from '@nestjs/common'
import { ArgumentMetadata } from '@nestjs/common/interfaces'
import { Types } from 'mongoose'

export class IdValidationPipe implements PipeTransform {
	transform(value: string, meta: ArgumentMetadata) {
		if (meta.type !== 'param') {
			return value
		}
		if (!Types.ObjectId.isValid(value)) {
			throw new BadRequestException('Invalid ID!')
		}
		return value
	}
}
