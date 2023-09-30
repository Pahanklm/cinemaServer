import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserModel } from 'src/user/user.model'

export class AdminGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest()
		const user: UserModel = request.user

		if (!user.isAdmin) {
			throw new ForbiddenException(
				'You do not have permission to access this resource'
			)
		}

		return user.isAdmin
	}
}
