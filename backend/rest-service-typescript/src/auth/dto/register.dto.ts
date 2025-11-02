import { Transform } from "class-transformer";
import { IsString, MinLength } from "class-validator";
import { CreateUserDto } from "src/users/dto/create-user.dto";

export class RegisterDto extends CreateUserDto {
    @Transform(({ value }: { value: string }) => value.trim())
    @IsString()
    @MinLength(6)
    password: string;
}