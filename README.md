# image-mosaic-website
Final project for CS-554 Fall 2021

How to run the App:

We have two parts that need to be started for our application:

1. Mosaic Server:
  Before you can run the server you need to install a few python packages for it to work
    Packages:
     -  Flask
     -  boto3
     -  botocore
     -  pymongo
     -  uuid
     -  flask_cors
     -  PIL
     -  scipy
     -  numpy
     -  shutil
     -  io
     -  os
     -  logging

  Clone the repository, and run the following command:
  
    cd image-mosaic-website/flask-server/ && python3 server.py
  
  NOTE: Flask server MUST run on port 5000 as a heads up

2. React

  That is pretty simple, from the react folder just run ```npm i``` and then ```npm start```
  Once server is ready, you need to sign-up/sign-in to submit an image and create a mosaic.
  
  ENJOY!
