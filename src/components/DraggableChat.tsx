import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { Chat as ChatIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';

interface DraggableChatProps {
  id: string;
  title: string;
  isActive: boolean;
  onClick: () => void;
  onMenuClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const DraggableChat: React.FC<DraggableChatProps> = ({ id, title, isActive, onClick, onMenuClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      disablePadding
      secondaryAction={
        <IconButton
          edge="end"
          onClick={onMenuClick}
          size="small"
          sx={{ visibility: isDragging ? 'hidden' : 'visible' }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      }
      {...attributes}
      {...listeners}
    >
      <ListItemButton
        onClick={onClick}
        selected={isActive}
        sx={{ pr: 6 }}
      >
        <ListItemIcon>
          <ChatIcon color={isActive ? 'primary' : 'inherit'} />
        </ListItemIcon>
        <ListItemText primary={title} />
      </ListItemButton>
    </ListItem>
  );
};

export default DraggableChat;