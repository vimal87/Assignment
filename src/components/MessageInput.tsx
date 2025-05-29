import React, { useState, useRef } from 'react';
import { Box, TextField, IconButton, Paper, Tooltip } from '@mui/material';
import { Send as SendIcon, AttachFile as AttachFileIcon, Mic as MicIcon } from '@mui/icons-material';
import { processFile, FileError } from '../services/fileService';
import { useChatContext } from '../context/ChatContext';
import { websocketService } from '../services/websocket';
import { v4 as uuidv4 } from 'uuid';
import FileUploadPreview from './FileUploadPreview';
import { Attachment } from '../types';

const MessageInput: React.FC = () => {
  const { state, dispatch } = useChatContext();
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async () => {
    if ((!message.trim() && attachments.length === 0) || !state.activeChat) return;
    
    const chatId = state.activeChat;
    const activeAgent = state.agents.find(agent => agent.id === state.activeAgent);
    
    if (!activeAgent) return;

    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        chatId,
        message: {
          content: message.trim(),
          sender: 'user',
          attachments,
        },
      },
    });
  
    setMessage('');
    setAttachments([]);
    
    const assistantMessageId = uuidv4();
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        chatId,
        message: {
          id: assistantMessageId,
          content: '',
          sender: 'assistant',
          isStreaming: true,
        },
      },
    });
    
    dispatch({ type: 'SET_STREAMING', payload: true });
    
    let streamedContent = '';
    
    try {
      await websocketService.connect();
      
      websocketService.onMessage((token) => {
        streamedContent += token;
        dispatch({
          type: 'UPDATE_MESSAGE',
          payload: {
            chatId,
            messageId: assistantMessageId,
            content: streamedContent,
          },
        });
      });
      
      websocketService.onCompletion(() => {
        dispatch({ type: 'SET_STREAMING', payload: false });
        dispatch({
          type: 'STOP_MESSAGE_STREAMING',
          payload: { chatId, messageId: assistantMessageId },
        });
      });
      
      websocketService.onError((error) => {
        console.error('WebSocket error:', error);
        dispatch({ type: 'SET_STREAMING', payload: false });
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            chatId,
            message: {
              content: 'An error occurred while generating the response. Please try again.',
              sender: 'assistant',
            },
          },
        });
      });
      
      websocketService.sendMessage(message, activeAgent.systemPrompt, activeAgent.model);
    } catch (error) {
      console.error('Failed to send message:', error);
      dispatch({ type: 'SET_STREAMING', payload: false });
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          chatId,
          message: {
            content: 'Failed to connect to the server. Please check your connection and try again.',
            sender: 'assistant',
          },
        },
      });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    try {
      const newAttachments: Attachment[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const attachment = await processFile(files[i]);
        newAttachments.push(attachment);
      }
      
      setAttachments(prev => [...prev, ...newAttachments]);
    } catch (error) {
      if (error instanceof FileError) {
        setFileError(error.message);
      } else {
        setFileError('An unexpected error occurred while processing the file.');
        console.error('File upload error:', error);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(attachment => attachment.id !== id));
  };

  return (
    <Paper 
      elevation={3}
      sx={{
        p: 2,
        bgcolor: 'background.paper',
        position: 'sticky',
        bottom: 0,
        zIndex: 10,
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      {fileError && (
        <Box sx={{ mb: 1, color: 'error.main', fontSize: '0.875rem' }}>
          {fileError}
        </Box>
      )}
      
      {attachments.length > 0 && (
        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {attachments.map((attachment) => (
            <FileUploadPreview
              key={attachment.id}
              attachment={attachment}
              onRemove={() => handleRemoveAttachment(attachment.id)}
            />
          ))}
        </Box>
      )}
      
      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <Tooltip title="Attach file">
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            color="primary"
            sx={{ mr: 1 }}
            disabled={!state.activeChat || state.isStreaming}
          >
            <AttachFileIcon />
          </IconButton>
        </Tooltip>
        
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileUpload}
          multiple
          accept=".jpg,.jpeg,.png,.gif,.pdf,.docx"
        />
        
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!state.activeChat || state.isStreaming}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: 'background.paper',
            },
          }}
        />
        
        <Tooltip title="Voice input">
          <IconButton
            color="primary"
            sx={{ ml: 1 }}
            disabled={!state.activeChat || state.isStreaming}
          >
            <MicIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Send message">
          <IconButton
            onClick={handleSendMessage}
            color="primary"
            sx={{ ml: 1 }}
            disabled={(!message.trim() && attachments.length === 0) || !state.activeChat || state.isStreaming}
          >
            <SendIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
};

export default MessageInput;