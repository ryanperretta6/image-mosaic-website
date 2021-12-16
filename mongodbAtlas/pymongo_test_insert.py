from pymongo import MongoClient
client = MongoClient("mongodb+srv://tmarin:Z5Aj3BlYsC680aw0@cluster0.hltjt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
db = client.CS554Final
collection = db.Pictures

mosaic1 = {
    "title" : "Moaning Lisa",
    "author" : "Da Van",
    "url" : "www.BingBongFuckYaLife.com"
}

result = collection.insert_one(mosaic1)
print(f"One mosaic: {result.inserted_id}")