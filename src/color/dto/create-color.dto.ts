import { IsNotEmpty, IsString, MaxLength, Matches } from 'class-validator';

export class CreateColorDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string; // "Black", "Dark Blue", "Navy Blue"

  @IsString()
  @IsNotEmpty()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'hexCode must be a valid hex color code (e.g., #000000)',
  })
  hexCode: string; // "#000000", "#00008B"
}