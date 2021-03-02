# Intro

This is a good App that explore the AWS Cloud services, using AI/ML and Serverless services.

In this demo, we’ll be creating a *CitizenWatch* app to empower users to point out issues in their community with photos and associated comments. AWS services are used to find tags and text in the photo and analyse your sentiment from your comment. Our goal is to highlight how AWS makes it easy to develop solutions that could be complex otherwise. The demo is designed for university students who are using AWS for the first time so it assumes no prior knowledge of the platform. 

# Requirements

- [AWS Active account](https://aws.amazon.com/free) (You can sign up and get 1 year of free tier that helps you build your next idea/startup).
- [NodeJS](https://nodejs.org)
- NPM (should come with NodeJS)
- [AWS CLI](https://aws.amazon.com/cli)
- AWS SAML CLI
- [Amplify CLI](https://docs.amplify.aws/cli)
- [Expo CLI](https://docs.expo.io/workflow/expo-cli)
- Terminal window where you can type commands (e.g. Windows PowerShell or Mac/Unix terminal)
- A text editor
- Python (version matching the runtime of the lambda functions) and add to PATH environment variable

# Dependencies

1. npm install @material-ui/core@next
2. npm install @material-ui/icons@next
3. npm install aws-amplify
4. npm install react-webcam
5. npm install exif-js
6. npm install moment

# Setup

To configure and setup on your machine, follow the steps.

## Setup your machine

If you're new to Git, NodeJS world! I suggest you to follow the official guidelines by Git and Node.js projects.

- Installing git for the first time on your computer [click here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
- To install Node.JS and NPM on your computer [click here](https://nodejs.org/en/).

## Setup your AWS account for Amplify

To use AWS amplify to build your application, you must have the Amplify CLI installed. Open a terminal and paste the code below to install the Amplify CLI.

```
npm install -g @aws-amplify/cli
```

After a successful installation of the Amplify CLI, it's time to run the following code to configure and link to your AWS Account.

```
amplify configure
```

## Setup a React Native App

We use Expo[li] to bootstrap our React Native application. Expo is a framework that helps you develop, build, and, deploy projects that run natively on all users' devices.

To get started with Expo, launch a terminal and paste the following code:

```
npm install --g expo-cli
```

## Running the project

Once you've installed all the dependencies, it's time to run the project.

To run your project, navigate to the directory and run one of the following npm commands.

```
cd {The directory where you clone this repo}
npm start # you can open iOS, Android, or web from here, or run them directly with the commands below.
npm run android
npm run ios
npm run web
```

Your project has been successfully initialized and connected to the cloud!

Some next steps:

```
amplify status # to show you what you've added already and if it's locally configured or deployed
```

```
amplify add<category> # Will allow you to add features like user login or a backend API.
```

```
amplify push # Will build all your local backend resources and provision it in the cloud.
```

```
amplify console  # To open the Amplify Console and view your project status.
```

```
amplify publish #Will build all your local backend and frontend resources (if you have hosting category added) and provision it in the cloud</category>
```

# Next steps

This is a demo app, however feel free to improve the software and collaborate. We will not be maintaining it in near future. However, here are some extra challenges for you:
- 
- The current items in the incidents home page are not sorted by order of date. Use the last-modified attribute to sort the items in order by date.
- The current items in the incidents home page does not include the Rekognition image recognition and Comprehend sentiment analysis results. Add a feature such that once the photo is clicked on, it navigates to a page that details the incident's Rekognition and Comprehend results. 
- Sort the current items into folders organized by the Rekognition image recognition and Comprehend sentiment analysis results. Use a selection bar in the page, such that the user can sort by the Rekognition and Comprehend results. 
For additional application changes implemented or success stories, please email them to janelhuang28@gmail.com
