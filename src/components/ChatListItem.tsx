import React from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton
} from '@mui/material';
import { Chat as ChatIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';

interface ChatListItemProps {
  id: string;
  title: string;
  isActive: boolean;
  onClick: () => void;
  onMenuClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  id,
  title,
  isActive,
  onClick,
  onMenuClick,
}) => {
  return (
    <ListItem
      disablePadding
      secondaryAction={
        <IconButton edge="end" onClick={onMenuClick} size="small">
          <MoreVertIcon fontSize="small" />
        </IconButton>
      }
    >
      <ListItemButton onClick={onClick} selected={isActive} sx={{ pr: 6 }}>
        <ListItemIcon>
          <ChatIcon color={isActive ? 'primary' : 'inherit'} />
        </ListItemIcon>
        <ListItemText primary={title} />
      </ListItemButton>
    </ListItem>
  );
};

export default ChatListItem;
