from pymongo import MongoClient
client = MongoClient("mongodb+srv://tmarin:Z5Aj3BlYsC680aw0@cluster0.hltjt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
db = client.CS554Final
collection = db.Pictures

testData = [
    {
        "userID": "ryanp",
        "url" : "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallsdesk.com%2Fwp-content%2Fuploads%2F2018%2F03%2FPictures-of-Elk.jpg&f=1&nofb=1"
    },
    {
        "userID": "ryanp",
        "url" : "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.shutterstock.com%2Fblog%2Fwp-content%2Fuploads%2Fsites%2F5%2F2016%2F03%2Ffall-trees-road-1.jpg&f=1&nofb=1"
    },
    {
        "userID": "ryanp",
        "url" : "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Feskipaper.com%2Fimages%2Fimages-2.jpg&f=1&nofb=1"
    },
    {
        "userID": "RoF9OA5BvAcJXpm9twQinZh0Zsj1",
        "url" : "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fjooinn.com%2Fimages%2Fbeauty-of-nature-24.jpg&f=1&nofb=1"
    },
    {
        "userID": "RoF9OA5BvAcJXpm9twQinZh0Zsj1",
        "url" : "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fiso.500px.com%2Fwp-content%2Fuploads%2F2014%2F08%2F500-px-banner-1500x1000.jpg&f=1&nofb=1"
    },
    {
        "userID": "RoF9OA5BvAcJXpm9twQinZh0Zsj1",
        "url" : "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fhddesktopwallpapers.in%2Fwp-content%2Fuploads%2F2015%2F09%2Fwave-images.jpg&f=1&nofb=1"
    }
]

result = collection.insert_many(testData)
print(f"mosaics: {result.inserted_ids}")