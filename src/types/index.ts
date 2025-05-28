export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: number;
  attachments?: Attachment[];
  isStreaming?: boolean;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  agentId: string;
  folderId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Agent {
  id: string;
  name: string;
  systemPrompt: string;
  model: 'gpt-3.5-turbo' | 'gpt-4';
  temperature: number;
  createdAt: number;
}

export interface Folder {
  id: string;
  name: string;
  chatIds: string[];
  createdAt: number;
}

export interface Attachment {
  id: string;
  type: 'image' | 'pdf' | 'document';
  name: string;
  size: number;
  url: string;
}

export type ChatState = {
  chats: Chat[];
  folders: Folder[];
  agents: Agent[];
  activeChat: string | null;
  activeAgent: string | null;
  isStreaming: boolean;
  searchQuery: string;
};

export type ChatAction =
  | { type: 'SET_ACTIVE_CHAT'; payload: string }
  | { type: 'SET_ACTIVE_AGENT'; payload: string }
  | { type: 'CREATE_CHAT'; payload: Omit<Chat, 'messages' | 'createdAt' | 'updatedAt'> }
  | { type: 'DELETE_CHAT'; payload: string }
  | { type: 'RENAME_CHAT'; payload: { id: string; title: string } }
  | { type: 'ADD_MESSAGE'; payload: { chatId: string; message: Omit<Message, 'id' | 'timestamp'> } }
  | { type: 'UPDATE_MESSAGE'; payload: { chatId: string; messageId: string; content: string } }
  | { type: 'SET_STREAMING'; payload: boolean }
  | { type: 'STOP_MESSAGE_STREAMING'; payload: { chatId: string; messageId: string } }
  | { type: 'CREATE_AGENT'; payload: Omit<Agent, 'id' | 'createdAt'> }
  | { type: 'UPDATE_AGENT'; payload: Partial<Agent> & { id: string } }
  | { type: 'DELETE_AGENT'; payload: string }
  | { type: 'CREATE_FOLDER'; payload: { name: string } }
  | { type: 'RENAME_FOLDER'; payload: { id: string; name: string } }
  | { type: 'DELETE_FOLDER'; payload: string }
  | { type: 'ADD_CHAT_TO_FOLDER'; payload: { chatId: string; folderId: string } }
  | { type: 'REMOVE_CHAT_FROM_FOLDER'; payload: { chatId: string; folderId: string } }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'INITIALIZE_STATE'; payload: ChatState };