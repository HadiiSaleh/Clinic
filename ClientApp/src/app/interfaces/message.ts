export interface Message {
  Name: string;
  Email: string; 
  m_subject: string;
  m_message: string;
  m_date?: Date;
  m_id?: number;
  m_sender_id?: string;
  sender_username?: string;
}
