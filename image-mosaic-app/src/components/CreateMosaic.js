import React, { useContext } from "react";
import "../App.css";
import UploadFile from "./UploadFile";
import { AuthContext } from "../firebase/Auth";
import About from "./About";

function CreateMosaic() {
    const { currentUser } = useContext(AuthContext);
    return (
        <div>
            <h2>Welcome, to the Image Mosaic Creator!</h2>
            {currentUser === null ? <About /> : <UploadFile />}
        </div>
    );
}

export default CreateMosaic;
