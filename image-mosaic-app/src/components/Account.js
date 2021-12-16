import React, { useState, useEffect } from "react";
import SignOutButton from "./SignOut";
import "../App.css";
import ChangePassword from "./ChangePassword";
import {MongoClient} from "mongodb";
import {
    makeStyles,
    Card,
    //CardContent,
    CardMedia,
    //Typography,
    //CardHeader,
    Grid,
} from "@material-ui/core";

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
    const classes = useStyles();
    let card = null;

    useEffect(() => {
        console.log("useEffect fired");
		async function fetchImages(){
			const uri = "mongodb+srv://tmarin:Z5Aj3BlYsC680aw0@cluster0.hltjt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", serverSelectionTimeoutMS=5000;
			const client = new MongoClient(uri);
			try{
				await client.connect();
			}catch(e){
				console.log("Could not connect to Mongo Database");
				return;
			}
			const db = client.db("CS554Final");
			const collection = db.collection("Pictures");

			const pics = await collection.find({userID: ""}).toArray();

		}
        fetchImages();

    }, []);

    const buildCard = (pic) => {
        return (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={pic.id}>
                <Card className={classes.card} variant="outlined">
                    <CardMedia
                        className={classes.media}
                        component="img"
                        image={pic.image}
                        title="Mosiac image"
                    />
                </Card>
            </Grid>
        );
    };

    card = userPictures && userPictures.map((pic) => buildCard(pic));

    return (
        <div id="accountContainer">
            <h1>Account Page</h1>
            <h1>Your Art</h1>
            {card ? (
                <Grid container className={classes.grid} spacing={3}>
                    {card}
                </Grid>
            ) : (
                <p id="noImages">No images uploaded.</p>
            )}

            <ChangePassword />
            <SignOutButton />
        </div>
    );
}

export default Account;
