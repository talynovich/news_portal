import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../enums/role.enum';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private UsersRepository: Repository<Users>,
  ) {}

  async register(registerDto: CreateUserDto) {
    const exist = await this.UsersRepository.findOneBy({
      email: registerDto.email,
    });
    if (exist) throw new BadRequestException('User already exists');
    const hashedPassword = bcrypt.hashSync(registerDto.password, 10);
    const user = this.UsersRepository.create({
      ...registerDto,
      password: hashedPassword,
    });
    const savedUser = await this.UsersRepository.save(user);
    const { password: _password, ...result } = savedUser;
    return result;
  }
  findUserForAuth(email: string) {
    return this.UsersRepository.findOne({
      where: { email },
      select: ['email', 'password', 'id', 'username', 'role'],
    });
  }

  async findAll() {
    return await this.UsersRepository.find();
  }

  async remove(id: number) {
    const userToDelete = await this.UsersRepository.findOne({ where: { id } });
    if (!userToDelete) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    if (userToDelete.role === Role.ADMIN) {
      throw new ForbiddenException('Cannot delete user with admin role');
    }
    await this.UsersRepository.delete(id);
    return { message: `User ${id} successfully deleted` };
  }
}
