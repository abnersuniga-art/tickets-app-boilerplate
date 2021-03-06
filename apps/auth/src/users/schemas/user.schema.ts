import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { hash } from 'bcrypt';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop()
  name: string;
}

export async function UserPreSave() {
  const saltRounds = 12;
  this.password = await hash(this.password, saltRounds);
}

export const UserSchema = SchemaFactory.createForClass(User);
