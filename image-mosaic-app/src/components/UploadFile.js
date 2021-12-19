import React, { useState, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import imageCheck from "../imageCheck";

// Was used to import the photo library, but unused now
// import { createClient } from "pexels";
// import { getPhotos } from "../pexels";

// const client = createClient(
//     "563492ad6f9170000100000107530903353e40b79a65a772a9ffb7db"
// );

function UploadFile() {
    const { currentUser } = useContext(AuthContext);
    const [uploadFile, setUploadFile] = useState();
    const [uploadResponse, setUploadResponse] = useState();
    const [imageTitle, setImageTitle] = useState("");
    const [errorImageTitle, setErrorImageTitle] = useState(false);
    const [errorFile, setErrorFile] = useState(false);
    const history = useHistory();

    //readFile and getAsByteArray functions were borrowed from https://dilshankelsen.com/convert-file-to-byte-array/
    function readFile(file) {
        return new Promise((resolve, reject) => {
            // Create file reader
            let reader = new FileReader();

            // Register event listeners
            reader.addEventListener("loadend", (e) => resolve(e.target.result));
            reader.addEventListener("error", reject);

            // Read file
            reader.readAsArrayBuffer(file);
        });
    }

    async function getAsByteArray(file) {
        return new Uint8Array(await readFile(file));
    }

    const submitForm = async (event) => {
        event.preventDefault();
        const dataArray = new FormData();

        if (imageTitle.trim() === "") {
            setErrorImageTitle(true);
            return;
        }
        setErrorImageTitle(false);

        // verify that the upoaded file is an image
        if (
            uploadFile === undefined ||
            uploadFile.length === 0 ||
            !imageCheck(uploadFile[0].type)
        ) {
            setErrorFile(true);
            return;
        }

        // turn uploaded image to byte array
        let fileByteArray;
        try {
            fileByteArray = await getAsByteArray(uploadFile[0]);
        } catch (e) {
            console.log("Error get byteArray");
            setErrorFile(true);
            return;
        }
        setErrorFile(false);

        window.alert(
            "Image submitted! Please check in a few minutes for the output."
        );

        dataArray.append("imageTitle", imageTitle);
        dataArray.append("uploadFile", fileByteArray);
        dataArray.append("xPixels", 20);
        dataArray.append("yPixels", 20);

        axios
            .post(
                `http://localhost:5000/mosaic/${currentUser.uid}`,
                dataArray,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            .then((response) => {
                setUploadResponse(`File uploaded successfully
        
        POST`);
                if (window.confirm("Mosaic finsihed! See the results?"))
                    history.push("/account");
            })
            .catch((error) => {
                setUploadResponse(`File uploaded FAILED

        POST`);
            });
    };

    return (
        <div className="App">
            <form onSubmit={submitForm}>
                <br />
                {errorImageTitle ? (
                    <p className="error">
                        Please enter a title for your image.
                    </p>
                ) : errorFile ? (
                    <p className="error">Please choose an image.</p>
                ) : null}
                <label htmlFor="image-title">Image Title:</label>
                <input
                    id="image-title"
                    type="text"
                    placeholder="Enter image title here"
                    onChange={(e) => setImageTitle(e.target.value)}
                />
                <input
                    type="file"
                    onChange={(e) => setUploadFile(e.target.files)}
                />
                <br />
                <br />
                <br />
                <input type="submit" />
            </form>
            <hr />
            <pre>{uploadResponse}</pre>
        </div>
    );
}

export default UploadFile;
