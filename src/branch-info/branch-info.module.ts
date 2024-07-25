import { Module } from '@nestjs/common';
import { StoresModule } from 'src/stores/stores.module';
import { BranchInfoService } from './branch-info.service';
import { ScheduleService } from './services/schedule.service';
import { WeekdayScheduleService } from './services/weekday-schedule.service';
import { AddressService } from './services/address.service';
import { AddressesController } from './controllers/addresses.controller';
import { SchedulesController } from './controllers/schedules.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [StoresModule, HttpModule],
  controllers: [AddressesController, SchedulesController],
  providers: [
    BranchInfoService,
    WeekdayScheduleService,
    ScheduleService,
    AddressService,
  ],
  exports: [AddressService],
})
export class BranchInfoModule {}
