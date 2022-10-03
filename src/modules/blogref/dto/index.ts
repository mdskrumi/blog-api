import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class BlogReferenceDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsNumber()
  @IsNotEmpty()
  blogId: number;
}
