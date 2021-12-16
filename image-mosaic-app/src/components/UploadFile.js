import React, { useState, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import { ClientContext } from "../redis/Client";

function UploadFile() {
    const { currentUser } = useContext(AuthContext);
    const [uploadFile, setUploadFile] = useState();
    const [uploadResponse, setUploadResponse] = useState();
    const history = useHistory();
	const { client } = useContext(ClientContext);

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
        let fileByteArray;
        try {
            fileByteArray = await getAsByteArray(uploadFile[0]);
        } catch (e) {
            console.log("Error get byteArray");
            return;
        }

        dataArray.append("uploadFile", fileByteArray);
        dataArray.append("xPixels", 10);
        dataArray.append("yPixels", 10);
        dataArray.append("folder_photos", "");

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
					let urls = [];
					try{
						if(await client.existsAsync(currentUser.uid)){
							urls = await client.getAsync(currentUser.uid);
						}
					}catch(e){
						console.log(`Error with cache: ${e}`);
					}
					urls.push(response.data);
					try{
						await client.setAsync(currentUser.uid);
					}catch(e){
						console.log(`Error setting the cache: ${e}`);
					}
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
                <input type="submit" />
            </form>
            <hr />
            <pre>{uploadResponse}</pre>
        </div>
    );
}

export default UploadFile;
