import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatState, ChatAction, Chat, Message, Agent, Folder } from '../types';
import { saveState, loadState } from '../services/storage';

const initialState: ChatState = {
  chats: [],
  folders: [],
  agents: [
    {
      id: 'default-agent',
      name: 'Trading Assistant',
      systemPrompt: 'You are an AI assistant specialized in financial trading, helping traders with market analysis, trends, and investment strategies.',
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      createdAt: Date.now(),
    },
  ],
  activeChat: null,
  activeAgent: 'default-agent',
  isStreaming: false,
  searchQuery: '',
};

const ChatContext = createContext<{
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_ACTIVE_CHAT':
      return {
        ...state,
        activeChat: action.payload,
      };

    case 'SET_ACTIVE_AGENT':
      return {
        ...state,
        activeAgent: action.payload,
      };

    case 'CREATE_CHAT': {
      const newChat: Chat = {
        ...action.payload,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      return {
        ...state,
        chats: [...state.chats, newChat],
        activeChat: newChat.id,
      };
    }

    case 'DELETE_CHAT': {
      const updatedChats = state.chats.filter((chat) => chat.id !== action.payload);
      const updatedFolders = state.folders.map((folder) => ({
        ...folder,
        chatIds: folder.chatIds.filter((id) => id !== action.payload),
      }));
      let newActiveChat = state.activeChat;
      if (state.activeChat === action.payload) {
        const sortedChats = [...updatedChats].sort((a, b) => b.updatedAt - a.updatedAt);
        newActiveChat = sortedChats.length > 0 ? sortedChats[0].id : null;
      }
      return {
        ...state,
        chats: updatedChats,
        folders: updatedFolders,
        activeChat: newActiveChat,
      };
    }

    case 'RENAME_CHAT': {
      const updatedChats = state.chats.map((chat) =>
        chat.id === action.payload.id
          ? { ...chat, title: action.payload.title, updatedAt: Date.now() }
          : chat
      );
      return {
        ...state,
        chats: updatedChats,
      };
    }

    case 'ADD_MESSAGE': {
      const { chatId, message } = action.payload;
      const newMessage: Message = {
        id: uuidv4(),
        ...message,
        timestamp: Date.now(),
      };
      const updatedChats = state.chats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              updatedAt: Date.now(),
            }
          : chat
      );
      return {
        ...state,
        chats: updatedChats,
      };
    }

    case 'UPDATE_MESSAGE': {
      const { chatId, messageId, content } = action.payload;
      const updatedChats = state.chats.map((chat) => {
        if (chat.id === chatId) {
          const updatedMessages = chat.messages.map((msg) =>
            msg.id === messageId
              ? { ...msg, content, isStreaming: false }
              : msg
          );
          return { ...chat, messages: updatedMessages, updatedAt: Date.now() };
        }
        return chat;
      });
      return {
        ...state,
        chats: updatedChats,
      };
    }

    case 'SET_STREAMING':
      return {
        ...state,
        isStreaming: action.payload,
      };

    case 'STOP_MESSAGE_STREAMING': {
      const { chatId, messageId } = action.payload;
      const updatedChats = state.chats.map((chat) => {
        if (chat.id === chatId) {
          const updatedMessages = chat.messages.map((msg) =>
            msg.id === messageId ? { ...msg, isStreaming: false } : msg
          );
          return { ...chat, messages: updatedMessages };
        }
        return chat;
      });
      return {
        ...state,
        chats: updatedChats,
        isStreaming: false,
      };
    }

    case 'CREATE_AGENT': {
      const newAgent: Agent = {
        id: uuidv4(),
        ...action.payload,
        createdAt: Date.now(),
      };
      return {
        ...state,
        agents: [...state.agents, newAgent],
        activeAgent: newAgent.id,
      };
    }

    case 'UPDATE_AGENT': {
      const updatedAgents = state.agents.map((agent) =>
        agent.id === action.payload.id
          ? { ...agent, ...action.payload }
          : agent
      );
      return {
        ...state,
        agents: updatedAgents,
      };
    }

    case 'DELETE_AGENT': {
      if (state.agents.length <= 1) {
        return state;
      }
      const updatedAgents = state.agents.filter((agent) => agent.id !== action.payload);
      let newActiveAgent = state.activeAgent;
      if (state.activeAgent === action.payload) {
        newActiveAgent = updatedAgents[0].id;
      }
      const updatedChats = state.chats.map((chat) =>
        chat.agentId === action.payload
          ? { ...chat, agentId: newActiveAgent }
          : chat
      );
      return {
        ...state,
        agents: updatedAgents,
        activeAgent: newActiveAgent,
        chats: updatedChats,
      };
    }

    case 'CREATE_FOLDER': {
      const newFolder: Folder = {
        id: uuidv4(),
        name: action.payload.name,
        chatIds: [],
        createdAt: Date.now(),
      };
      return {
        ...state,
        folders: [...state.folders, newFolder],
      };
    }

    case 'RENAME_FOLDER': {
      const updatedFolders = state.folders.map((folder) =>
        folder.id === action.payload.id
          ? { ...folder, name: action.payload.name }
          : folder
      );
      return {
        ...state,
        folders: updatedFolders,
      };
    }

    case 'DELETE_FOLDER': {
      const deletedFolder = state.folders.find((folder) => folder.id === action.payload);
      if (!deletedFolder) return state;
      const updatedFolders = state.folders.filter((folder) => folder.id !== action.payload);
      const updatedChats = state.chats.map((chat) =>
        chat.folderId === action.payload
          ? { ...chat, folderId: undefined }
          : chat
      );
      return {
        ...state,
        folders: updatedFolders,
        chats: updatedChats,
      };
    }

    case 'ADD_CHAT_TO_FOLDER': {
      const { chatId, folderId } = action.payload;
      const updatedFolders = state.folders.map((folder) => {
        if (folder.id === folderId) {
          return folder.chatIds.includes(chatId)
            ? folder
            : { ...folder, chatIds: [...folder.chatIds, chatId] };
        }
        return folder;
      });
      const updatedChats = state.chats.map((chat) =>
        chat.id === chatId
          ? { ...chat, folderId }
          : chat
      );
      return {
        ...state,
        folders: updatedFolders,
        chats: updatedChats,
      };
    }

    case 'REMOVE_CHAT_FROM_FOLDER': {
      const { chatId, folderId } = action.payload;
      const updatedFolders = state.folders.map((folder) => {
        if (folder.id === folderId) {
          return {
            ...folder,
            chatIds: folder.chatIds.filter((id) => id !== chatId),
          };
        }
        return folder;
      });
      const updatedChats = state.chats.map((chat) =>
        chat.id === chatId && chat.folderId === folderId
          ? { ...chat, folderId: undefined }
          : chat
      );
      return {
        ...state,
        folders: updatedFolders,
        chats: updatedChats,
      };
    }

    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };

    case 'INITIALIZE_STATE':
      return action.payload;

    default:
      return state;
  }
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  useEffect(() => {
    const loadStateFromStorage = async () => {
      try {
        const savedState = await loadState();
        if (savedState) {
          dispatch({ type: 'INITIALIZE_STATE', payload: savedState });
        }
      } catch (error) {
        console.error('Failed to load state from storage:', error);
      }
    };
    loadStateFromStorage();
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
