import React, { useState } from "react";
import axios from "axios";
import useHistory from "react-router-dom";

function UploadFile() {
    const [uploadFile, setUploadFile] = useState();
    const [uploadResponse, setUploadResponse] = useState();
    const history = useHistory;

    const submitForm = (event) => {
        event.preventDefault();

        const dataArray = new FormData();
        dataArray.append("uploadFile", uploadFile);

        // check if uploaded file is an image file
        if (
            uploadFile === undefined ||
            !uploadFile[0].type.startsWith("image")
        ) {
            setUploadResponse(`Please submit an image file.`);
            return;
        }

        axios
            .post("/", dataArray, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                setUploadResponse(`File uploaded successfully
        
        POST`);
            })
            .catch((error) => {
                setUploadResponse(`File uploaded FAILED

        POST`);
            });
        history.push("/inprogress");
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
