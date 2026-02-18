import { IsNotEmpty, IsInt, IsString, MaxLength, Min } from 'class-validator';

export class CreateSizeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string; // "S", "M", "L", "XL", "XXL"

  @IsInt()
  @Min(1)
  displayOrder: number; // S=1, M=2, L=3, XL=4, XXL=5
}