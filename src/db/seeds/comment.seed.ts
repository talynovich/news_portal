import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Comment } from '../../comments/entities/comment.entity';
import { Users } from '../../users/entities/user.entity';

export default class CommentSeed implements Seeder {
  public async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const commentRepository = dataSource.getRepository(Comment);
    const userRepository = dataSource.getRepository(Users);

    // Получаем пользователей для связи
    const users = await userRepository.find({ take: 2 });

    if (users.length < 1) {
      console.log('Нет пользователей в БД. Запустите сиды для пользователей!');
      return;
    }

    const author = users[0];
    const targetNewsUser = users[1] || users[0]; // На случай если пользователь всего один

    const comments = commentRepository.create([
      {
        text: 'Первый тестовый комментарий',
        author: author,
        news: targetNewsUser,
        createdAt: new Date(),
      },
      {
        text: 'Второй интересный комментарий к посту',
        author: targetNewsUser,
        news: author,
        createdAt: new Date(),
      },
    ]);

    await commentRepository.save(comments);
  }
}
