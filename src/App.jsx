import React, { useState, useMemo } from 'react'
import { 
  Box, 
  Container, 
  ThemeProvider, 
  createTheme, 
  CssBaseline,
  IconButton,
  Typography,
  Button,
  Menu,
  MenuItem,
  Tooltip,
  TextField,
  Select,
  InputAdornment
} from '@mui/material'
import { 
  Edit as EditIcon,
  MoreVert,
  VisibilityOff,
  DeleteOutline,
  InfoOutlined,
  Search,
  CloudUpload
} from '@mui/icons-material'
import Masonry from 'react-masonry-css'
import ImageUploader from './components/ImageUploader'
import ImageEditDrawer from './components/ImageEditDrawer'
import './styles/masonry.css'
import openingImage from './assets/openingimage.png' // Import the opening image

function App() {
  const [currentImage, setCurrentImage] = useState(null)
  const [images, setImages] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  
  // New state for landing page
  const [isLandingPage, setIsLandingPage] = useState(true)
  
  // Search and sort states
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')

  // Custom theme with a light mode
  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2',
      },
    },
  })

  // Filtered and sorted images
  const displayedImages = useMemo(() => {
    const filteredImages = images.filter(img => 
      !img.hidden && 
      img.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return filteredImages.sort((a, b) => {
      const dateA = new Date(a.uploadedAt || new Date())
      const dateB = new Date(b.uploadedAt || new Date())
      
      return sortOrder === 'newest' 
        ? dateB.getTime() - dateA.getTime() 
        : dateA.getTime() - dateB.getTime()
    })
  }, [images, searchTerm, sortOrder])

  const handleImageUpload = (image) => {
    const newImage = {
      ...image,
      uploadedAt: new Date().toISOString(),
      hidden: false
    }
    setImages(prev => [...prev, newImage])
    setCurrentImage(newImage)
    
    // Move from landing page to gallery after first upload
    if (isLandingPage) {
      setIsLandingPage(false)
    }
  }

  // Menu and image management methods 
  const handleMenuOpen = (event, image) => {
    setAnchorEl(event.currentTarget)
    setSelectedImage(image)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedImage(null)
  }

  const handleEditImage = (img) => {
    setCurrentImage(img)
    setSelectedImage(img)
    handleMenuClose()
  }

  const handleApplyChanges = (modifiedImage) => {
    setImages(prevImages => 
      prevImages.map(img => 
        img === selectedImage 
          ? { 
              ...modifiedImage, 
              uploadedAt: img.uploadedAt,
              hidden: img.hidden
            } 
          : img
      )
    )
    
    setCurrentImage(modifiedImage)
  }

  const handleHideImage = () => {
    setImages(prev => 
      prev.map(img => 
        img === selectedImage 
          ? { ...img, hidden: true } 
          : img
      )
    )
    handleMenuClose()
  }

  const handleDeleteImage = () => {
    setImages(prev => prev.filter(img => img !== selectedImage))
    handleMenuClose()
  }

  // Breakpoints for responsive masonry layout
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  }


  if (isLandingPage) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            height: '100vh',
            width: '100vw',
            position: 'fixed', 
            top: 0,
            left: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundImage: `url(${openingImage})`,
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            backgroundRepeat: 'no-repeat', 
            overflow: 'hidden' 
          }}
        >
          <Box
            sx={{
              backgroundColor: 'rgba(255,255,255,0.8)',
              padding: 4,
              borderRadius: 2,
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              zIndex: 10 
            }}
          >
            <Typography variant="h4" gutterBottom>
              Welcome to Image Gallery
            </Typography>
            <ImageUploader 
              onImageUpload={handleImageUpload} 
              renderButton={(handleClick) => (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CloudUpload />}
                  onClick={handleClick}
                  size="large"
                >
                  Upload First Image
                </Button>
              )}
            />
          </Box>
        </Box>
      </ThemeProvider>
    )
  }


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ padding: 2 }}>
          {/* Top Section with Search, Sort, and Upload */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            marginBottom: 4,
            backgroundColor: '#f5f5f5',
            padding: 2,
            borderRadius: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {/* Search Input */}
            <TextField
              sx={{ flex: 6 }}
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
              sx={{ flex: 2 }}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              variant="outlined"
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
            </Select>

            {/* Upload Button */}
            <Box sx={{ 
              flex: 2, 
              display: 'flex', 
              justifyContent: 'flex-end' 
            }}>
              <ImageUploader onImageUpload={handleImageUpload} />
            </Box>
          </Box>
          
          {/* Masonry Image Gallery */}
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {displayedImages.map((img, index) => (
              <div 
                key={index} 
                style={{ 
                  position: 'relative',
                  marginBottom: '16px',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onClick={() => {
                  setCurrentImage(img)
                  setSelectedImage(img)
                }}
              >
                <img 
                  src={img.src} 
                  alt={`uploaded-${index}`}
                  style={{ 
                    width: '100%', 
                    height: 'auto', 
                    objectFit: 'cover',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />

                {/* Bottom Right Icons Container */}
                <Box sx={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  display: 'flex',
                  gap: 1
                }}>
                  {/* Edit Icon */}
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditImage(img)
                    }}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.7)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.9)'
                      }
                    }}
                  >
                    <EditIcon />
                  </IconButton>

                  {/* Info Icon */}
                  <Tooltip 
                    title={
                      <Box>
                        <Typography variant="body2">
                          <strong>Name:</strong> {img.name || 'Unnamed Image'}
                        </Typography>
                        {img.description && (
                          <Typography variant="body2">
                            <strong>Description:</strong> {img.description}
                          </Typography>
                        )}
                        <Typography variant="body2">
                          <strong>Uploaded:</strong> {img.uploadedAt}
                        </Typography>
                      </Box>
                    }
                    placement="bottom"
                  >
                    <IconButton
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.9)'
                        }
                      }}
                    >
                      <InfoOutlined />
                    </IconButton>
                  </Tooltip>
                </Box>
              </div>
            ))}
          </Masonry>

          {/* More Options Menu (if needed) */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleEditImage(selectedImage)}>
              <EditIcon sx={{ mr: 1 }} /> Edit
            </MenuItem>
            <MenuItem onClick={handleHideImage}>
              <VisibilityOff sx={{ mr: 1 }} /> Hide
            </MenuItem>
            <MenuItem onClick={handleDeleteImage} sx={{ color: 'error.main' }}>
              <DeleteOutline sx={{ mr: 1 }} /> Delete
            </MenuItem>
          </Menu>

          {/* Image Edit Drawer */}
          {currentImage && (
            <ImageEditDrawer
              image={currentImage}
              onClose={() => {
                setCurrentImage(null)
                setSelectedImage(null)
              }}
              onApplyChanges={handleApplyChanges}
            />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default App