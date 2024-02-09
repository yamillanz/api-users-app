import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.usersRepository.findOne({
      where: [
        { email: createUserDto.email },
        { user_id: createUserDto.user_id },
      ],
    });
    if (userExists) {
      return { message: 'User already exists' };
    }

    const user = new User();
    user.name = createUserDto.name;
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(createUserDto.password, salt);
    // user.password = createUserDto.password;
    user.email = createUserDto.email;
    user.create_time = new Date();
    user.user_id = createUserDto.user_id;
    const userCreated = await this.usersRepository.save(user);
    delete userCreated.password;
    return userCreated;
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  findByEmailUserName(username: string) {
    return this.usersRepository.findOne({
      where: [{ email: username }, { user_id: username }],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const newid = isNaN(+id) ? -1 : +id;
    console.log('llego', newid);

    const userForUpdate = await this.usersRepository.findOne({
      where: [{ id: newid }, { user_id: id }, { email: id }],
    });

    if (!userForUpdate) {
      return false;
    }

    for (const key in updateUserDto) {
      if (updateUserDto.hasOwnProperty(key)) {
        userForUpdate[key] = updateUserDto[key];
      }
    }

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    // delete userForUpdate.create_time;
    console.log(
      '🚀 ~ UsersService ~ update ~ userForUpdate:',
      userForUpdate.id,
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { create_time, ...userForUpdateWithoutCreate } = userForUpdate;
    const newUpdateDto = { ...userForUpdateWithoutCreate };
    delete newUpdateDto.id;
    console.log('🚀 ~ UsersService ~ update ~ newUpdateDto:', newUpdateDto);
    console.log('🚀 ~ UsersService ~ update ~ updateUserDto:', updateUserDto);
    const resp: UpdateResult = await this.usersRepository.update(
      // userForUpdate.id,
      3,
      updateUserDto,
      // userForUpdate,
      // userForUpdateWithoutCreate,
      // newUpdateDto,
    );
    if (resp.affected) {
      return true;
    }
    return false;
  }

  async remove(id: number) {
    const resp = await this.usersRepository.delete(id);
    if (resp.affected) {
      return true;
    }
    return false;
  }

  findAllWithPagination(page: number, limit: number) {
    return this.usersRepository.find({
      skip: page * limit,
      take: limit,
    });
  }
}
