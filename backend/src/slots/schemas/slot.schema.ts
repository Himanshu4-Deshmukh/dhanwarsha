import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SlotStatus } from '../../common/enums';

export type SlotDocument = Slot & Document;

@Schema({ timestamps: true })
export class Slot {
  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ required: true, enum: SlotStatus, default: SlotStatus.OPEN })
  status: SlotStatus;

  @Prop({ required: true, default: 10 })
  betAmount: number;

  @Prop({ required: true, default: 95 })
  winAmount: number;

  @Prop({ type: Number, min: 0, max: 99 })
  winningNumber?: number;
}

export const SlotSchema = SchemaFactory.createForClass(Slot);
