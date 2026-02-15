import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SlotsController } from './slots.controller';
import { SlotsService } from './slots.service';
import { Slot, SlotSchema } from './schemas/slot.schema';
import { BetsModule } from '../bets/bets.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Slot.name, schema: SlotSchema }]),
    forwardRef(() => BetsModule),
  ],
  controllers: [SlotsController],
  providers: [SlotsService],
  exports: [SlotsService],
})
export class SlotsModule {}
