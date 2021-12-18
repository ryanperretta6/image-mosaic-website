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
from flask_cors import CORS, cross_origin
import requests

ACCESS_KEY_ID = 'AKIATRUUVJ4RL6UU7DY5'
SECRET_ACCESS_KEY = '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'

application = Flask(__name__)
cors = CORS(application)
application.config['CORS_HEADERS'] = 'Content-Type'

# CHECK is a user collection necessary
@application.route('/user', methods=['POST'])
@cross_origin()
def createUser():
    EMAIL = request.form['email']
    client = MongoClient("mongodb+srv://tmarin:Z5Aj3BlYsC680aw0@cluster0.hltjt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", serverSelectionTimeoutMS=5000)
    db = client.CS554Final
    u = db.Users
    # checking if the user already exists in the DB
    if(u.find({"email": EMAIL}).count() != 0):
        print(f"user with id {EMAIL} already exists")
        return 'exists'
    print(f"adding new user {EMAIL}")
    result = u.insert_one({"email": EMAIL})
    print(f"{EMAIL}'s ID: {result.inserted_id}")
    return "<p>User DONE!</p>"

@application.route('/image/<userID>', methods=['GET'])
@cross_origin()
def getImage(userID):
    print(f"getting images for user: {userID}")
    # connect to the mongo db
    client = MongoClient("mongodb+srv://tmarin:Z5Aj3BlYsC680aw0@cluster0.hltjt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", serverSelectionTimeoutMS=5000)
    print(client.server_info().keys())
    db = client.CS554Final
    pictures = db.Pictures
    # query for mosaics belonging to this user
    results = pictures.find({"userID": userID}, {"_id": 0, "url": 1})
    # get the images from the s3 bucket
    s3 = boto3.client('s3', aws_access_key_id=ACCESS_KEY_ID, aws_secret_access_key=SECRET_ACCESS_KEY)
    # TEMPORARY v v
    s3urls = {}
    count = 0
    # ^^ TEMPORARY
    for obj in results:
        # TEMPORARY CODE FOR TESTING
        s3urls[count] = obj['url']
        count += 1
        # END TEMPORARY
        # get the s3 url from the result
        s3url = obj['url']
        print(f"NOTE: Getting image at URL {s3url} from s3.")
        # NEED TO GET THE IMAGE FROM THE S3 BUCKET

    return s3urls

@application.route('/mosaic/<userID>', methods=['POST'])
@cross_origin()
def mosaic(userID):
    imageID = uuid.uuid4()
    content = request.form
    xPixels = int(content['xPixels'])
    yPixels = int(content['yPixels'])
    tile_size = (xPixels, yPixels)
    # get image byte array and convert to a byte string
    imgByteArr = content['uploadFile'].split(',')
    for ind in range(len(imgByteArr)):
        imgByteArr[ind] = int(imgByteArr[ind])
    # from byte array to byte string
    binary_main_photo = bytes(imgByteArr)

    client = MongoClient("mongodb+srv://tmarin:Z5Aj3BlYsC680aw0@cluster0.hltjt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", serverSelectionTimeoutMS=5000)
    db = client.CS554Final
    m = db.Pictures
    lib = db.PhotoLib

    photo_lib = []
    photo_results = list(lib.find({}, {'_id':0}))

    for photo in photo_results:
        response = requests.get(photo['url'])
        # img = Image.frombytes('L', (photo['width'],photo['height']), response.content)
        img = Image.open(io.BytesIO(response.content))
        img = img.resize(tile_size)
        byteArray = io.BytesIO()
        img.save(byteArray, format='png')
        photo_lib.append(byteArray.getvalue())

    # pull out each tile image from the large folder array
    # photo_library = []
    # start = 0
    # stop = int(photo_buffer_sizes[0])
    # for i in range(len(photo_buffer_sizes)):
    #     # extract the piece of the list and convert strings to ints
    #     piece = list(map(lambda str: int(str),folder_photos[start:stop]))
    #     img = Image.frombytes('P',(xPixels,yPixels), bytes(piece))
    #     buf = io.BytesIO()
    #     img.save(buf, format='PNG')
    #     photo_library.append(buf.getvalue())
    #     if i < len(photo_buffer_sizes)-1:
    #         start += int(photo_buffer_sizes[i])
    #         stop += int(photo_buffer_sizes[i+1])
    

    # main_photo_path = content['main_photo_path']

    # main_photo = Image.new()
    # imgByteArr = io.BytesIO(imgByteArr)
    # main_photo.save(imgByteArr, format='png')
    # binary_main_photo = imgByteArr.getvalue()

    # main_photo = Image.open()
    # main_photo.save(imgByteArr, format='png')
    # binary_main_photo = imgByteArr.getvalue()

    # print('input Image byte array', binary_main_photo)

    # tiles, binary_folder_photos = [], []
    # for file in folder_photos:
    #     tiles.append(file)
    #     img = Image.open(file)
    #     img = img.resize(tile_size)
    #     imgByteArr = io.BytesIO()
    #     img.save(imgByteArr, format='png')
    #     binary_folder_photos.append(imgByteArr.getvalue())

    # print('type of binary folders', type(binary_folder_photos), type(binary_folder_photos[0]))

    mosaic = createMosaic(
        binary_main_photo=binary_main_photo,
        tile_size=tile_size,
        binary_folder_photos=photo_lib
    )

    filename = f'{strftime("%Y-%m-%d-%H-%M-%S", gmtime())}-{userID}-{imageID}'
    bucketURLBase = 'https://output-mosaics.s3.amazonaws.com/'

    s3 = boto3.client('s3', aws_access_key_id=ACCESS_KEY_ID, aws_secret_access_key=SECRET_ACCESS_KEY)
    s3.upload_fileobj(io.BytesIO(mosaic), "output-mosaics", filename, ExtraArgs={'ACL': 'public-read', 'ContentType': 'image/jpeg'})
    fileURL = bucketURLBase + filename

    # MongoDB is timing out
    
    result = m.insert_one({"url": fileURL, 'userID': userID})
    print('result', result)
    print(f"One mosaic: {result.inserted_id}")

    return "<p>Mosaic DONE!</p>"

@application.route("/upload_lib", methods=['POST'])
@cross_origin()
def upload_photos():
    photos = request.form['photo_lib'].split(',')

    client = MongoClient("mongodb+srv://tmarin:Z5Aj3BlYsC680aw0@cluster0.hltjt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", serverSelectionTimeoutMS=5000)
    db = client.CS554Final
    lib = db.PhotoLib

    photo_lib = []

    for photo in photos:
        split_str = photo.split(' ')
        url = split_str[0]
        width = int(split_str[1])
        height = int(split_str[2])
        photo_lib.append({
            'url': url,
            'width': width,
            'height': height
        })

    result = lib.insert_many(photo_lib)
    print(result)
    return 'SUCESS'

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