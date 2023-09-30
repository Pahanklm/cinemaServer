import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { TypegooseModule } from 'nestjs-typegoose'
import { ActorModule } from './actor/actor.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { getMongoDbConfig } from './config/mongo.config'
import { GenreModule } from './genre/genre.module'
import { MovieModule } from './movie/movie.module'
import { RatingModule } from './rating/rating.module'
import { UserModule } from './user/user.module'
import { TelegramModule } from './telegram/telegram.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypegooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongoDbConfig,
		}),
		MovieModule,
		GenreModule,
		ActorModule,
		UserModule,
		AuthModule,
		RatingModule,
		TelegramModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
