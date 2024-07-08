import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  public trackingNumber: string;
  @IsString()
  @MinLength(1)
  public company: string;
  @IsString()
  public customerName: string;
  @IsString()
  public email: string;
  @IsString()
  public address: string;
  @IsString()
  @IsOptional()
  public phone: string;
}
