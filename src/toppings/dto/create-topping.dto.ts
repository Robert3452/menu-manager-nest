export interface CreateToppingDto {
  available: boolean;
  title: string;
  price: number;
  required: boolean;
  index: number;
  maxLimit: number;
}
