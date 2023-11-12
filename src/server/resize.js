const sharp = require('sharp');
const fs = require('fs');

const inputImagePath = 'input.jpg'; // Replace with your input image path
const outputImagePath = 'output.jpg'; // Replace with your output image path

const finalWidthMM = 100; // Desired final width in millimeters
const finalHeightMM = 150; // Desired final height in millimeters
const resizeWidthMM = 26;  // Desired resize width in millimeters
const resizeHeightMM = 32; // Desired resize height in millimeters
const dpi = 600;


async function resizeAndCreateMosaic() {
    const finalWidthPX = Math.floor((finalWidthMM / 25.4) * dpi);
    const finalHeightPX = Math.floor((finalHeightMM / 25.4) * dpi);
    const resizeWidthPX = Math.floor((resizeWidthMM / 25.4) * dpi);
    const resizeHeightPX = Math.floor((resizeHeightMM / 25.4) * dpi);
    
    // Calculate the number of times to duplicate the resized image
    const numHorizontalDuplicates = Math.floor(finalWidthPX / resizeWidthPX);
    const numVerticalDuplicates = Math.floor(finalHeightPX / resizeHeightPX);

    try {
      const image = sharp(inputImagePath);
  
      // Resize the image to the specified dimensions
      const resizedImageBuffer = await image
        .resize(resizeWidthPX, resizeHeightPX,{
            fit: 'inside', // Keep the image inside the specified dimensions
            withoutEnlargement: true, // Don't enlarge the image if it's smaller
        })
        .toBuffer();

      // Create a blank canvas with the final dimensions
      const canvas = sharp({
        create: {
          width: finalWidthPX,
          height: finalHeightPX,
          channels: 3, // 3 channels for RGB
          background: { r: 255, g: 255, b: 255 }, // White background
        },
      });
  
      // Calculate the spacing between duplicated images
      const horizontalSpacing = Math.floor(finalWidthPX / numHorizontalDuplicates);
      const verticalSpacing = Math.floor(finalHeightPX / numVerticalDuplicates);
      const offsetX = 150;
      const offsetY = 75;
  
      // add resizedImageBuffer to canvas

      // Position and composite the resized image multiple times
      const outputImages = []
      for (let i = 0; i < numHorizontalDuplicates; i++) {
        for (let j = 0; j < numVerticalDuplicates; j++) {
            outputImages.push({
                input: resizedImageBuffer,
                left: i * horizontalSpacing + offsetX,
                top: j * verticalSpacing + offsetY,
            })
        }
      }

      // Save the final image
      await canvas.composite(outputImages).toFile(outputImagePath);
  
      console.log(`Image resized and mosaic created at ${outputImagePath}`);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  resizeAndCreateMosaic();