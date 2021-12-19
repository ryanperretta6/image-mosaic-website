
from PIL import Image
from scipy import spatial
import numpy as np
import io
import os
import shutil

ACCESS_KEY_ID = 'AKIATRUUVJ4RL6UU7DY5'
SECRET_ACCESS_KEY = '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'

# Function for status update
def status(msg):  
    print(f'Loading: {msg}')

def initTiles(tiles_root):
    cleanupTiles(tiles_root)
    os.mkdir(tiles_root)

def cleanupTiles(tiles_root):
    if os.path.isdir(tiles_root):
        shutil.rmtree(tiles_root, ignore_errors=True)

def createMosaic(binary_main_photo, tile_size, binary_folder_photos):
    tiles = []
    for file in binary_folder_photos:
        img = Image.open(io.BytesIO(file))
        tiles.append(img)


    # Calculate dominant color
    colors = []
    status('calculating dominant color')
    for tile in tiles:
        mean_color = np.array(tile).mean(axis=0).mean(axis=0)
        colors.append(mean_color)

    # Pixelate (resize) main photo
    main_photo = Image.open(io.BytesIO(binary_main_photo))
    main_photo = main_photo.convert('RGB')

    width = int(np.round(main_photo.size[0] / tile_size[0]))
    height = int(np.round(main_photo.size[1] / tile_size[1]))

    print(tiles[0])
    print(main_photo)

    resized_photo = main_photo.resize((width, height))

    # Find closest tile photo for every pixel
    tree = spatial.KDTree(colors)
    closest_tiles = np.zeros((width, height), dtype=np.uint32)

    status('finding closest tile photo for every pixel')

    for i in range(width):
        for j in range(height):
            close = (resized_photo.getpixel((i, j)))
            closestList = list(resized_photo.getpixel((i, j)))
            if len(close) != 3:
                del closestList[3:]
            closest = tree.query(tuple(closestList))
            closest_tiles[i, j] = closest[1]

    # Create an output image
    output = Image.new('RGB', main_photo.size)

    status('instantiataed output mosaic')

    # Draw tiles
    for i in range(width):
        for j in range(height):
            # Offset of tile
            x, y = i*tile_size[0], j*tile_size[1]
            # Index of tile
            index = closest_tiles[i, j]
            # Draw tile
            output.paste(tiles[index], (x, y))

    imgByteArr = io.BytesIO()
    output.save(imgByteArr, format='png')
    imgByteArr = imgByteArr.getvalue()

    status('output mosaic was computed')

    return imgByteArr