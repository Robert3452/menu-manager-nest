import { PartialType } from '@nestjs/swagger';
import { CreateBranchInfoDto } from './create-branch-info.dto';

export class UpdateBranchInfoDto extends PartialType(CreateBranchInfoDto) {}
