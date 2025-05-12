import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { Product } from "../product.entity";
import { CreateProductDto } from "./create-product.dto";

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;

  product: Product;
}
