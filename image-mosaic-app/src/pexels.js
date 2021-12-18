import axios from "axios";

const API_KEY = "563492ad6f9170000100000107530903353e40b79a65a772a9ffb7db";

export const getPhotos = async (color) => {
    const colors = [
        "red",
        "orange",
        "yellow",
        "green",
        "turquoise",
        "black",
        "violet",
        "pink",
        "brown",
        "black",
        "gray",
        "white",
    ];
    let photoLib = [];
    for (let color of colors) {
        const res = await fetch(
            `https://api.pexels.com/v1/search?query=${color}`,
            {
                headers: {
                    Authorization: API_KEY,
                },
            }
        );
        const responseJson = await res.json();
        for (let photo of responseJson.photos) {
            photoLib.push(`${photo.src.small} ${photo.width} ${photo.height}`);
        }
    }

    const formData = new FormData();
    formData.append("photo_lib", photoLib);

    axios
        .post(`http://localhost:5000/upload_lib`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((response) => {
            console.log(`File uploaded successfully GET`);
        })
        .catch((error) => {
            console.log(`File uploaded FAILED GET`);
        });
    return photoLib;
};
