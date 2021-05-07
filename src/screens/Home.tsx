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
import Paper from '@material-ui/core/Paper';
import { Redirect } from 'react-router-dom';
import moment from 'moment';

// Copyright
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        NZ Interns AWS
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// Styles
const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
    flexGrow: 1,
  },
  heroButtons: {
    marginTop: theme.spacing(4),
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
  title: {
    flexGrow: 1,
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));


// Main Home Page
export default function Home({ navigation }) {
  const classes = useStyles();

  // API Get Method to get the incidents
  const [incidents, setIncidents] = React.useState([]);
  const axios = require("axios");

  const apiMethodGet = () => {
    if (!incidents || incidents.length != 0) {
      return;
    }
    axios.get("https://z9w0rsou5h.execute-api.ap-southeast-2.amazonaws.com/dev")
    .then(response => {
      console.log(response)
      setIncidents(response.data.contents);
    })
    .catch(error => {
      console.log(error);
    })
  };

  // Signs out the user
  const signOut = async () => {
    try {
      await Auth.signOut({ global: true });
    } catch (error) {
      console.log('error signing out: ', error);
    }
  };

  // Gets the difference with the Date
  function getDateDifference(date_str) {
    var date = moment.utc(date_str).local().startOf('seconds').fromNow()
    return date;
  }

  // Renders the App
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
        {/* Setting the header and button to report a new incident */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              Incidents
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              We can be in a society that police each other to maintain order in the city. Report on invalid behaviour such as incorrect parking.
            </Typography>
            <div className={classes.root}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper className={classes.paper} elevation={0}>
                  <Button variant="contained" color="primary" onClick={() => navigation.navigate('Capture')}> {/* Use Navigate to navigate through the pages*/}
                    Report an Incident
                  </Button>
                  </Paper>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        {/* Setting the incidents */}
        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4} onLoad={apiMethodGet()}>
            {
              incidents && incidents.map((incident) => (
              <Grid item key={incident.key} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={incident.url}
                    title={incident.key}
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Incident {incident.key}
                    </Typography>
                    <Typography>
                      {getDateDifference(incident.date)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Incident Reports
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Report on innapropriate behaviour!
        </Typography>
        <Copyright />
      </footer>
    </React.Fragment>
  );
}
