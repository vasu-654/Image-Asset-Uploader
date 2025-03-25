# 📸 Image Asset Manager

## 🎯 Objective
Develop a feature that allows users to upload and manage image assets efficiently. Users can upload an image, edit it using various tools, and view the images in a masonry-style layout.

## 🚀 Features
- **Upload & Add Image Assets**: Users can select and upload images.
- **Image Editing Tools**:
  - 🖼️ **Crop**: Adjust the image dimensions.
  - 🔄 **Rotate**: Rotate the image clockwise.
  - ↔️ **Flip Horizontally**: Mirror the image along the horizontal axis.
  - ↕️ **Flip Vertically**: Mirror the image along the vertical axis.
- **Masonry-Style Image Display**: Uploaded images are displayed in a responsive, organized layout.

## 🛠️ Technology Stack
- **Frontend**: React.js
- **UI Libraries**: MUI

## 📂 Project Structure
```
📦 Image-Asset-Manager
 ┣ 📂 src
 ┃ ┣ 📂 assets                      # Static images/icons      
 ┃ ┣ 📂 components                  # Reusable components
 ┃   ┣ 📂 cropImage.js              # Reusable components 
 ┃   ┣ 📂 ImageEditDrawer.jsx       # Reusable components
 ┃   ┣ 📂 ImageUploadAndEdit.jsx    # Reusable components
 ┃   ┣ 📂 ImageUploader.jsx         # Reusable components
 ┃   ┣ 📂 MasonryGallery.jsx        # Reusable components
 ┃ ┣ 📂 styles           # functions
 ┃ ┗ 📜 App.jsx          # Main application file
 ┣ 📜 package.json      # Dependencies & scripts
 ┣ 📜 README.md         # Project documentation
┗ 📜 .gitignore         # Files to ignore in Git
```

## 📦 Installation & Setup
1. **Clone the repository**
   git clone https://github.com/vasu-654/Image-Asset-Uploader.git
   cd image-asset-upload

2. **Install dependencies**
   npm install

3. **Start the development server**
   npm run dev


## 🖥️ Usage
1. Open the application in your browser at `http://localhost:5173/`.
2. Click **Upload Image** to add an image asset.
3. Use the **drawer tools** to modify the uploaded image.
4. Once done, view the images in the **masonry-style list**.

## 🔧 Future Enhancements
- Add drag-and-drop support for image uploads.
- Implement undo/redo functionality for edits.
- Provide more advanced editing options like filters and brightness adjustments.
- Implement the functionailities properly.
- Improve CSS.


