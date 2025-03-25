export async function getCroppedImg(
    imageSrc, 
    pixelCrop, 
    rotation = 0, 
    flip = { horizontal: false, vertical: false }
  ) {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
  
    const maxSize = Math.max(image.width, image.height)
    canvas.width = maxSize
    canvas.height = maxSize
  
    // Move to center of canvas
    ctx.translate(maxSize / 2, maxSize / 2)
    
    // Apply rotations and flips
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.scale(
      flip.horizontal ? -1 : 1, 
      flip.vertical ? -1 : 1
    )
    
    // Move back from center
    ctx.translate(-maxSize / 2, -maxSize / 2)
  
    // Draw the original image
    ctx.drawImage(
      image, 
      0, 
      0, 
      image.width, 
      image.height
    )
  
    // Extract the cropped area
    const data = ctx.getImageData(
      pixelCrop.x, 
      pixelCrop.y, 
      pixelCrop.width, 
      pixelCrop.height
    )
  
    // Resize canvas to cropped dimensions
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height
    
    // Put cropped image data
    ctx.putImageData(data, 0, 0)
  
    return canvas.toDataURL('image/jpeg')
  }
  
  function createImage(url) {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', error => reject(error))
      image.src = url
    })
  }