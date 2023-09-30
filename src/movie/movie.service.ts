import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { TelegramService } from 'src/telegram/telegram.service'
import { UpdateMovieDto } from './dto/update.movie.dto'
import { MovieModel } from './movie.model'

@Injectable()
export class MovieService {
	constructor(
		@InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>,
		private readonly telegramService: TelegramService
	) {}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{
						title: new RegExp(searchTerm, 'i'),
					},
				],
			}
		}
		return this.MovieModel.find(options)
			.select('-updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.populate('actors genres')
			.exec()
	}

	async bySlug(slug: string) {
		const doc = await this.MovieModel.findOne({ slug })
			.populate('actors genres')
			.exec()
		if (!doc) {
			throw new NotFoundException('Movie not found')
		}
		return doc
	}
	async byActor(actorId: Types.ObjectId) {
		const docs = await this.MovieModel.findOne({ actors: actorId }).exec()
		if (!docs) {
			throw new NotFoundException('Movie not found')
		}
		return docs
	}
	async byGenres(genreIds: Types.ObjectId[]) {
		const doc = await this.MovieModel.findOne({
			genres: { $in: genreIds },
		}).exec()
		if (!doc) {
			throw new NotFoundException('Movie not found')
		}
		return doc
	}

	async updateCountOpened(slug: string) {
		const updateDoc = await this.MovieModel.findOneAndUpdate(
			{ slug },
			{ $inc: { countOpened: 1 } },
			{
				new: true,
			}
		).exec()

		if (!updateDoc) {
			throw new NotFoundException('Movie not found')
		}
		return updateDoc
	}

	async getMostPopular() {
		return this.MovieModel.find({ countOpened: { $gt: 0 } })
			.sort({ countOpened: -1 })
			.populate('genres')
			.exec()
	}

	async updateRating(id: Types.ObjectId, newRating: number) {
		return this.MovieModel.findByIdAndUpdate(
			id,
			{ rating: newRating },
			{ new: true }
		).exec()
	}

	// Admin Place

	async byId(_id: string) {
		const doc = await this.MovieModel.findById(_id)
		if (!doc) {
			throw new NotFoundException('Movie not found')
		}

		return doc
	}

	async create() {
		const defaultValue: UpdateMovieDto = {
			title: '',
			slug: '',
			poster: '',
			bigPoster: '',
			videoUrl: '',
			genres: [],
			actors: [],
			isSendTelegram: false,
		}
		const movie = await this.MovieModel.create(defaultValue)
		return movie._id
	}

	async update(_id: string, dto: UpdateMovieDto) {
		if (!dto.isSendTelegram) {
			await this.sendNotification(dto)
			dto.isSendTelegram = true
		}

		const updateDoc = await this.MovieModel.findByIdAndUpdate(_id, dto, {
			new: true,
		}).exec()

		if (!updateDoc) {
			throw new NotFoundException('Movie not found')
		}
		return updateDoc
	}

	async delete(id: string) {
		const deleteDoc = await this.MovieModel.findByIdAndDelete(id).exec()

		if (!deleteDoc) {
			throw new NotFoundException('Movie not found')
		}
		return deleteDoc
	}

	async sendNotification(dto: UpdateMovieDto) {
		// if (process.env.NODE_ENV !== 'development') {
		//     await this.telegramService.sendPhoto(dto.poster)
		const message = `<b>${dto.title}</b>`
		await this.telegramService.sendPhoto(
			'https://wallpapers.com/wallpapers/cool-hd-john-wick-and-guns-fkurzl5x5t5vakvg.html',
			``
		)

		await this.telegramService.sendMessage(message, {
			reply_markup: {
				inline_keyboard: [
					[
						{
							url: 'https://okko.tv/movie/free-guy',
							text: 'go to watch',
						},
					],
				],
			},
		})
	}
}
