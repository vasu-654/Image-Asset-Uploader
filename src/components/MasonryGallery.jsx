import React from 'react'
import { ImageList, ImageListItem } from '@mui/material'

function MasonryGallery({ images }) {
  return (
    <ImageList variant="masonry" cols={3} gap={8}>
      {images.map((image, index) => (
        <ImageListItem key={index}>
          <img 
            src={image.src} 
            alt={`uploaded-${index}`}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  )
}

export default MasonryGallery