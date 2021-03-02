import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import { Pressable } from 'react-native';
import { Auth } from 'aws-amplify';
import Webcam from "react-webcam"; // Install with npm install react-webcam
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Home from './Home';
import EXIF from 'exif-js'
import { withAuthenticator } from 'aws-amplify-react-native';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  captureButton: {
    margin: 'auto',
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  video: {
    width: '100%',
    height: '50%',
    facingMode: "user"
  },
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

// Capture App
function Capture({ navigation }) { // Add navigation to the additional pages if requiring access between them
  // Sets the style
  const classes = useStyles();

  // Sets the web cam, location, image source and comment
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);
  const [imgComment, setImgComment] = React.useState("");
  const [latitude, setLatitude] = React.useState("");
  const [longitude, setLongitude] = React.useState("");

  // Captures the picture and provides a base64 string of it
  const capture = React.useCallback(
    () => {
      getUser();
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
      fetch(imageSrc).then(res => res.blob())
        .then(blob => {
          const file2 = new File([blob], "test.jpg", { type: "image/jpg" });
          console.log(file2);
          EXIF.getData(file2, function() {
            var exifData = EXIF.pretty(this);
            let exifLong = EXIF.getTag(this, "GPSLongitude");
            let exifLat = EXIF.getTag(this, "GPSLatitude");
            var exifLat_final;
            if (exifLat) {
              var exifLatNum1 =  exifLat[0].numerator / exifLat[0].denominator;
              var exifLatNum2 = exifLat[1].numerator / exifLat[1].denominator;
              var exifLatNum3 = exifLat[2].numerator / exifLat[2].denominator;
              exifLat_final = exifLatNum1 + exifLatNum2/60 + exifLatNum3/3600;
              exifLat_final = exifLat_final.toString();
              setLatitude(exifLat_final);
            }
            var exifLong_final;
            if (exifLong) {
              var exifLongNum1 =  exifLong[0].numerator / exifLong[0].denominator;
              var exifLongNum2 = exifLong[1].numerator / exifLong[1].denominator;
              var exifLongNum3 = exifLong[2].numerator / exifLong[2].denominator;
              exifLong_final = exifLongNum1 + exifLongNum2/60 + exifLongNum3/3600;
              exifLong_final = exifLong_final.toString();
              setLongitude(exifLong_final);
            }
            if (exifLong && exifLat) {
              geocodeLatLng(exifLat_final, exifLong_final);
            }
            console.log(latitude, longitude);
            setLatLongByCurrentPosition(exifLat, exifLong);
          });
        });
    },
    [webcamRef, setImgSrc]
  );



  // Sets the latitude and the longtitude
  function setLatLongByCurrentPosition(lat, long){
    if (lat || long){
      return;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getPosition);
    }
    function getPosition(position) {
      console.log(position.coords.latitude, position.coords.longitude);
      var lat_var = position.coords.latitude + "";
      var long_var = position.coords.longitude + "";
      setLongitude(long_var)
      setLatitude(lat_var)
      geocodeLatLng(lat_var, long_var);
      alert("Your photo has been captured");
    }
  }

  const [city, setCity] = React.useState("");
  const [suburb, setSuburb] = React.useState("");
  const [country, setCountry] = React.useState("");

  // Gets a location based on the lat and long
  function geocodeLatLng(lat, long) {
    var API_KEY = "HedZ30NsSEanvewLY-XkRQ43WOCSSBXqdhr1yvsuPz0"; // To register a new API key go to developer.here.com and register a javascript api key
    return new Promise((resolve) => {
      const url = `https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?apiKey=${API_KEY}&mode=retrieveAddresses&prox=${lat},${long}`
      fetch(url)
        .then(res => res.json())
        .then((resJson) => {
          // Getting the address of the location
          if (resJson
            && resJson.Response
            && resJson.Response.View
            && resJson.Response.View[0]
            && resJson.Response.View[0].Result
            && resJson.Response.View[0].Result[0]) {
            var address = resJson.Response.View[0].Result[0].Location.Address;
            setCity(address.City);
            setCountry(address.Country);
            setSuburb(address.District);
            console.log(resJson.Response.View[0].Result[0].Location.Address)
            resolve(resJson.Response.View[0].Result[0].Location.Address.Label)
          } else {
            resolve()
          }
        })
        .catch((e) => {
          console.log('Error in getting the address from the coordinates', e)
          resolve()
        })
    })
  }


  const [errorMsg, setErrorMsg] = React.useState(null);

  // Signs out the used
  const signOut = async () => {
    try {
      await Auth.signOut({ global: true });
    } catch (error) {
      console.log('error signing out: ', error);
    }
  };

  // Gets the user info of the current user
  const [email, setEmail] = React.useState("")
  const getUser = async () => {
    try {
      let userInfo = await Auth.currentUserInfo()
      setEmail(userInfo.attributes.email);
    } catch (error) {
      console.log('error getting user data: ', error);
    }
  };

  // Post for sending data to s3 and dynamo db
  const axios = require("axios");
  const apiMethod = () => {
    var imgSrc_API = imgSrc;
    var imgComment_API = imgComment;
    let date = new Date();
    console.log(imgSrc);
    console.log(imgComment);
    console.log(latitude);
    console.log(longitude);
    console.log(email)
    console.log(country);
    console.log(city);
    console.log(suburb);
    axios.post("https://7juxc9c5n7.execute-api.ap-southeast-2.amazonaws.com/dev", {
    comment: imgComment_API,
    image: imgSrc_API,
    latitude: latitude,
    longitude: longitude,
    timestamp: date.toISOString(),
    email: email,
    city: city,
    country: country,
    suburb: suburb
    })
  .then(response => {
    alert("Your image has been uploaded!");
    console.log(response);
   })
  .catch(error => {
    console.log(error);
  })
};

  // Updates the comment variable
  const commentHandler = (event) => {
    setImgComment(event.target.value);
  }

  // Renders the app
  return (
    <React.Fragment>
      <CssBaseline />
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <CameraIcon className={classes.icon} />
          <Typography variant="h6" className={classes.title}>
            Citizen Watch
          </Typography>
          <Button color="inherit" onClick={() => signOut()}>Sign Out</Button>
        </Toolbar>
      </AppBar>
      <main>
        {/* Setting up the camera and comment box to upload */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
          <Card className={classes.card}>
          <Paper className={classes.paper} elevation={5} variant="outlined">
            <Webcam
              className={classes.video}
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
            />
          </Paper>
          <CardContent className={classes.cardContent}>
            <TextField fullWidth margin="normal" variant="filled" InputLabelProps={{ shrink:true,}}
             placeholder="Put your comment here" onChange={commentHandler}/>
          </CardContent>
          <CardActions>
          <div className={classes.heroButtons}>
            <Grid container spacing={2} justify="center">
              <Grid item>
                <Button variant="contained" color="primary" onClick={() => capture()}>
                  Capture Photo
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" color="primary" onClick={() => apiMethod()}
                disabled={!imgSrc}>
                  Upload
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" href='/Home'>
                  Home
                </Button>
              </Grid>
            </Grid>
          </div>
          </CardActions>
          </Card>
          </Container>
        </div>
      </main>
    </React.Fragment>
  );
}

export default withAuthenticator(Capture);
