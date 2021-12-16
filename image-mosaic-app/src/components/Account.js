import React, { useState, useEffect, useContext } from "react";
import SignOutButton from "./SignOut";
import "../App.css";
import ChangePassword from "./ChangePassword";
import { MongoClient } from "mongodb";
import { AuthContext } from "../firebase/Auth";
import {
    makeStyles,
    Card,
    //CardContent,
    CardMedia,
    //Typography,
    //CardHeader,
    Grid,
    CardActionArea,
    Modal,
    Button,
} from "@material-ui/core";
import axios from "axios";

const useStyles = makeStyles({
    card: {
        maxWidth: 550,
        height: "auto",
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: 5,
        border: "1px solid #1e8678",
        boxShadow:
            "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
    },
    titleHead: {
        borderBottom: "1px solid #1e8678",
        fontWeight: "bold",
    },
    grid: {
        flexGrow: 1,
        flexDirection: "row",
    },
    media: {
        height: "100%",
        width: "100%",
    },
    button: {
        color: "#1e8678",
        fontWeight: "bold",
        fontSize: 12,
    },
});

function Account() {
    const [userPictures, setUserPictures] = useState(undefined);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalImageSrc, setModalImageSrc] = useState();
    const classes = useStyles();
    const { currentUser } = useContext(AuthContext);
    let card = null;

    useEffect(() => {
        console.log("useEffect fired");
        function fetchImages() {
            // const uri =
            //     "mongodb+srv://tmarin:Z5Aj3BlYsC680aw0@cluster0.hltjt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
            // const client = new MongoClient(uri, {
            //     useNewUrlParser: true,
            //     useUnifiedTopology: true,
            // });
            /* client.connect(err => {
				const db = client.db("CS554Final");
				const collection = db.collection("Pictures");
	
				let pics = collection.find({userID: currentUser.uid}).toArray();
	
				let arr = [];
	
				for(let pic of pics){
					//const mosiac = pic.mosiac-url (* Need to get mosiac from S3 bucket using url*);
					let mosaicObj = {
						id: pic._id,
						image: pic.url
					};
					arr.push(mosaicObj);
				}
				setUserPictures(arr);
				client.close();
			});*/
<<<<<<< HEAD
			try{
				await client.connect();
			}catch(e){
				console.log(`Could not connect to Mongo Database: ${e}`);
				return;
			}
			const db = client.db("CS554Final");
			const collection = db.collection("Pictures");

			let pics;
			try{
				pics = await collection.find({userID: currentUser.uid}).toArray();
			}catch(e){
				console.log("Could not access collection");
				return;
			}

			let arr = [];

			for(let pic of pics){
				//const mosiac = pic.mosiac-url (* Need to get mosiac from S3 bucket using url*);
				let mosaicObj = {
					id: pic._id,
					image: pic.url
				};
				arr.push(mosaicObj);
			}
			setUserPictures(arr);
			try{
				await client.close();
			}catch(e){
				console.log("Could not close client");
				return;
			}
		}
=======
            // try{
            // 	await client.connect();
            // }catch(e){
            // 	console.log("Could not connect to Mongo Database");
            // 	return;
            // }
            // const db = client.db("CS554Final");
            // const collection = db.collection("Pictures");
            // let pics;
            // try{
            // 	pics = await collection.find({userID: currentUser.uid}).toArray();
            // }catch(e){
            // 	console.log("Could not access collection");
            // 	return;
            // }
            // let arr = [];
            // for(let pic of pics){
            // 	//const mosiac = pic.mosiac-url (* Need to get mosiac from S3 bucket using url*);
            // 	let mosaicObj = {
            // 		id: pic._id,
            // 		image: pic.url
            // 	};
            // 	arr.push(mosaicObj);
            // }
            // setUserPictures(arr);
            // try{
            // 	await client.close();
            // }catch(e){
            // 	console.log("Could not close client");
            // 	return;
            // }
            axios
                .get(`http://localhost:5000/image/${currentUser.uid}`, null, {
                    // CHANGE ryanp TO currentUser.uid ^^^^^
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((response) => {
                    console.log(response);
                    console.log("WOO");
                    const keys = Object.keys(response.data);
                    let pics = [];
                    for (let key of keys) pics.push(response.data[key]);
                    setUserPictures(pics);
                })
                .catch((error) => {
                    console.log(error);
                    console.log("BOO");
                });
        }
>>>>>>> ryan
        fetchImages();
    }, [currentUser.uid]);

    const buildCard = (pic) => {
        return (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={pic.id}>
                <CardActionArea
                    onClick={() => {
                        setModalOpen(true);
                        setModalImageSrc(pic);
                    }}
                >
                    <Card className={classes.card} variant="outlined">
                        <CardMedia
                            className={classes.media}
                            component="img"
                            // image={pic.image}
                            src={pic} // CHANGE this when the real images are here
                            title="Mosiac image"
                        />
                    </Card>
                </CardActionArea>
            </Grid>
        );
    };

    card = userPictures && userPictures.map((pic) => buildCard(pic));

    return (
        <div id="accountContainer">
            <h1>{currentUser.displayName}'s Art</h1>
            {card ? (
                <Grid container className={classes.grid} spacing={3}>
                    {card}
                </Grid>
            ) : (
                <p id="noImages">No images uploaded.</p>
            )}
            <Modal
                className="imgModal"
                open={modalOpen}
                onClick={() => setModalOpen(false)}
            >
                <img src={modalImageSrc} />
            </Modal>
            <ChangePassword />
            <SignOutButton />
        </div>
    );
}

export default Account;
