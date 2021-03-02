# Intro

As part of our presentation **"Introducing University Students to the Cloud"**, we have designed a demo of an easy-to-make app that can be adapted to any start up idea you might have. It uses a mix of AWS's core and managed services that all run on Serverless infrastructure. Our goal is to highlight how AWS makes it easy to develop solutions that could be otherwise complex. The demo is designed for university students who are using AWS for the first time so it assumes no prior knowledge of the platform.

We use the example of a **CitizenWatch** platform that encourages users to build self-policing communities. Users point out issues in their neighborhood by taking photos and leaving comments in the app. AWS services recognise tags and text in the image and analyse your sentiment from your comment. This data is finally displayed in a dashboard that decision makers can use to inform business decisions.

# Folder Navigation

There are three main subfolders in this repository: **src**, **deployment** and **presentation**. 

The **deployment** folder holds the necessary instructions and code to deploy the previously built CitizenWatch app onto your own AWS backend infrastructure. It uses a combination of services with the aid of AWS Amplify to generate the needed resources in the cloud.

The **src** folder holds the necessary instructions and code to install the necessary dependencies, set up the React Native App and run the project.

The **presentation** folder holds the presentation content that describes what is the cloud, the cloud's advantages, AWS core services, AWS specialised services and the next steps. 
