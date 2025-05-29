import React from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  InputBase,
} from '@mui/material';
import { MessageCircle as ChatIcon, MoreVertical as MoreVertIcon } from 'lucide-react';

interface ChatListItemProps {
  title: string;
  isActive: boolean;
  isEditing: boolean;
  editTitle: string;
  onClick: () => void;
  onMenuClick: (event: React.MouseEvent<HTMLElement>) => void;
  onEditChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  title,
  isActive,
  isEditing,
  editTitle,
  onClick,
  onMenuClick,
  onEditChange,
  onKeyDown,
}) => {
  return (
    <ListItem
      disablePadding
      secondaryAction={
        !isEditing && (
          <IconButton
            edge="end"
            onClick={onMenuClick}
            size="small"
          >
            <MoreVertIcon />
          </IconButton>
        )
      }
    >
      {isEditing ? (
        <InputBase
          value={editTitle}
          onChange={(e) => onEditChange(e.target.value)}
          onKeyDown={onKeyDown}
          autoFocus
          fullWidth
          sx={{ pl: 4, pr: 2 }}
        />
      ) : (
        <ListItemButton
          onClick={onClick}
          selected={isActive}
          sx={{ pl: 4 }}
        >
          <ListItemIcon>
            <ChatIcon />
          </ListItemIcon>
          <ListItemText primary={title} />
        </ListItemButton>
      )}
    </ListItem>
  );
};

export default ChatListItem;
