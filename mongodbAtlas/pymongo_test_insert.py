from pymongo import MongoClient
client = MongoClient("mongodb://localhost:27017")
db = client.mosaics
mosaic1 = {
    "title" : "Moaning Lisa",
    "author" : "Da Van",
    "url" : "www.BingBongFuckYaLife.com"
}
mosaic = db.mosaic
print(mosaic)

result = mosaic.insert_one(mosaic1)
print(f"One mosaic: {result.inserted_id}")