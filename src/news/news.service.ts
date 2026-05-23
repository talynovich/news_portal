import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './entities/news.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News) private newsRepository: Repository<News>,
  ) {}

  create(userId: number, dto: CreateNewsDto) {
    const news = this.newsRepository.create({
      ...dto,
      author: { id: userId },
    });
    return this.newsRepository.save(news);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{
    data: News[];
    total: number;
  }> {
    const options: FindManyOptions<News> = {
      relations: ['author'],
      order: {
        createdAt: 'DESC',
      },
      take: limit,
      skip: (page - 1) * limit,
    };

    if (page == 0) {
      throw new BadRequestException(`The limit parameter cannot be equal to 0`);
    }

    if (search && search.trim() !== '') {
      const formattedQuery = search.trim();
      options.where = [
        { title: ILike(`%${formattedQuery}%`) },
        { description: ILike(`%${formattedQuery}%`) },
      ];
    }

    const [data, total] = await this.newsRepository.findAndCount(options);

    return {
      data,
      total,
    };
  }

  async findOne(id: number) {
    const news = await this.newsRepository.findOne({
      relations: ['author', 'comments'],
      where: { id },
    });
    if (!news) {
      throw new NotFoundException(`Nested with id ${id} not found`);
    }
    return news;
  }

  async update(
    id: number,
    userId: number,
    updateNewsDto: UpdateNewsDto,
  ): Promise<News> {
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!news) {
      throw new NotFoundException(`News item with id ${id} not found`);
    }
    if (news.author.id !== userId) {
      throw new ForbiddenException("You cannot edit someone else's news.");
    }

    const updatedNews = this.newsRepository.merge(news, updateNewsDto);

    return await this.newsRepository.save(updatedNews);
  }

  async remove(id: number, userId: number) {
    const result = await this.newsRepository.delete({
      id: id,
      author: { id: userId },
    });

    if (result.affected === 0) {
      throw new ForbiddenException(
        `You can't delete someone else's news or it doesn't exist.`,
      );
    }

    return { message: 'Deleted successfully' };
  }
}
