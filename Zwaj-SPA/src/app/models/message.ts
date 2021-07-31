export interface Message {

  id: number;
  senderId: number;
  senderKnownAs: string;
  senderPhotoUrl: string;
  recipientId: number;
  recipientKnownAs: string;
  recipientPhotoUrl: string;
  content: string;
  isread: boolean;
  dateread: Date;
  messageSent: Date;
  senderDeleted: boolean;
  recipientDeleted: boolean;


}
