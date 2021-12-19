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
    CardContent,
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
            axios
                .get(`http://localhost:5000/image/${currentUser.uid}`, null, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((response) => {
                    const keys = Object.keys(response.data);
                    console.log(`Retrieved ${keys.length} image mosaics`);
                    let pics = [];
                    for (let key of keys) pics.push(response.data[key]);
                    if (pics.length !== 0) setUserPictures(pics);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        fetchImages();
    }, [currentUser.uid]);

    const buildCard = (pic) => {
        return (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={pic.id}>
                <CardActionArea
                    onClick={() => {
                        setModalOpen(true);
                        setModalImageSrc(pic.url);
                    }}
                >
                    <Card className={classes.card} variant="outlined">
                        <CardMedia
                            className={classes.media}
                            component="img"
                            src={pic.url}
                            title={pic.imageTitle}
                        />
                        <CardContent>{pic.imageTitle}</CardContent>
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
            <br />
            <ChangePassword />
            <SignOutButton />
        </div>
    );
}

export default Account;
