import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseModel } from 'src/common/models/base.model';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ timestamps: true })
export class Profile extends BaseModel{

  @Prop({ required: true, type: String })
  firstName:string;

  @Prop({ required: false, type: String })
  middleName:string;

  @Prop({ required: true, type: String })
  lastName:string;

  @Prop({ required: true, type: String })
  phoneNumber:string;

  @Prop({ required: true, type: String })
  email: string;

  @Prop({ required: true, type: String, select: false })
  password: string;
}

export const ProfileModel = SchemaFactory.createForClass(Profile);
