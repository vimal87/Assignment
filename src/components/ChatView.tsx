import React, { useRef, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useChatContext } from '../context/ChatContext';
import ChatMessage from './ChatMessage';
import MessageInput from './MessageInput';
import { StopCircle } from 'lucide-react';
import { websocketService } from '../services/websocket';

const ChatView: React.FC = () => {
  const { state, dispatch } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const activeChat = state.chats.find(chat => chat.id === state.activeChat);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChat?.messages]);
  
  const handleStopGeneration = () => {
    websocketService.stopStreaming();
    dispatch({ type: 'SET_STREAMING', payload: false });
    
    if (activeChat) {
      const streamingMessage = activeChat.messages.find(msg => msg.isStreaming);
      if (streamingMessage) {
        dispatch({
          type: 'STOP_MESSAGE_STREAMING',
          payload: {
            chatId: activeChat.id,
            messageId: streamingMessage.id,
          },
        });
      }
    }
  };
  
  if (!activeChat) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          px: 3,
          py: 2,
          bgcolor: 'background.default',
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No chat selected
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 450, mb: 4 }}>
          Select an existing chat from the sidebar or create a new one to start a conversation with the AI assistant.
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h6" noWrap>
          {activeChat.title}
        </Typography>
        
        {state.isStreaming && (
          <Button
            startIcon={<StopCircle size={18} />}
            variant="outlined"
            color="error"
            size="small"
            onClick={handleStopGeneration}
          >
            Stop generating
          </Button>
        )}
      </Box>
      
      <Box
        sx={{
          p: 3,
          flexGrow: 1,
          overflowY: 'auto',
          bgcolor: 'background.default',
        }}
      >
        {activeChat.messages.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Start a new conversation
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 450 }}>
              Ask questions about market trends, trading strategies, or get real-time analysis of financial data.
            </Typography>
          </Box>
        ) : (
          activeChat.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        
        {state.isStreaming && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 2,
            }}
          >
            <CircularProgress size={16} />
            <Typography variant="caption" color="text.secondary">
              AI is generating a response...
            </Typography>
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Box>
      
      <MessageInput />
    </Box>
  );
};

export default ChatView;