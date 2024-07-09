import {
  IsIn,
  isIn,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  public trackingNumber: string;
  @IsIn(['dhl', 'estafeta', '99minutos'], {
    message: 'Company must be either dhl or estafeta or 99minutos',
  })
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
