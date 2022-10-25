import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PageReqDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  @IsOptional()
  rows?: number = 10;

  @IsNumber()
  @Min(0)
  page?: number = 1;
}

export class PageRespDto<T> {
  readonly page: number;
  readonly rows: number;
  readonly list: T[];
}
