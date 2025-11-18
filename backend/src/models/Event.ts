import { Schema, model, Document } from 'mongoose';


export interface IEvent extends Document {
title: string;
start: Date;
end: Date;
allDay?: boolean;
color?: string;
userId?: string;
}


const EventSchema = new Schema<IEvent>({
title: { type: String, required: true },
start: { type: Date, required: true },
end: { type: Date, required: true },
allDay: { type: Boolean, default: false },
color: { type: String, default: '#3b82f6' },
userId: { type: String }
}, { timestamps: true });


export default model<IEvent>('Event', EventSchema);