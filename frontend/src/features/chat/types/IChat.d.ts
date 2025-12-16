export type ChatMessage = {
  user: string;
  text: string;
  room?: string;
  imageUrl?: string;
};

export type ChatState = {
  user?: string;
  room?: string;
  messages: ChatMessage[];
  status: string[];
  setUserRoom: (user: string, room?: string) => void;
  addMessage: (m: ChatMessage) => void;
  addStatus: (s: string) => void;
  setHistory: (list: ChatMessage[]) => void;
};


type Message = {
  user: string; text: string; room?: string, imageUrl?: string;
};

type ChatState = {
  user?: string;
  room?: string;
  messages: Message[];
  status: string[];
  setUserRoom: (user: string, room?: string) => void;
  addMessage: (m: Message) => void;
  addStatus: (s: string) => void;
  setHistory: (list: Message[]) => void;
};
