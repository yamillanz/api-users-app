import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query('page') page: number, @Query('count') limit: number) {
    if (page && limit) {
      return this.usersService.findAllWithPagination(+page, +limit);
    }
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updateUser = await this.usersService.update(+id, updateUserDto);
    if (!updateUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.usersService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.usersService.remove(+id);
    return { message: `User with ID ${id} has been deleted` };
  }
}