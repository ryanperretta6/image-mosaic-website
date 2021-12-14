import glob
from PIL import Image
from scipy import spatial
import numpy as np
import io
import os
import shutil
import boto3
import urllib.request

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

def createMosaic(main_photo_path, tile_size):

    tiles_root = os.getcwd() + '/tiles'
    base = 'https://mosaic-tiles-cs554.s3.amazonaws.com/'


    def download_all_objects_in_folder():
        s3_resource = boto3.resource('s3', aws_access_key_id=ACCESS_KEY_ID, aws_secret_access_key=SECRET_ACCESS_KEY)
        my_bucket = s3_resource.Bucket('mosaic-tiles-cs554')
        objects = my_bucket.objects.filter(Prefix='lsd-minner/')
        
        i = 0
        print('tiles_root: ', tiles_root)
        for obj in objects:
            if i != 0:
                urllib.request.urlretrieve(base + obj.key, f"{tiles_root}/{i}.png")
            i += 1

    download_all_objects_in_folder()

    # Get all tiles
    tile_paths = []
    status('getting all tiles')
    for file in glob.glob(tiles_root + '/*'):
        tile_paths.append(file)

    print('tile_paths', tile_paths)

    # Import and resize all tiles
    tiles = []
    status('resizing all tiles')
    for path in tile_paths:
        tile = Image.open(path)
        tile = tile.resize(tile_size)
        tiles.append(tile)

    # Calculate dominant color
    colors = []
    status('calculating dominant color')
    for tile in tiles:
        mean_color = np.array(tile).mean(axis=0).mean(axis=0)
        colors.append(mean_color)

    # Pixelate (resize) main photo
    main_photo = Image.open(main_photo_path)

    width = int(np.round(main_photo.size[0] / tile_size[0]))
    height = int(np.round(main_photo.size[1] / tile_size[1]))

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
    print(imgByteArr)
    output.save(imgByteArr, format='png')
    imgByteArr = imgByteArr.getvalue()


    return imgByteArr