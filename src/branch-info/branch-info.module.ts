import { Module } from '@nestjs/common';
import { StoresModule } from 'src/stores/stores.module';
import { BranchInfoController } from './branch-info.controller';
import { BranchInfoService } from './branch-info.service';
import { ScheduleService } from './services/schedule.service';
import { WeekdayScheduleService } from './services/weekday-schedule.service';
import { AddressService } from './services/address.service';

@Module({
  imports: [StoresModule],
  controllers: [BranchInfoController],
  providers: [
    BranchInfoService,
    WeekdayScheduleService,
    ScheduleService,
    AddressService,
  ],
})
export class BranchInfoModule {}
