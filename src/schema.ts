import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExcelDataDocument = ExcelData & Document;

@Schema()
export class ExcelData {
  
  @Prop([Object])
  details: Record<string, any>[];
}

export const ExcelDataSchema = SchemaFactory.createForClass(ExcelData);
