import React from 'react';
import { Box, Paper, Typography, IconButton, Tooltip } from '@mui/material';
import {
  Download as DownloadIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  Description as DocIcon,
  ZoomIn as ZoomInIcon,
} from '@mui/icons-material';
import { Attachment } from '../types';
import { formatFileSize } from '../services/fileService';

interface FileAttachmentProps {
  attachment: Attachment;
}

const FileAttachment: React.FC<FileAttachmentProps> = ({ attachment }) => {
  const { type, name, size, url } = attachment;
  const [showPreview, setShowPreview] = React.useState(false);
  
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
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handlePreview = () => {
    if (type === 'image') {
      setShowPreview(true);
    } else if (type === 'pdf') {
      window.open(url, '_blank');
    }
  };
  
  return (
    <>
      <Paper
        elevation={1}
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1,
          borderRadius: 1,
          maxWidth: 300,
          bgcolor: 'background.paper',
        }}
      >
        <Box
          sx={{
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            mr: 1,
          }}
        >
          {renderIcon()}
        </Box>
        
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            component="div"
            sx={{
              fontWeight: 'medium',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatFileSize(size)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex' }}>
          {(type === 'image' || type === 'pdf') && (
            <Tooltip title="Preview">
              <IconButton size="small\" onClick={handlePreview}>
                <ZoomInIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          
          <Tooltip title="Download">
            <IconButton size="small" onClick={handleDownload}>
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
      
      {showPreview && type === 'image' && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => setShowPreview(false)}
        >
          <Box
            component="img"
            src={url}
            alt={name}
            sx={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
              boxShadow: 24,
            }}
          />
        </Box>
      )}
    </>
  );
};

export default FileAttachment;