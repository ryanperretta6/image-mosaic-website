import React, { useState } from 'react';
import axios from 'axios';

function UploadFile() {
	const [uploadFile, setUploadFile] = useState();
	const [superHero, setSuperHero] = useState();
	const [uploadResponse, setUploadResponse] = useState();

	const submitForm = (event) => {
		event.preventDefault();

		const dataArray = new FormData();
		dataArray.append('superHeroName', superHero);
		dataArray.append('uploadFile', uploadFile);

		axios
			.post('/', dataArray, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			.then((response) => {
				setUploadResponse(`File uploaded successfully
        
        POST - superHeroName
        value - ${superHero}`);
			})
			.catch((error) => {
				setUploadResponse(`File uploaded FAILED

        POST - superHeroName
        value - ${superHero}`);
			});
	};

	return (
		<div className="App">
			<form onSubmit={submitForm}>
				<input
					type="text"
					onChange={(e) => setSuperHero(e.target.value)}
					placeholder={'Superhero Name'}
				/>
				<br />
				<input type="file" onChange={(e) => setUploadFile(e.target.files)} />
				<br />
				<input type="submit" />
			</form>
			<hr />
			<pre>{uploadResponse}</pre>
		</div>
	);
}

export default UploadFile;
