import { IsString } from 'class-validator'

export class RefreshTokenDto {
  @IsString({ message: 'Refresh token must be a string or you did not pass' })
  refreshToken: string
}
