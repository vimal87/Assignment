import React from 'react';
import { Box, Paper, Typography, IconButton, Tooltip } from '@mui/material';
import { Close as CloseIcon, Image as ImageIcon, PictureAsPdf as PdfIcon, Description as DocIcon } from '@mui/icons-material';
import { Attachment } from '../types';
import { formatFileSize } from '../services/fileService';

interface FileUploadPreviewProps {
  attachment: Attachment;
  onRemove: () => void;
}

const FileUploadPreview: React.FC<FileUploadPreviewProps> = ({ attachment, onRemove }) => {
  const { type, name, size, url } = attachment;
  
  const renderIcon = () => {
    switch (type) {
      case 'image':
        return <ImageIcon />;
      case 'pdf':
        return <PdfIcon />;
      case 'document':
        return <DocIcon />;
      default:
        return <DocIcon />;
    }
  };
  
  const renderPreview = () => {
    if (type === 'image') {
      return (
        <Box
          component="img"
          src={url}
          alt={name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 1,
          }}
        />
      );
    } else {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'primary.main',
          }}
        >
          {renderIcon()}
        </Box>
      );
    }
  };
  
  return (
    <Paper
      elevation={1}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: 100,
        height: 120,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 1,
      }}
    >
      <Tooltip title="Remove">
        <IconButton
          size="small"
          onClick={onRemove}
          sx={{
            position: 'absolute',
            top: 2,
            right: 2,
            bgcolor: 'rgba(0, 0, 0, 0.4)',
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.6)',
            },
            zIndex: 1,
            p: 0.5,
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {renderPreview()}
      </Box>
      
      <Box
        sx={{
          p: 0.5,
          bgcolor: 'rgba(0, 0, 0, 0.05)',
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: '0.7rem',
          }}
        >
          {name}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: '0.65rem' }}
        >
          {formatFileSize(size)}
        </Typography>
      </Box>
    </Paper>
  );
};

export default FileUploadPreview;