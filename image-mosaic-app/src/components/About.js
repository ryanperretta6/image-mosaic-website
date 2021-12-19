import React from "react";

import "../App.css";

function About() {
    return (
        <div>
            <p id="about">
                Welcome to our Mosaic Photo app! For our final project in our
                Web Development class, we were required to make a website
                utilizing the different technologies we learned throught the
                semester. We decided to make an application that utilizes an
                OpenCV python library which uses sample images to create a
                mosaic of another larger image. On our Create Mosaic page, you
                can submit an image file to our server, that will then grab it
                and run it thorugh the python script using an AWS function we
                created. Once you upload the image, it will take sometime for
                our server to porcess it and get the final results back to you,
                so sit back and wait for a notification from our site! Once it
                is done, your new mosaic can be found in your account page.
            </p>
        </div>
    );
}

export default About;
