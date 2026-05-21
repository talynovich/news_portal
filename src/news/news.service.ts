import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './entities/news.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News) private newsRepository: Repository<News>,
  ) {}

  private s3 = new S3Client({
    region: process.env.S3_REGION,

    endpoint: process.env.S3_ENDPOINT,

    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY!,
      secretAccessKey: process.env.S3_SECRET_KEY!,
    },
  });
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
  ): Promise<{
    data: News[];
    total: number;
  }> {
    const [data, total] = await this.newsRepository.findAndCount({
      relations: ['author'],
      order: {
        createdAt: 'DESC',
      },
      take: limit,
      skip: (page - 1) * limit,
    });
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

  async search(searchQuery: string): Promise<News[]> {
    if (!searchQuery || searchQuery.trim() === '') {
      return [];
    }
    const formattedQuery = searchQuery.trim();

    return await this.newsRepository.find({
      where: [
        { title: ILike(`%${formattedQuery}%`) },
        { description: ILike(`%${formattedQuery}%`) },
      ],
      relations: ['author'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async upload(file: Express.Multer.File) {
    const key = Date.now() + '-' + file.originalname;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: 'e0548cd6-7b4158dc-a1b2c3d4',
        Key: 'AKIAIOSFODNN7EXAMPLE',
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return {
      key,
      url: `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${key}`,
    };
  }
}
