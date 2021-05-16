// React Native Modules
import React from 'react';
import { Pressable } from 'react-native';
import Webcam from "react-webcam"; // Install with npm install react-webcam
import EXIF from 'exif-js'

// Material UI
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// Amplify
import { Auth } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react-native';

// User files
import Home from './Home';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import './Home.css';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },

  navBar: {
		backgroundColor: '#3C3C3C',
		flexGrow: 1,
		justifyContent: 'space-around',
	},

  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },

  heroButtons: {
    marginTop: theme.spacing(4),
  },

  button: {
    backgroundColor: 'black',
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
		backgroundColor: '#3C3C3C',
		color: theme.palette.background.paper,
		padding: theme.spacing(6)
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

// Council logo
const Logo = () => {
	return (
		<svg width="12rem" viewBox="0 0 5821 1024" fill="#FFFFFF">      		
			<path d="M374.354 785.229c206.786 0 374.381-167.608 374.381-374.381 0-206.76-167.621-374.354-374.381-374.354s-374.354 167.608-374.354 374.354c-0.013 206.773 167.595 374.381 374.354 374.381v0zM186.529 203.798h73.001v38.411c38.768-26.908 77.219-41.016 115.392-42.206 29.023 0 57.015 7.259 83.883 21.804 26.934 14.558 48.593 34.339 64.949 59.263 16.343 25.004 24.554 51.964 24.554 80.961 0 31.509-7.881 59.937-23.602 85.298-15.722 25.414-36.904 45.406-63.56 60.123-26.67 14.677-55.799 22.888-87.44 24.594v1.362c7.986 3.411 24.012 11.213 48.143 23.377s44.679 21.248 61.643 27.265 34.008 9.018 51.158 9.018c12.575 0 21.843-1.864 27.794-5.553l4.998 5.553c-10.975 10.102-25.85 15.126-44.573 15.126-15.312 0-30.914-1.904-46.821-5.593-15.96-3.729-29.896-7.881-41.783-12.403-11.953-4.522-30.861-11.953-56.738-22.359-47.826-22.425-87.162-43.185-117.971-62.212v55.442c0 8.727 0.965 15.007 2.949 18.802 1.957 3.768 5.263 6.334 9.996 7.643 6.862 0.82 13.87 1.811 21.143 3.001 4.496-0.82 10.419-1.216 17.745-1.216v11.332h-119.848v-11.305h33.202v-347.711c0-17.665-10.895-26.498-32.686-26.498h-5.553l0.026-11.318zM361.978 218.131c-41.082 0-75.223 16.039-102.448 48.090v216.729l6.175-9.917c41.995 30.346 79.229 45.525 111.796 45.525 24.409 0 47.165-6.558 68.387-19.675 21.182-13.117 38.015-30.782 50.457-52.916 12.429-22.134 18.683-45.922 18.683-71.388-0.727-27.238-7.986-52.705-21.91-76.465-13.963-23.734-32.435-42.761-55.521-57.095s-48.315-21.976-75.619-22.888v0 0z"></path>
			<path d="M1585.558 105.304v-58.827h16.66v260.601h-16.66c0-47.535-2.34-83.262-6.942-107.181-4.641-23.946-15.034-44.070-31.179-60.413-16.317-16.515-39.905-29.777-70.714-39.813-30.808-10.049-61.709-15.074-92.689-15.074-59.924 0-113.052 15.166-159.344 45.498-46.305 30.319-81.86 69.735-106.692 118.248-24.832 48.54-37.234 98.481-37.234 149.863 0 42.484 7.695 84.029 23.1 124.741s37.327 77.298 65.808 109.813c28.428 32.527 62.013 58.126 100.755 76.849 38.715 18.71 80.049 28.058 123.987 28.058 45.789 0 87.255-8.793 124.357-26.392 37.142-17.586 69.087-39.786 95.836-66.535l17.678 22.677c-33.334 30.24-71.771 53.71-115.287 70.436-43.515 16.713-87.85 25.572-132.965 26.59-64.301 0-123.947-15.735-178.913-47.217s-98.573-73.914-130.81-127.279c-32.236-53.353-48.355-111.016-48.355-172.989 0-50.668 10.393-98.097 31.165-142.3 20.786-44.189 49.174-82.389 85.126-114.652 35.939-32.236 76.677-57.147 122.215-74.733 45.525-17.586 92.28-26.392 140.264-26.392 65.173-0.040 125.441 15.457 180.83 46.424z"></path>
			<path d="M1710.814 725.014v-352.365l-36.362 42.153-12.389-12.376 109.601-129.448 12.389 12.575-26.762 29.856v367.188c0 14.32 2.367 24.647 7.061 31.073 4.707 6.386 13.394 10.856 26.022 13.381 3.359-1.349 7.841-1.997 13.394-1.997v18.683h-139.656v-18.683l46.715-0.040zM1731.269 95.202c10.446 0 20.111 4.073 29.037 12.178 8.925 8.092 13.394 17.546 13.394 28.375 0 12.337-4.244 22.452-12.76 30.398-8.515 7.96-18.406 11.9-29.671 11.9-12.945 0-23.232-3.808-30.795-11.398-7.576-7.603-11.371-17.903-11.371-30.901 0-10.975 4.125-20.482 12.403-28.494 8.211-8.039 18.154-12.059 29.764-12.059z"></path>
			<path d="M1891.631 590.568v-260.76h-52.784v-22.729h52.784v-169.446l45.459-52.771v222.23h89.119v22.729h-89.119v250.407c0 27.278 1.375 51.263 4.152 71.904 2.777 20.653 10.195 38.993 22.24 55.085 12.019 16.092 30.517 24.131 55.402 24.131 39.562 0 72.314-20.045 98.243-60.109l14.412 6.281c0 14.148-5.434 27.463-16.29 39.945-10.856 12.456-24.29 22.346-40.276 29.684-15.999 7.325-30.901 10.988-44.705 10.988-40.924 0-75.104-14.822-102.527-44.467-13.13-14.148-22.425-30.742-27.899-49.783-5.474-19.067-8.211-43.502-8.211-73.319z"></path>
			<path d="M2310.439 690.926l-106.613-305.055c-11.966-37.182-35.383-55.812-70.251-55.812h-8.33v-18.683h151.106v18.683h-44.454l105.595 298.748c35.714-85.364 59.792-160.098 72.287-224.253 2.856-12.958 4.271-24.409 4.271-34.352 0-17.996-3.491-28.931-10.485-32.712-6.968-3.795-21.103-6.281-42.312-7.431v-18.683h156.17v18.683h-44.467l-90.971 237.859c-8.753 24.435-18.062 50.404-27.913 77.933-9.838 27.516-20.667 56.010-32.474 85.483-11.794 29.473-23.523 56.354-35.225 80.697-11.728 24.329-24.409 47.429-38.041 69.299-28.455 44.798-53.855 78.436-76.188 100.887-22.32 22.478-49.307 36.428-80.988 41.796v-68.162h11.371c2.869 1.679 5.937 3.491 9.216 5.408 3.279 1.93 6.426 3.583 9.481 4.932 10.763 0 30.398-14.822 58.866-44.427 56.909-66.694 100.358-143.636 130.347-230.838z"></path>
			<path d="M2729.565 537.89c0.502-30.465 7.444-60.096 20.852-88.895 13.394-28.799 31.787-54.543 55.204-77.285 23.417-22.729 50.364-40.514 80.842-53.406 30.504-12.892 62.331-19.331 95.519-19.331 37.393 0 72.459 9.983 105.238 29.949 32.778 19.953 58.787 46.556 78.065 79.798 19.292 33.254 28.931 68.717 28.931 106.441-0.688 42.431-12.892 82.072-36.626 118.936-23.734 36.877-54.886 66.443-93.43 88.776-38.557 22.306-78.7 34.021-120.443 35.225-38.927 0-74.879-10.195-107.816-30.57-32.964-20.363-58.919-47.429-77.88-81.186-18.974-33.744-28.455-69.894-28.455-108.451zM2767.95 521.216c0 36.19 9.467 70.039 28.389 101.522 18.948 31.483 44.295 56.407 76.016 74.747s65.53 27.529 101.39 27.529c34.167 0 65.2-8.938 93.046-26.762 27.86-17.837 49.664-41.624 65.411-71.348 15.708-29.711 23.602-61.484 23.602-95.347 0-32.302-8.714-63.931-26.154-94.818-17.401-30.901-41.043-56.050-70.819-75.513-29.79-19.45-61.617-29.169-95.466-29.169-34.497 0-66.8 8.436-96.828 25.255-30.041 16.832-54.001 39.733-71.864 68.691-17.797 28.97-26.723 60.718-26.723 95.215z"></path>
			<path d="M3290.422 329.808h-42.166v-22.729h42.166v-74.231c0-37.049 1.904-67.474 5.686-91.275 3.782-23.827 13.328-45.855 28.627-66.046 13.474-18.67 33.598-34.55 60.413-47.614 26.802-13.037 53.168-19.556 79.057-19.556 23.708 0 43.304 3.464 58.774 10.353v-14.664h17.678v169.697h-17.678v-110.606c-18.181-18.181-44.361-28.534-78.528-31.060-40.91 0-69.074 17.348-84.478 52.030s-23.1 74.231-23.1 118.698v104.299h101.258v22.729h-101.258v348.716c0 12.826 0.582 21.063 1.772 24.766 1.177 3.702 4.046 7.841 8.568 12.403 5.567 6.228 22.386 9.348 50.51 9.348v18.683h-153.79v-18.683h46.477v-395.259h0.013z"></path>
			<path d="M3769.22 78.555h120.946v63.375c64.988-44.917 129.461-68.426 193.458-70.449 48.474 0 95.175 12.218 140.158 36.639 44.943 24.409 81.093 57.571 108.451 99.486 27.344 41.942 41.043 87.229 41.043 135.861 0 52.863-13.13 100.596-39.39 143.199s-61.656 76.227-106.176 100.887c-44.533 24.66-93.232 38.424-146.095 41.294v2.274c13.302 5.739 40.104 18.802 80.432 39.257 40.315 20.455 74.654 35.714 103.029 45.829 28.375 10.102 56.857 15.153 85.483 15.153 21.050 0 36.534-3.107 46.477-9.348l8.343 9.348c-18.366 16.488-43.198 24.739-74.509 24.739-25.599 0-51.673-3.107-78.29-9.335-26.604-6.228-49.862-13.090-69.801-20.587-19.966-7.497-51.554-19.9-94.845-37.234-80.141-37.697-146.055-72.499-197.715-104.497v93.165c0 14.624 1.626 25.136 4.906 31.549 3.292 6.386 8.899 10.697 16.806 12.879 11.437 1.375 23.232 3.028 35.357 5.051 7.576-1.349 17.507-1.997 29.803-1.997v18.683h-199.5v-18.683h55.812v-583.375c0-29.632-18.273-44.441-54.807-44.441h-9.348v-18.683h-0.026zM3890.166 182.298v364.001l10.353-16.66c70.357 50.986 132.833 76.492 187.375 76.492 40.924 0 79.123-11.028 114.652-33.069 35.542-22.042 63.719-51.66 84.584-88.855 20.878-37.195 31.311-77.179 31.311-119.914-1.177-45.763-13.434-88.59-36.732-128.483-23.311-39.905-54.331-71.877-93.060-95.929s-80.974-36.851-126.764-38.358c-68.849 0-126.089 26.921-171.72 80.776z"></path>
			<path d="M4615.325 690.926l-106.626-305.055c-11.966-37.182-35.383-55.812-70.238-55.812h-8.343v-18.683h151.119v18.683h-44.467l105.608 298.748c35.714-85.364 59.779-160.098 72.274-224.253 2.856-12.958 4.284-24.409 4.284-34.352 0-17.996-3.504-28.931-10.485-32.712-6.981-3.795-21.116-6.281-42.312-7.431v-18.683h156.157v18.683h-44.454l-90.984 237.859c-8.74 24.435-18.049 50.404-27.899 77.933-9.851 27.516-20.68 56.010-32.474 85.483-11.808 29.473-23.536 56.354-35.238 80.697-11.715 24.329-24.395 47.429-38.028 69.299-28.468 44.798-53.868 78.436-76.188 100.887-22.32 22.478-49.307 36.428-80.988 41.796v-68.162h11.358c2.869 1.679 5.937 3.491 9.216 5.408 3.279 1.93 6.439 3.583 9.481 4.932 10.776 0 30.398-14.822 58.866-44.427 56.896-66.694 100.358-143.636 130.36-230.838z"></path>
			<path d="M5286.656 684.857c0 17.004 3.954 27.939 11.861 32.818s23.972 7.338 48.209 7.338v18.683h-106.573v-56.83c-50.378 46.12-106.97 69.18-169.803 69.18-38.266 0-73.98-8.885-107.155-26.643-33.188-17.771-59.686-43.105-79.467-76.016-19.807-32.897-29.698-70.767-29.698-113.502 0-41.598 12.046-81.027 36.137-118.315 24.065-37.274 55.521-67.038 94.382-89.265 38.834-22.227 78.793-33.334 119.888-33.334 49.703 0 94.937 16.184 135.702 48.487v-256.542l-42.418 50.761-14.637-10.353 108.834-131.325 14.386 12.389-19.688 21.738v650.743h0.040zM5240.192 414.643c-41.598-55.045-95.043-82.574-160.349-82.574-32.818 0-63.626 8.304-92.425 24.898-28.785 16.581-51.806 39.773-69.074 69.577-17.269 29.79-25.876 63.468-25.876 101.006 1.997 37.049 12.244 70.542 30.663 100.53 18.445 29.975 42.51 53.458 72.221 70.436 29.711 17.004 61.339 25.85 94.845 26.537 58.589-2.182 108.583-24.938 149.996-68.188v-242.222z"></path>
			<path d="M5365.435 501.779c7.735-41.743 24.938-77.96 51.607-108.596 26.67-30.623 57.795-54.001 93.377-70.079s69.96-24.118 103.109-24.118c33.162 0 63.494 6.334 91.010 18.961 27.503 12.627 50.854 29.394 70.039 50.259 19.186 20.878 32.739 42.933 40.619 66.165h-396.224c-10.935 30.808-17.401 62.542-19.45 95.202 0.674 37.869 10.948 71.507 30.808 100.887 19.873 29.38 45.538 52.229 77.021 68.558s64.155 25.030 97.978 26.035c33.175 0 63.428-6.519 90.772-19.569 27.357-13.037 50.272-29.671 68.677-49.862 18.445-20.204 32.448-41.162 42.061-62.899l14.637 7.338c-10.763 28.296-26.921 54.371-48.46 78.29-21.539 23.906-48.13 43.185-79.758 57.822s-66.443 21.976-104.484 21.976c-39.376 0-76.452-9.573-111.28-28.666-34.854-19.106-62.727-45.459-83.672-79.057s-31.417-70.41-31.417-110.46c0.026-12.006 1.018-24.713 3.028-38.186zM5433.65 412.633h319.441c-15.497-22.743-36.785-41.598-63.891-56.566s-57.147-22.967-90.151-23.986c-35.357 0-67.249 6.995-95.704 20.971-28.455 13.963-51.687 33.823-69.696 59.58z"></path>
		</svg>
	)
}

// Copyright
function Copyright() {
	return (
		<Typography variant="body">
			{'Copyright \u00A9 '}
			<Link color="inherit" href="https://material-ui.com/">
				New Zealand AWS Interns
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

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
      alert("Your photo has been captured.");
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
      console.log('Error signing out: ', error);
    }
  };

  // Gets the user info of the current user
  const [email, setEmail] = React.useState("")
  const getUser = async () => {
    try {
      let userInfo = await Auth.currentUserInfo()
      setEmail(userInfo.attributes.email);
    } catch (error) {
      console.log('Error getting user data: ', error);
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
    axios.post("https://z9w0rsou5h.execute-api.ap-southeast-2.amazonaws.com/dev", {
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
    alert("Your photo and comment has been uploaded.");
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
        <Toolbar className={classes.navBar}>
          <Logo />
          <Button color="inherit" onClick={() => signOut()}>Sign out</Button>
        </Toolbar>
      </AppBar>

      <main>
        {/* Setting up the camera and comment box to upload */}
        <div className={classes.heroContent}>
          <Container maxWidth="lg">
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
              placeholder="Enter a comment here..." onChange={commentHandler}/>
          </CardContent>
          <CardActions>
          <div className={classes.heroButtons}>
            <Grid container spacing={2} justify="center">
              <Grid item>
                <Button className={classes.button} variant="contained" onClick={() => capture()}>
                  Capture Photo
                </Button>
              </Grid>
              <Grid item>
                <Button className={classes.button} variant="outlined" onClick={() => apiMethod()}
                disabled={!imgSrc}>
                  Upload
                </Button>
              </Grid>
              <Grid item>
                <Button className={classes.button} variant="contained" href='/Home'>
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

      <footer className={classes.footer} align="center">
        <Typography variant="h5" gutterBottom>
          CitizenWatch Application
        </Typography>
        <Typography variant="body" component="p" >
          Report issues within your local area.
        </Typography>
        <Copyright />
      </footer>
    </React.Fragment>
  );
}

export default withAuthenticator(Capture);
