import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

function UploadFile() {
    const [uploadFile, setUploadFile] = useState();
    const [uploadResponse, setUploadResponse] = useState();
    const history = useHistory();

    // https://stackoverflow.com/questions/9258932/how-to-convert-image-to-byte-array-using-javascript-only-to-store-image-on-sql-s
    // function getBase64Image() {
    //     p = document.getElementById("fileUpload").value;
    //     img1.setAttribute("src", p);
    //     canvas.width = img1.width;
    //     canvas.height = img1.height;
    //     var ctx = canvas.getContext("2d");
    //     ctx.drawImage(img1, 0, 0);
    //     var dataURL = canvas.toDataURL("image/png");
    //     alert("from getbase64 function" + dataURL);
    //     return dataURL;
    // }

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
                <input type="submit" />
            </form>
            <hr />
            <pre>{uploadResponse}</pre>
        </div>
    );
}

export default UploadFile;
