import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Users } from '../../users/entities/user.entity';
import { News } from '../../news/entities/news.entity';
import { Role } from '../../enums/role.enum';

export default class UserNewsSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const userRepository = dataSource.getRepository(Users);
    const newsRepository = dataSource.getRepository(News);

    let admin = await userRepository.findOneBy({ email: 'admin@test.ru' });

    if (!admin) {
      admin = await userRepository.save({
        email: 'admin@test.ru',
        password:
          '$2b$10$KQNrD18bMtSUavstXIXN/OAO6ePbCqb/IiPaNdMYSXrOLZgYnyTx.', // admin1234
        username: 'testUserAdmin',
        role: Role.ADMIN,
      });
    }

    const _testUser = await userRepository.save({
      email: 'user@test.ru',
      password: '$2b$10$iMnIFugpIUNPOuAiSBi3DeMMSUqrql2kcQ/65ftkxCrp.cyeAtuuG', // admin1234
      username: 'testUser', // user1234
    });

    const newsCount = await newsRepository.count();

    if (newsCount === 0) {
      await newsRepository.save([
        {
          title: 'Первая новость портала',
          description: 'Текст описания новости',
          authorId: admin.id,
        },
        {
          title: 'Вторая новость портала',
          description: 'Миграции и сиды работают вместе',
          authorId: admin.id,
        },
      ]);
    }
  }
}
