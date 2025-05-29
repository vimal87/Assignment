import React from 'react';
import { Box, Typography, Paper, Avatar, Chip, IconButton, Tooltip } from '@mui/material';
import { Copy as CopyIcon, UserCircle, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import FileAttachment from './FileAttachment';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { content, sender, attachments, isStreaming } = message;
  
  const isUser = sender === 'user';
  
  const handleCopyContent = () => {
    navigator.clipboard.writeText(content);
  };
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
        maxWidth: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: isUser ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
          height: 'fit-content',
          gap: 1,
          maxWidth: '75%',
          width: 'fit-content',
        }}
      >
        <Avatar
          sx={{
            bgcolor: isUser ? 'primary.main' : 'secondary.main',
            width: 36,
            height: 36,
          }}
        >
          {isUser ? <UserCircle size={20} /> : <Bot size={20} />}
        </Avatar>
        
        <Box sx={{ maxWidth: 'calc(100% - 50px)', width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 0.5,
              flexDirection: isUser ? 'row-reverse' : 'row',
            }}
          >
            <Typography
              variant="caption"
              fontWeight="bold"
              color="text.secondary"
              sx={{ mr: isUser ? 0 : 1, ml: isUser ? 1 : 0 }}
            >
              {isUser ? 'User' : 'Assistant'}
            </Typography>
            
            {isStreaming && (
              <Chip
                label="Typing..."
                size="small"
                variant="outlined"
                color="secondary"
                sx={{ height: 20, fontSize: '0.7rem' }}
              />
            )}
          </Box>
          
          {attachments && attachments.length > 0 && (
            <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {attachments.map((attachment) => (
                <FileAttachment key={attachment.id} attachment={attachment} />
              ))}
            </Box>
          )}
          
          <Paper
            elevation={1}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: isUser ? 'primary.light' : 'background.paper',
              color: isUser ? 'primary.contrastText' : 'text.primary',
              minWidth: '60px',
              maxWidth: '100%',
              width: 'auto',
              position: 'relative',
              overflow: 'hidden',
              border: 1,
              borderColor: 'divider',
              wordBreak: 'break-word',
            }}
          >
            <Box className="markdown-content" sx={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}>
              <ReactMarkdown>
                {content || ' '}
              </ReactMarkdown>
            </Box>
            
            {!isUser && content && (
              <Tooltip title="Copy to clipboard">
                <IconButton
                  size="small"
                  onClick={handleCopyContent}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    opacity: 0.5,
                    '&:hover': {
                      opacity: 1,
                    },
                  }}
                >
                  <CopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatMessage;