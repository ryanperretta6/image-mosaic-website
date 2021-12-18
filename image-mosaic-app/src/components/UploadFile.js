import React, { useState, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
// import * as zip from "@zip.js/zip.js";
import zip from "jszip";
import { createClient } from "pexels";
import { getPhotos } from "../pexels";

const client = createClient(
    "563492ad6f9170000100000107530903353e40b79a65a772a9ffb7db"
);

function UploadFile() {
    const { currentUser } = useContext(AuthContext);
    const [uploadFile, setUploadFile] = useState();
    const [uploadResponse, setUploadResponse] = useState();
    const [photoLibrary, setPhotoLibrary] = useState();
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

        // turn uploaded image to byte array
        let fileByteArray;
        try {
            fileByteArray = await getAsByteArray(uploadFile[0]);
        } catch (e) {
            console.log("Error get byteArray");
            return;
        }

        // // turn photo library to all byte arrays and unzip
        // let photoLibraryZip = photoLibrary[0];
        // if (photoLibraryZip.type !== "application/x-zip-compressed") {
        //     console.log("Error file must be type zip");
        //     return;
        // }
        // // unzip
        // try {
        //     photoLibraryZip = await zip.loadAsync(photoLibraryZip);
        // } catch (e) {
        //     console.log("Could not unzip");
        //     return;
        // }
        // console.log(photoLibraryZip);
        // let photo_library = [];
        // let photo_buffer_size = [];
        // for (let photoName of Object.keys(photoLibraryZip.files)) {
        //     photo_library.push(
        //         photoLibraryZip.files[photoName]._data.compressedContent
        //     );
        //     photo_buffer_size.push(
        //         photoLibraryZip.files[photoName]._data.compressedSize
        //     );
        // }

        dataArray.append("uploadFile", fileByteArray);
        dataArray.append("xPixels", 10);
        dataArray.append("yPixels", 10);
        // dataArray.append("image_sizes", photo_buffer_size);

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
                history.push("/inprogress");
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
