import React, { useState, useRef, useCallback, useMemo } from 'react'
import { 
  Drawer, 
  Button, 
  IconButton, 
  Typography, 
  Box,
  Slider,
  TextField,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Select,
  InputAdornment
} from '@mui/material'
import { 
  RotateRight, 
  FlipToFront, 
  FlipToBack, 
  Close, 
  Upload,
  Check,
  MoreVert,
  Edit,
  DeleteOutline,
  VisibilityOff,
  InfoOutlined,
  Search
} from '@mui/icons-material'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from './cropImage'

function ImageUploadAndEdit() {
  const [images, setImages] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')
  const [currentEditImage, setCurrentEditImage] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [cropSize, setCropSize] = useState({ width: 0, height: 0 })
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [aspectRatio, setAspectRatio] = useState(4 / 3)
  const [flip, setFlip] = useState({ 
    horizontal: false, 
    vertical: false 
  })
  const [imageDescription, setImageDescription] = useState('')
  const [imageName, setImageName] = useState('')
  const fileInputRef = useRef(null)
  const [cropperKey, setCropperKey] = useState(0)
  
  // New state for menu and dialog
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newImage = {
          src: reader.result,
          file: file,
          description: '',
          name: file.name,
          uploadedAt: new Date().toLocaleString(),
          hidden: false
        }
        setImages(prevImages => [...prevImages, newImage])
        setCurrentEditImage(newImage)
        // Reset states
        resetEditStates()
      }
      reader.readAsDataURL(file)
    }
  }

  // Filtered and sorted images
  const displayedImages = useMemo(() => {
    // First filter by search term
    const filteredImages = images.filter(img => 
      !img.hidden && 
      img.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Then sort
    return filteredImages.sort((a, b) => {
      const dateA = new Date(a.uploadedAt)
      const dateB = new Date(b.uploadedAt)
      return sortOrder === 'newest' 
        ? dateB.getTime() - dateA.getTime() 
        : dateA.getTime() - dateB.getTime()
    })
  }, [images, searchTerm, sortOrder])

  // Rest of the previous component remains the same...
  const resetEditStates = () => {
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
    setFlip({ horizontal: false, vertical: false })
    setCropperKey(prev => prev + 1)
    setImageDescription('')
    setImageName('')
  }

  const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
    setCropSize({ 
      width: croppedAreaPixels.width, 
      height: croppedAreaPixels.height 
    })
  }, [])

  const performCrop = async () => {
    if (!croppedAreaPixels) return
  
    try {
      const croppedImage = await getCroppedImg(
        currentEditImage.src, 
        croppedAreaPixels, 
        rotation,
        flip
      )
      
      // Create the updated image object
      const updatedImage = { 
        ...currentEditImage,
        src: croppedImage,
        description: imageDescription,
        name: imageName || currentEditImage.name
      }
      
      // Update images array
      const updatedImages = images.map(img => 
        img.src === currentEditImage.src ? updatedImage : img
      )
      
      // Update state with the new images array
      setImages(updatedImages)
      
      // Set the current edit image to the updated image
      setCurrentEditImage(updatedImage)
      
      // Reset edit states
      resetEditStates()
    } catch (e) {
      console.error(e)
    }
  }

  const rotateImage = () => {
    setRotation((prev) => (prev + 90) % 360)
    setCropperKey(prev => prev + 1)
  }

  const flipHorizontal = () => {
    setFlip(prev => ({ 
      ...prev, 
      horizontal: !prev.horizontal 
    }))
    setCropperKey(prev => prev + 1)
  }

  const flipVertical = () => {
    setFlip(prev => ({ 
      ...prev, 
      vertical: !prev.vertical 
    }))
    setCropperKey(prev => prev + 1)
  }

  // New method to handle menu open
  const handleMenuOpen = (event, image) => {
    setAnchorEl(event.currentTarget)
    setSelectedImage(image)
  }

  // New method to handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedImage(null)
  }

  // New method to handle edit
  const handleEdit = () => {
    setCurrentEditImage(selectedImage)
    setImageDescription(selectedImage.description || '')
    setImageName(selectedImage.name || '')
    handleMenuClose()
  }

  // New method to handle hide
  const handleHide = () => {
    setImages(prevImages => 
      prevImages.map(img => 
        img.src === selectedImage.src 
          ? { ...img, hidden: !img.hidden } 
          : img
      )
    )
    handleMenuClose()
  }

  // New method to handle delete
  const handleDelete = () => {
    setImages(prevImages => 
      prevImages.filter(img => img.src !== selectedImage.src)
    )
    handleMenuClose()
    setIsDeleteDialogOpen(false)
  }

  // New method to open info dialog
  const handleOpenInfoDialog = () => {
    setIsInfoDialogOpen(true)
    handleMenuClose()
  }

  return (
    <Box sx={{ padding: 2 }}>
      {/* Search and Sort Container */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        marginBottom: 2 
      }}>
        {/* Search Input */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search images..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
        />

        {/* Sort Dropdown */}
        <Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          variant="outlined"
          sx={{ width: 200 }}
        >
          <MenuItem value="newest">Newest First</MenuItem>
          <MenuItem value="oldest">Oldest First</MenuItem>
        </Select>

        {/* File Input (Hidden) */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleFileUpload}
        />

        {/* Upload Button */}
        <Button 
          variant="contained" 
          startIcon={<Upload />}
          onClick={() => fileInputRef.current.click()}
          sx={{ height: '56px' }}
        >
          Upload Image
        </Button>
      </Box>

      {/* Image Gallery */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2 
        }}
      >
        {displayedImages.map((img, index) => (
          <Box 
            key={index} 
            sx={{ 
              position: 'relative', 
              width: 250, 
              border: '1px solid #ddd',
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <img 
              src={img.src} 
              alt={`uploaded-${index}`}
              style={{ 
                width: '100%', 
                height: 200, 
                objectFit: 'cover' 
              }}
              onClick={() => {
                setCurrentEditImage(img)
                setImageDescription(img.description || '')
                setImageName(img.name || '')
              }}
            />
            
            {/* More Options Menu */}
            <IconButton 
              sx={{ 
                position: 'absolute', 
                top: 0, 
                right: 0 
              }}
              onClick={(e) => handleMenuOpen(e, img)}
            >
              <MoreVert />
            </IconButton>

            {/* Image Info Overlay */}
            <Box 
              sx={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                backgroundColor: 'rgba(0,0,0,0.5)', 
                color: 'white', 
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <IconButton 
                size="small" 
                onClick={() => {
                  setSelectedImage(img)
                  handleOpenInfoDialog()
                }}
                sx={{ color: 'white' }}
              >
                <InfoOutlined fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>

      {/* More Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleHide}>
          <VisibilityOff sx={{ mr: 1 }} /> Hide
        </MenuItem>
        <MenuItem onClick={() => setIsDeleteDialogOpen(true)} sx={{ color: 'error.main' }}>
          <DeleteOutline sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Image Info Dialog */}
      <Dialog
        open={isInfoDialogOpen}
        onClose={() => setIsInfoDialogOpen(false)}
      >
        <DialogTitle>Image Details</DialogTitle>
        <DialogContent>
          {selectedImage && (
            <>
              <DialogContentText>
                <strong>Name:</strong> {selectedImage.name}
              </DialogContentText>
              <DialogContentText>
                <strong>Description:</strong> {selectedImage.description || 'No description'}
              </DialogContentText>
              <DialogContentText>
                <strong>Uploaded At:</strong> {selectedImage.uploadedAt}
              </DialogContentText>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsInfoDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Image</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this image?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDelete} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Edit Drawer */}
      <Drawer
        anchor="bottom"
        open={!!currentEditImage}
        onClose={() => setCurrentEditImage(null)}
        PaperProps={{
          sx: { 
            height: '100vh', 
            display: 'flex', 
            flexDirection: 'column' 
          }
        }}
      >
        <Box sx={{ 
          height: '100%', 
          padding: 2, 
          display: 'flex', 
          flexDirection: 'column' 
        }}>
          {/* Drawer Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <Typography variant="h6">Edit Image</Typography>
            <IconButton onClick={() => setCurrentEditImage(null)}>
              <Close />
            </IconButton>
          </Box>

          {/* Image Cropper */}
          <Box sx={{ 
            position: 'relative', 
            flex: 1, 
            width: '100%', 
            marginTop: 2 
          }}>
            <Cropper
              key={cropperKey}
              image={currentEditImage?.src}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onCropComplete={handleCropComplete}
              onZoomChange={setZoom}
              rotation={rotation}
              flipHorizontal={flip.horizontal}
              flipVertical={flip.vertical}
            />
          </Box>

          {/* Name Input */}
          <Box sx={{ marginTop: 2 }}>
            <TextField
              fullWidth
              label="Image Name"
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              variant="outlined"
            />
          </Box>

          {/* Description Input */}
          <Box sx={{ marginTop: 2 }}>
            <TextField
              fullWidth
              label="Image Description"
              value={imageDescription}
              onChange={(e) => setImageDescription(e.target.value)}
              variant="outlined"
              multiline
              rows={2}
            />
          </Box>

          {/* Aspect Ratio Selector */}
          <Box sx={{ marginTop: 2 }}>
            <Typography>Aspect Ratio</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[
                { label: 'Free', value: null },
                { label: '16:9', value: 16 / 9 },
                { label: '4:3', value: 4 / 3 },
                { label: '1:1', value: 1 }
              ].map((ratio) => (
                <Button
                  key={ratio.label}
                  variant={aspectRatio === ratio.value ? 'contained' : 'outlined'}
                  onClick={() => setAspectRatio(ratio.value)}
                  size="small"
                >
                  {ratio.label}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Crop Size Display */}
          <Box sx={{ marginTop: 2 }}>
            <Typography>
              Crop Size: {cropSize.width} x {cropSize.height} pixels
            </Typography>
          </Box>

          {/* Zoom Slider */}
          <Box sx={{ width: '100%', marginTop: 2 }}>
            <Typography>Zoom</Typography>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e, newValue) => setZoom(newValue)}
            />
          </Box>

          {/* Edit Action Buttons */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2, 
            marginTop: 2 
          }}>
            <Button 
              startIcon={<RotateRight />} 
              variant="outlined"
              onClick={rotateImage}
            >
              Rotate
            </Button>
            <Button 
              startIcon={<FlipToFront />} 
              variant="outlined"
              onClick={flipHorizontal}
              color={flip.horizontal ? 'primary' : 'default'}
            >
              Flip Horizontal
            </Button>
            <Button 
              startIcon={<FlipToBack />} 
              variant="outlined"
              onClick={flipVertical}
              color={flip.vertical ? 'primary' : 'default'}
            >
              Flip Vertical
            </Button>
            <Button 
              startIcon={<Check />} 
              variant="contained"
              color="primary"
              onClick={performCrop}
            >
              Apply Changes
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  )
}

export default ImageUploadAndEdit