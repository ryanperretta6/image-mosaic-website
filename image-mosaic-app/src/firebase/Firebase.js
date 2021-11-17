import firebase from 'firebase/app';
import 'firebase/auth';

/*
const firebaseApp = firebase.initializeApp({
	apiKey: process.env.REACT_APP_FIREBASE_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
	databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
	appId: process.env.REACT_APP_FIREBASE_APP_ID,
});
*/

const firebaseApp = firebase.initializeApp({
	apiKey: 'AIzaSyDpZy1LSnbcSRpaQWH--GiavazomhAo4Zo',
	authDomain: 'cs554-final-project-ce10c.firebaseapp.com',
	projectId: 'cs554-final-project-ce10c',
	storageBucket: 'cs554-final-project-ce10c.appspot.com',
	messagingSenderId: '291750374850',
	appId: '1:291750374850:web:e779389baab2b3d6bf7a5b',
});

export default firebaseApp;
