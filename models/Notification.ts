import { Schema, model, models, Document } from "mongoose";

export enum NotificationType {
  ORDER = "order",
  PAYMENT = "payment",
  MESSAGE = "message",
  SYSTEM = "system",
}

export interface Notification {
  user: Schema.Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
}

export interface NotificationDocument extends Notification, Document {}

const NotificationSchema = new Schema<NotificationDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      default: NotificationType.SYSTEM,
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const NotificationModel =
  models.Notification ||
  model<NotificationDocument>("Notification", NotificationSchema);
