import React, {useState, useEffect} from 'react';
import SignOutButton from './SignOut';
import '../App.css';
import ChangePassword from './ChangePassword';
import { makeStyles, Card, CardContent, CardMedia, Typography, CardHeader, Grid } from '@material-ui/core';

const useStyles = makeStyles({
	card: {
		maxWidth: 550,
		height: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto',
		borderRadius: 5,
		border: '1px solid #1e8678',
		boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
	},
	titleHead: {
		borderBottom: '1px solid #1e8678',
		fontWeight: 'bold'
	},
	grid: {
		flexGrow: 1,
		flexDirection: 'row'
	},
	media: {
		height: '100%',
		width: '100%'
	},
	button: {
		color: '#1e8678',
		fontWeight: 'bold',
		fontSize: 12
	}
});

function Account() {
	const [userPictures, setUserPictures] = useState(undefined);
	const classes = useStyles();
	const card = null;

	useEffect(
		() => {
			console.log("useEffect fired");
			setUserPictures();
		}, []
	)

	const buildCard = (pic) => {
		return (
			<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={pic.id}>
				<Card className={classes.card} variant='outlined'>
							<CardMedia
								className={classes.media}
								component='img'
								image={pic.image}
								title='Mosiac image'
							/>
				</Card>
			</Grid>
		);
	}

	card = userPictures && userPictures.map((pic)=>buildCard(pic));

	return (
		<div>
			<h1>Account Page</h1>
			<h1>Your Art</h1>
			
			<Grid container className={classes.grid} spacing={3}>
					{card}
				</Grid>

			<ChangePassword />
			<SignOutButton />
		</div>
	);
}

export default Account;
