import React, { useState } from 'react';
import {
  Box,
  Drawer,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  InputBase,
  Divider,
  Button,
  Menu,
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
  Collapse
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Folder as FolderIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  SmartToy as BotIcon,
} from '@mui/icons-material';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';
import { useChatContext } from '../context/ChatContext';
import AgentCreationModal from './AgentCreationModal';
import ChatListItem from './ChatListItem';

const drawerWidth = 280;

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(1),
  marginLeft: 0,
  width: '100%',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

const Sidebar: React.FC = () => {
  const { state, dispatch } = useChatContext();
  const [agentModalOpen, setAgentModalOpen] = useState(false);
  const [folderMenuAnchor, setFolderMenuAnchor] = useState<null | HTMLElement>(null);
  const [chatMenuAnchor, setChatMenuAnchor] = useState<null | HTMLElement>(null);
  const [activeFolderMenu, setActiveFolderMenu] = useState<string | null>(null);
  const [activeChatMenu, setActiveChatMenu] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [newChatTitle, setNewChatTitle] = useState('');
  const [newFolderTitle, setNewFolderTitle] = useState('');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const handleCreateNewChat = () => {
    const chatId = uuidv4();
    dispatch({
      type: 'CREATE_CHAT',
      payload: {
        id: chatId,
        title: 'New Chat',
        agentId: state.activeAgent || 'default-agent',
      },
    });
  };

  const handleAgentChange = (event: SelectChangeEvent) => {
    dispatch({
      type: 'SET_ACTIVE_AGENT',
      payload: event.target.value,
    });
  };

  const handleChatClick = (chatId: string) => {
    dispatch({
      type: 'SET_ACTIVE_CHAT',
      payload: chatId,
    });
  };

  const handleFolderToggle = (folderId: string) => {
    if (expandedFolders.includes(folderId)) {
      setExpandedFolders(expandedFolders.filter(id => id !== folderId));
    } else {
      setExpandedFolders([...expandedFolders, folderId]);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'SET_SEARCH_QUERY',
      payload: event.target.value,
    });
  };

  const handleOpenFolderMenu = (event: React.MouseEvent<HTMLElement>, folderId: string) => {
    event.stopPropagation();
    setFolderMenuAnchor(event.currentTarget);
    setActiveFolderMenu(folderId);
  };

  const handleCloseFolderMenu = () => {
    setFolderMenuAnchor(null);
    setActiveFolderMenu(null);
  };

  const handleOpenChatMenu = (event: React.MouseEvent<HTMLElement>, chatId: string) => {
    event.stopPropagation();
    setChatMenuAnchor(event.currentTarget);
    setActiveChatMenu(chatId);
  };

  const handleCloseChatMenu = () => {
    setChatMenuAnchor(null);
    setActiveChatMenu(null);
  };

  const handleDeleteChat = (chatId: string) => {
    dispatch({
      type: 'DELETE_CHAT',
      payload: chatId,
    });
    handleCloseChatMenu();
  };

  const handleStartEditingChat = (chatId: string, title: string) => {
    setEditingChatId(chatId);
    setNewChatTitle(title);
    handleCloseChatMenu();
  };

  const handleSaveChatTitle = (chatId: string) => {
    if (newChatTitle.trim()) {
      dispatch({
        type: 'RENAME_CHAT',
        payload: {
          id: chatId,
          title: newChatTitle.trim(),
        },
      });
    }
    setEditingChatId(null);
  };

  const handleChatKeyDown = (event: React.KeyboardEvent, chatId: string) => {
    if (event.key === 'Enter') {
      handleSaveChatTitle(chatId);
    } else if (event.key === 'Escape') {
      setEditingChatId(null);
    }
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      dispatch({
        type: 'CREATE_FOLDER',
        payload: {
          name: newFolderName.trim(),
        },
      });
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  const handleFolderNameKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleCreateFolder();
    } else if (event.key === 'Escape') {
      setIsCreatingFolder(false);
    }
  };

  const handleDeleteFolder = (folderId: string) => {
    dispatch({
      type: 'DELETE_FOLDER',
      payload: folderId,
    });
    handleCloseFolderMenu();
  };

  const handleStartEditingFolder = (folderId: string, name: string) => {
    setEditingFolderId(folderId);
    setNewFolderTitle(name);
    handleCloseFolderMenu();
  };

  const handleSaveFolderTitle = (folderId: string) => {
    if (newFolderTitle.trim()) {
      dispatch({
        type: 'RENAME_FOLDER',
        payload: {
          id: folderId,
          name: newFolderTitle.trim(),
        },
      });
    }
    setEditingFolderId(null);
  };

  const handleFolderKeyDown = (event: React.KeyboardEvent, folderId: string) => {
    if (event.key === 'Enter') {
      handleSaveFolderTitle(folderId);
    } else if (event.key === 'Escape') {
      setEditingFolderId(null);
    }
  };

  const handleAddChatToFolder = (chatId: string, folderId: string) => {
    dispatch({
      type: 'ADD_CHAT_TO_FOLDER',
      payload: { chatId, folderId },
    });
    handleCloseChatMenu();
  };

  const handleRemoveChatFromFolder = (chatId: string, folderId: string) => {
    dispatch({
      type: 'REMOVE_CHAT_FROM_FOLDER',
      payload: { chatId, folderId },
    });
    handleCloseChatMenu();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const chatId = active.id as string;
    const targetId = over.id as string;
    
    const targetFolder = state.folders.find(folder => folder.id === targetId);
    if (targetFolder) {
      handleAddChatToFolder(chatId, targetFolder.id);
    }
  };

  const filteredChats = state.chats.filter((chat) => {
    if (!state.searchQuery) return true;
    return (
      chat.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      chat.messages.some((msg) =>
        msg.content.toLowerCase().includes(state.searchQuery.toLowerCase())
      )
    );
  });

  const unfolderedChats = filteredChats.filter((chat) => !chat.folderId);

  const filteredFolders = state.folders.filter((folder) => {
    if (!state.searchQuery) return true;
    
    if (folder.name.toLowerCase().includes(state.searchQuery.toLowerCase())) {
      return true;
    }
    
    return folder.chatIds.some((chatId) => {
      const chat = state.chats.find((c) => c.id === chatId);
      if (!chat) return false;
      
      return (
        chat.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        chat.messages.some((msg) =>
          msg.content.toLowerCase().includes(state.searchQuery.toLowerCase())
        )
      );
    });
  });

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            border: 'none',
            bgcolor: 'background.paper',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ px: 2, pt: 2, pb: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            fullWidth
            onClick={handleCreateNewChat}
            sx={{ mb: 2 }}
          >
            New Chat
          </Button>
          
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <Select
              value={state.activeAgent || 'default-agent'}
              onChange={handleAgentChange}
              displayEmpty
              renderValue={(value) => {
                const agent = state.agents.find((a) => a.id === value);
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BotIcon fontSize="small" sx={{ mr: 1 }} />
                    {agent ? agent.name : 'Select Agent'}
                  </Box>
                );
              }}
            >
              {state.agents.map((agent) => (
                <MenuItem key={agent.id} value={agent.id}>
                  {agent.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            size="small"
            onClick={() => setAgentModalOpen(true)}
            fullWidth
            sx={{ mb: 2 }}
          >
            Create Agent
          </Button>
          
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search chats..."
              inputProps={{ 'aria-label': 'search' }}
              value={state.searchQuery}
              onChange={handleSearchChange}
            />
          </Search>
        </Box>
        
        <Divider />
        
        <Box sx={{ overflow: 'auto', flex: 1 }}>
          <List>
            {filteredFolders.map((folder) => {
              const isExpanded = expandedFolders.includes(folder.id);
              const folderChats = filteredChats.filter(
                (chat) => chat.folderId === folder.id
              );
              
              if (folderChats.length === 0 && state.searchQuery) {
                return null;
              }
              
              return (
                <React.Fragment key={folder.id}>
                  <ListItem
                    disablePadding
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={(e) => handleOpenFolderMenu(e, folder.id)}
                        size="small"
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemButton
                      onClick={() => handleFolderToggle(folder.id)}
                      sx={{ pr: 6 }}
                    >
                      <ListItemIcon>
                        <FolderIcon color="primary" />
                      </ListItemIcon>
                      {editingFolderId === folder.id ? (
                        <InputBase
                          value={newFolderTitle}
                          onChange={(e) => setNewFolderTitle(e.target.value)}
                          onKeyDown={(e) => handleFolderKeyDown(e, folder.id)}
                          onBlur={() => handleSaveFolderTitle(folder.id)}
                          autoFocus
                          fullWidth
                          sx={{ ml: -2 }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <ListItemText primary={folder.name} />
                      )}
                      {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </ListItemButton>
                  </ListItem>
                  
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <SortableContext
                        items={folderChats.map(chat => chat.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {folderChats.map((chat) => (
                          <ChatListItem
                            key={chat.id}
                            id={chat.id}
                            title={chat.title}
                            isActive={state.activeChat === chat.id}
                            onClick={() => handleChatClick(chat.id)}
                            onMenuClick={(e) => handleOpenChatMenu(e, chat.id)}
                          />
                        ))}
                      </SortableContext>
                    </List>
                  </Collapse>
                </React.Fragment>
              );
            })}
            <SortableContext
              items={unfolderedChats.map(chat => chat.id)}
              strategy={verticalListSortingStrategy}
            >
              {unfolderedChats.map((chat) => (
                <ChatListItem
                  key={chat.id}
                  id={chat.id}
                  title={chat.title}
                  isActive={state.activeChat === chat.id}
                  onClick={() => handleChatClick(chat.id)}
                  onMenuClick={(e) => handleOpenChatMenu(e, chat.id)}
                />
              ))}
            </SortableContext>
          </List>
          
          <Divider sx={{ my: 1 }} />
          
          {isCreatingFolder ? (
            <Box sx={{ px: 2, py: 1 }}>
              <InputBase
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={handleFolderNameKeyDown}
                onBlur={() => setIsCreatingFolder(false)}
                autoFocus
                fullWidth
                endAdornment={
                  <IconButton
                    size="small"
                    onClick={handleCreateFolder}
                    disabled={!newFolderName.trim()}
                  >
                    <AddIcon />
                  </IconButton>
                }
              />
            </Box>
          ) : (
            <Box sx={{ px: 2, py: 1 }}>
              <Button
                startIcon={<FolderIcon />}
                variant="text"
                size="small"
                onClick={() => setIsCreatingFolder(true)}
                fullWidth
                sx={{ justifyContent: 'flex-start' }}
              >
                New Folder
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    
      <AgentCreationModal
        open={agentModalOpen}
        onClose={() => setAgentModalOpen(false)}
      />
      
      <Menu
        anchorEl={folderMenuAnchor}
        open={Boolean(folderMenuAnchor)}
        onClose={handleCloseFolderMenu}
      >
        <MenuItem
          onClick={() => {
            if (activeFolderMenu) {
              const folder = state.folders.find((f) => f.id === activeFolderMenu);
              if (folder) {
                handleStartEditingFolder(folder.id, folder.name);
              }
            }
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Rename" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (activeFolderMenu) {
              handleDeleteFolder(activeFolderMenu);
            }
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>
      
      <Menu
        anchorEl={chatMenuAnchor}
        open={Boolean(chatMenuAnchor)}
        onClose={handleCloseChatMenu}
      >
        <MenuItem
          onClick={() => {
            if (activeChatMenu) {
              const chat = state.chats.find((c) => c.id === activeChatMenu);
              if (chat) {
                handleStartEditingChat(chat.id, chat.title);
              }
            }
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Rename" />
        </MenuItem>
        
        <MenuItem
          onClick={() => {
            if (activeChatMenu) {
              handleDeleteChat(activeChatMenu);
            }
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
        
        <Divider />
        
        <Typography variant="caption" sx={{ px: 2, py: 0.5, color: 'text.secondary' }}>
          Move to Folder
        </Typography>
        
        {state.folders.map((folder) => {
          const chat = activeChatMenu ? state.chats.find((c) => c.id === activeChatMenu) : null;
          const isInFolder = chat?.folderId === folder.id;
          
          return (
            <MenuItem
              key={folder.id}
              onClick={() => {
                if (activeChatMenu) {
                  if (isInFolder) {
                    handleRemoveChatFromFolder(activeChatMenu, folder.id);
                  } else {
                    handleAddChatToFolder(activeChatMenu, folder.id);
                  }
                }
              }}
            >
              <ListItemIcon>
                <FolderIcon fontSize="small" color={isInFolder ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary={folder.name} />
            </MenuItem>
          );
        })}
      </Menu>
    </DndContext>
  );
};

export default Sidebar;