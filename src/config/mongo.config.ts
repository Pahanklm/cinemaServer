import { ConfigService } from '@nestjs/config'
import { TypegooseModuleOptions } from 'nestjs-typegoose'

export const getMongoDbConfig = async (
  ConfigService: ConfigService
): Promise<TypegooseModuleOptions> => ({
  uri: ConfigService.get('MONGO_URI'),
})
