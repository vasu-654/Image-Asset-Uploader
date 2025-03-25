import React, { useState, useCallback } from 'react'
import { 
  Drawer, 
  Button, 
  IconButton, 
  Typography, 
  Box,
  TextField,
  Slider,
  Tooltip
} from '@mui/material'
import { 
  RotateRight, 
  FlipToFront, 
  FlipToBack, 
  Close, 
  Upload,
  Crop,
  CropFree,
  Image as ReplaceImageIcon,
  ArrowDropDown
} from '@mui/icons-material'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from './cropImage'

function ImageEditDrawer({ 
  image, 
  onClose, 
  onApplyChanges, 
  onUpload 
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [rotation, setRotation] = useState(0)
  const [aspectRatio, setAspectRatio] = useState(4 / 3)
  const [flip, setFlip] = useState({ 
    horizontal: false, 
    vertical: false 
  })
  const [imageName, setImageName] = useState(image.name || '')
  const [imageDescription, setImageDescription] = useState(image.description || '')
  const [cropperKey, setCropperKey] = useState(0)
  const [isCropMode, setIsCropMode] = useState(false)
  const [transformedImage, setTransformedImage] = useState(null)

  const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const applyTransformation = async () => {
    try {
      const transformedImg = await getCroppedImg(
        image.src, 
        croppedAreaPixels || { x: 0, y: 0, width: 0, height: 0 }, 
        rotation,
        flip
      )
      
      // Save transformed image and reset crop mode
      setTransformedImage(transformedImg)
      setIsCropMode(false)
      
      // Apply changes to the image
      onApplyChanges({
        ...image,
        src: transformedImg,
        name: imageName,
        description: imageDescription,
        rotation,
        flip,
        uploadedAt: new Date().toISOString()
      })
    } catch (e) {
      console.error(e)
    }
  }

  const rotateImage = () => {
    const newRotation = (rotation + 90) % 360
    setRotation(newRotation)
    setCropperKey(prev => prev + 1)
    applyTransformation()
  }

  const flipHorizontal = () => {
    const newFlip = { 
      ...flip, 
      horizontal: !flip.horizontal 
    }
    setFlip(newFlip)
    setCropperKey(prev => prev + 1)
    applyTransformation()
  }

  const flipVertical = () => {
    const newFlip = { 
      ...flip, 
      vertical: !flip.vertical 
    }
    setFlip(newFlip)
    setCropperKey(prev => prev + 1)
    applyTransformation()
  }

  const handleUpload = () => {
    onUpload({
      src: transformedImage || image.src,
      name: imageName,
      description: imageDescription,
      uploadedAt: new Date().toISOString()
    })
    onClose()
  }

  return (
    <Drawer
      anchor="bottom"
      open={!!image}
      onClose={onClose}
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
          <Typography variant="h6">Edit Asset</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ 
          display: 'flex', 
          flexGrow: 1, 
          marginTop: 2,
          gap: 2
        }}>
          {/* Image Area */}
          <Box sx={{ 
            position: 'relative', 
            flex: 2, 
            width: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Image Edit Icons */}
            <Box sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              <Tooltip title="Rotate" placement="left">
                <IconButton 
                  onClick={rotateImage}
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
                  }}
                >
                  <RotateRight />
                </IconButton>
              </Tooltip>
              <Tooltip title="Flip Horizontal" placement="left">
                <IconButton 
                  onClick={flipHorizontal}
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
                  }}
                  color={flip.horizontal ? 'primary' : 'default'}
                >
                  <FlipToFront />
                </IconButton>
              </Tooltip>
              <Tooltip title="Flip Vertical" placement="left">
                <IconButton 
                  onClick={flipVertical}
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
                  }}
                  color={flip.vertical ? 'primary' : 'default'}
                >
                  <FlipToBack />
                </IconButton>
              </Tooltip>
              <Tooltip title={isCropMode ? "Exit Crop" : "Crop"} placement="left">
                <IconButton 
                  onClick={() => setIsCropMode(!isCropMode)}
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
                  }}
                  color={isCropMode ? 'primary' : 'default'}
                >
                  {isCropMode ? <CropFree /> : <Crop />}
                </IconButton>
              </Tooltip>
            </Box>

            {isCropMode ? (
              <Cropper
                key={cropperKey}
                image={image?.src}
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
            ) : (
              <img 
                src={transformedImage || image?.src} 
                alt="Original" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  transform: `
                    rotate(${rotation}deg) 
                    scaleX(${flip.horizontal ? -1 : 1}) 
                    scaleY(${flip.vertical ? -1 : 1})
                  `
                }} 
              />
            )}
          </Box>

          {/* Side Panel */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2 
          }}>
            {/* Zoom Slider */}
            {isCropMode && (
              <Box>
                <Typography>Zoom</Typography>
                <Slider
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e, newValue) => setZoom(newValue)}
                />
              </Box>
            )}

            {/* Image Name Input */}
            <TextField
              fullWidth
              label="Enter Name"
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              variant="outlined"
            />

            {/* Description Input */}
            <TextField
              fullWidth
              label="Enter Description"
              value={imageDescription}
              onChange={(e) => setImageDescription(e.target.value)}
              variant="outlined"
              multiline
              rows={4}
            />

            {/* Aspect Ratio Selector - Only show in Crop Mode */}
            {isCropMode && (
              <Box>
                <Typography>Aspect Ratio</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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
            )}
          </Box>
        </Box>

        {/* Bottom Actions */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'center', 
          gap: 2,
          marginTop: 2 
        }}>
          {isCropMode && (
            <Button 
              variant="contained"
              color="secondary"
              onClick={applyTransformation}
            >
              Apply Crop
            </Button>
          )}
          <Button 
            variant="contained"
            color="primary"
            onClick={handleUpload}
            startIcon={<Upload />}
          >
            Upload Image
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}

export default ImageEditDrawer