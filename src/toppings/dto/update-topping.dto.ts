// import { PartialType } from '@nestjs/swagger';
import { CreateToppingDto } from './create-topping.dto';

// export class UpdateToppingDto extends PartialType<CreateToppingDto>(
//   CreateToppingDto,
// ) {}
export interface UpdateToppingDto extends Partial<CreateToppingDto> {
  id?: number;
}
