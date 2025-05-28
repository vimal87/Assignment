import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  Box,
} from '@mui/material';
import { useChatContext } from '../context/ChatContext';

interface AgentCreationModalProps {
  open: boolean;
  onClose: () => void;
}

const AgentCreationModal: React.FC<AgentCreationModalProps> = ({ open, onClose }) => {
  const { dispatch } = useChatContext();
  const [name, setName] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('You are an AI assistant specialized in financial trading, helping traders with market analysis, trends, and investment strategies.');
  const [model, setModel] = useState<'gpt-3.5-turbo' | 'gpt-4'>('gpt-3.5-turbo');
  const [temperature, setTemperature] = useState(0.7);
  const [errors, setErrors] = useState({
    name: false,
    systemPrompt: false,
  });

  const handleCreate = () => {
    const newErrors = {
      name: !name.trim(),
      systemPrompt: !systemPrompt.trim(),
    };
    
    setErrors(newErrors);
    
    if (newErrors.name || newErrors.systemPrompt) {
      return;
    }
    
    dispatch({
      type: 'CREATE_AGENT',
      payload: {
        name: name.trim(),
        systemPrompt: systemPrompt.trim(),
        model,
        temperature,
      },
    });
    
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setSystemPrompt('You are an AI assistant specialized in financial trading, helping traders with market analysis, trends, and investment strategies.');
    setModel('gpt-3.5-turbo');
    setTemperature(0.7);
    setErrors({
      name: false,
      systemPrompt: false,
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Agent</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Agent Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            error={errors.name}
            helperText={errors.name ? 'Agent name is required' : ''}
            autoFocus
          />
          
          <TextField
            label="System Prompt"
            fullWidth
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            margin="normal"
            multiline
            rows={4}
            error={errors.systemPrompt}
            helperText={errors.systemPrompt ? 'System prompt is required' : ''}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="model-select-label">Model</InputLabel>
            <Select
              labelId="model-select-label"
              value={model}
              label="Model"
              onChange={(e) => setModel(e.target.value as 'gpt-3.5-turbo' | 'gpt-4')}
            >
              <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
              <MenuItem value="gpt-4">GPT-4 </MenuItem>
            </Select>
          </FormControl>
          
          <Box sx={{ mt: 3, mb: 1 }}>
            <Typography gutterBottom>
              Temperature: {temperature.toFixed(1)}
            </Typography>
            <Slider
              value={temperature}
              onChange={(_, value) => setTemperature(value as number)}
              step={0.1}
              marks
              min={0}
              max={1}
              valueLabelDisplay="auto"
            />
            <Typography variant="caption" color="text.secondary">
              Lower values (0.0) result in more consistent outputs, higher values (1.0) make output more random and creative
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleCreate} variant="contained" color="primary">
          Create Agent
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AgentCreationModal;