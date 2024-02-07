export class CreateUserDto {
  name: string;
  last_name: string;
  password: string;
  email: string;
  user_id: string;
  create_time?: Date;
}
