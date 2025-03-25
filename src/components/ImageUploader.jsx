import React, { useRef, useState } from 'react'
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Typography,
  Box
} from '@mui/material'
import { 
  Upload, 
  CloudUpload, 
  ImageOutlined 
} from '@mui/icons-material'

function ImageUploader({ 
  onImageUpload, 
  multiple = false, 
  maxFiles = 5, 
  maxFileSize = 5 * 1024 * 1024 // 5MB default
}) {
  const fileInputRef = useRef(null)
  const [openErrorDialog, setOpenErrorDialog] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])

  const validateFiles = (files) => {
    const errors = []
    const validFiles = []

    // Check number of files
    if (!multiple && files.length > 1) {
      errors.push('Only one file can be uploaded at a time.')
    }

    if (multiple && files.length > maxFiles) {
      errors.push(`Maximum of ${maxFiles} files can be uploaded.`)
    }

    // Validate each file
    Array.from(files).forEach(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name} is not a valid image file.`)
        return
      }

      // Check file size
      if (file.size > maxFileSize) {
        errors.push(`${file.name} exceeds the maximum file size of ${maxFileSize / 1024 / 1024}MB.`)
        return
      }

      validFiles.push(file)
    })

    return { errors, validFiles }
  }

  const handleFileChange = (event) => {
    const files = event.target.files
    const { errors, validFiles } = validateFiles(files)

    if (errors.length > 0) {
      setErrorMessages(errors)
      setOpenErrorDialog(true)
      return
    }

    // Process valid files
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageData = {
          src: reader.result,
          file: file,
          originalSrc: reader.result,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toLocaleString()
        }
        onImageUpload(imageData)
      }
      reader.readAsDataURL(file)
    })

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCloseErrorDialog = () => {
    setOpenErrorDialog(false)
    setErrorMessages([])
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileChange}
        multiple={multiple}
      />
      <Button 
        variant="contained" 
        startIcon={<CloudUpload />}
        onClick={() => fileInputRef.current.click()}
      >
        Upload {multiple ? 'Images' : 'Image'}
      </Button>

      {/* Error Dialog */}
      <Dialog
        open={openErrorDialog}
        onClose={handleCloseErrorDialog}
      >
        <DialogTitle>Upload Errors</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <ImageOutlined color="error" sx={{ marginRight: 2 }} />
            <Typography color="error" variant="subtitle1">
              Some files could not be uploaded
            </Typography>
          </Box>
          {errorMessages.map((error, index) => (
            <Typography key={index} variant="body2" color="error" gutterBottom>
              • {error}
            </Typography>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog} color="primary">
            Understood
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ImageUploader