from flask import Flask, request
from mosaic import createMosaic
import io
import PIL.Image as Image
import logging
import boto3
from botocore.exceptions import ClientError
import os
from pymongo import MongoClient
from time import gmtime, strftime
import glob
import uuid

ACCESS_KEY_ID = 'AKIATRUUVJ4RL6UU7DY5'
SECRET_ACCESS_KEY = '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'

application = Flask(__name__)

@application.route('/')
def hello_world():
    return "<p>Hello, World!</p>"

@application.route('/user/<username>', methods=['POST'])
def createUser(username):
    print(username)
    # db = client.test
    # client = MongoClient("mongodb://localhost:27017")
    # print("client", client)
    client = MongoClient("mongodb+srv://lmcevoy:soH2UO3mLsaPH3wV@cluster0.qrgw0.mongodb.net/Cluster0?retryWrites=true&w=majority")
    db = client.mosaics
    u = db.user
    result = u.insert_one({"username": username})
    print(f"{username}'s ID: {result.inserted_id}")
    return "<p>User DONE!</p>"

@application.route('/mosaic/<userID>', methods=['POST'])
def mosaic(userID):
    print(request.form.keys())
    imageID = uuid.uuid4()
    content = request.form
    xPixels = int(content['xPixels'])
    yPixels = int(content['yPixels'])
    folder_photos = content['folder_photos']
    tile_size = (xPixels, yPixels)
    imgByteArr = content['uploadFile'].split(',')
    print(imgByteArr[:10])
    for ind in range(len(imgByteArr)):
        imgByteArr[ind] = int(imgByteArr[ind])
    binary_main_photo = bytes(imgByteArr)


    # main_photo_path = content['main_photo_path']

    # main_photo = Image.new()
    # imgByteArr = io.BytesIO(imgByteArr)
    # main_photo.save(imgByteArr, format='png')
    # binary_main_photo = imgByteArr.getvalue()

    # main_photo = Image.open()
    # main_photo.save(imgByteArr, format='png')
    # binary_main_photo = imgByteArr.getvalue()

    # print('input Image byte array', binary_main_photo)

    tiles, binary_folder_photos = [], []
    for file in glob.glob(folder_photos):
        tiles.append(file)
        img = Image.open(file)
        img = img.resize(tile_size)
        imgByteArr = io.BytesIO()
        img.save(imgByteArr, format='png')
        binary_folder_photos.append(imgByteArr.getvalue())

    # print('type of binary folders', type(binary_folder_photos), type(binary_folder_photos[0]))

    mosaic = createMosaic(
        binary_main_photo=binary_main_photo,
        tile_size=tile_size,
        binary_folder_photos=binary_folder_photos
    )

    filename = f'{strftime("%Y-%m-%d-%H-%M-%S", gmtime())}-{userID}-{imageID}'
    bucketURLBase = 'https://output-mosaics.s3.amazonaws.com/'

    s3 = boto3.client('s3', aws_access_key_id=ACCESS_KEY_ID, aws_secret_access_key=SECRET_ACCESS_KEY)
    s3.upload_fileobj(io.BytesIO(mosaic), "output-mosaics", filename, ExtraArgs={'ACL': 'public-read', 'ContentType': 'image/jpeg'})
    fileURL = bucketURLBase + filename

    client = MongoClient("mongodb+srv://lmcevoy:soH2UO3mLsaPH3wV@cluster0.qrgw0.mongodb.net/Cluster0?retryWrites=true&w=majority", serverSelectionTimeoutMS=5000)
    db = client.mosaics
    m = db.mosaic

    print(fileURL)

    # MongoDB is timing out
    
    # result = m.insert_one({"mosaic-url": fileURL, 'userID': userID})
    # print('result', result)
    # print(f"One mosaic: {result.inserted_id}")

    return "<p>Mosaic DONE!</p>"


def upload_file(file_name, bucket, object_name=None):
    """Upload a file to an S3 bucket

    :param file_name: File to upload
    :param bucket: Bucket to upload to
    :param object_name: S3 object name. If not specified then file_name is used
    :return: True if file was uploaded, else False
    """

    # If S3 object_name was not specified, use file_name
    if object_name is None:
        object_name = os.path.basename(file_name)

    # Upload the file
    s3_client = boto3.client('s3')
    try:
        response = s3_client.upload_file(file_name, bucket, object_name)
    except ClientError as e:
        logging.error(e)
        return False
    return True



if __name__ == '__main__':
   application.run(debug = True)