import { IsEmail, IsNumber, IsOptional, IsString, Matches } from "class-validator";
export class UpdateDepartmentDto{
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  description?:string

  @IsNumber()
  @IsOptional()
  floor?: number

  @IsString()
  @IsOptional()
  @Matches(
      /^(\+?\d{10,15}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
      { message: "Login must be a valid email or phone number" }
  )
  phone?: string

  @IsEmail()
  @IsOptional()
  email?:string
}