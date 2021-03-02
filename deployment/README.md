# Demo Deployment

## Intro

This folder holds the necessary instructions and code to deploy the previously built CitizenWatch app onto your own AWS backend infrastructure. We will be using a combination of services with the aid of AWS Amplify to generate the needed resources in the cloud.

The app's architectural diagram is shown below and can be referred to as a reference throughout this tutorial

![Architecture Diagram](/deployment/assets/images/architecture_diagram.png)

## Requirements

Before getting started, you will need to ensure you have the following installed on your machine

* [NodeJS](https://nodejs.org)
* [AWS CLI](https://aws.amazon.com/cli)
* [Amplify CLI](https://docs.amplify.aws/cli)
* [Expo CLI](https://docs.expo.io/workflow/expo-cli)
* [Python](https://www.python.org/downloads/)
* A text editor

**Note: You will also need an active AWS account** ([You can sign up and get 1 year of free tier](http://aws.amazon.com/))

## Configuring AWS CLI

The following steps need to be taken out to authenticate your AWS account with the AWS CLI you previously installed

- In a browser, navigate to the AWS console and click on the **Identity and Access Management (IAM)** service
- Under the **Access management** dropdown, click on **Users**
- Click on the user that you want to deploy the demo infrastructure to
- Select the **Security Credentials** tab
- Under the **Access Keys** heading, click on the **Create Access Key** button
- Download the .csv file to keep a copy of the access key on your machine in case you lose these credentials
- In a command line window type `aws configure`
- Replace the **Access Key ID** , **Secret Access Key** and **Region name** with your own information

## Configuring Amplify CLI

The  following steps need to be taken out to authenticate your AWS account with the Amplify CLI you previously installed

- In a command line window type `amplify configure`
- You will be prompted to login into your AWS account in your browser
- Press **Continue** in the command line windows after you have logged in
- Select the region in which you wish to deploy the infrastructure
- Enter the username of the user you wish to be created by Amplify and a new browser window will open
- Ensure the user is given programmatic access and press **Next**
- Attach the **Administrator Access** policy and press **Next**
- Press **Next**, press **Create User** and take note of the **Access key ID** and **Secret access key**
- In the command line window press **Continue**
- Enter the **Access key ID** and **Secret access key** from the previous step
- Enter a profile name for the the user you have just created

## Configuring Amplify Project

The following steps need to be taken out to setup your Amplify project in your AWS account before we start deploying any resources

- Create a folder on your machine to store the project contents
- Open a command line window and navigate to your project folder
- Type **`amplify init`**
- Choose a name for your project
- Press [Enter] to set your environment name to **`dev`**
- Choose a text editor of your choice
- Select **`JavaScript`**
- Select **`react-native`**
- Press [Enter] to set your Source Directory Path to **`src`**
- Press [Enter] to set your Distribution Directory Path to **`/`**
- Press [Enter] to set the default Build Command to **`npm run-script build`**
- Press [Enter] to set the default Start Command to **`npm run-script start`**
- Select **`AWS profile`** as your authentication method
- Choose the profile you want to use
- Wait for amplify to finish setting up your project
- Your project should now be successfully initialized and connected to the cloud!

## Deploying Infrastructure

The following steps are broken up for each resource and should be followed in the order that they are displayed here

### Cognito

- In your command line window, navigate to your Amplify project directory
- In a command line window type **`amplify add auth`**
- Select **`Default configuration`**
- Select **`Email`**
- Select **`No, I am done`**

### S3

- In a command line window type `amplify add storage`
- Select **Content (Images, audio, video, etc.)**
- Enter a name for the resource (note this is not the bucket name)
- Enter a name for your storage bucket (this needs to be globally unique)
- Select **Auth users only**
- Select **create/update, read, delete** (use arrow keys and press space)
- Enter **N** to not set up a Lambda Trigger

### DynamoDB

- In a command line window type **`amplify add storage`**
- Select **`NoSQL Database`**
- Enter a name for the resource (note this is not the table name)
- Enter **`photo_metadata`** for the table name
- Enter the following column names one at a time ensuring the matching data type is chosen
  - **`ID`** (string)
  - **`Comment`** (string)
  - **`CommentSentiment`** (string)
  - **`ImageFileName`** (string)
  - **`ImageLabels`** (list)
  - **`ImageText`** (list)
  - **`Latitude`** (string)
  - **`Longitude`** (string)
  - **`Timestamp`** (string)
- Select **`ID`** to be the partition key
- Enter **`N`** to not add a sort key
- Enter **`N`** to not add global secondary indexes
- Enter **`N`** to not add a Lambda Trigger

### Lambda

#### UploadS3andDynamoDB

- In your command line, enter the following command: `amplify add function`
- Select which capability you want to add: `Lambda function (severless function)`
- Provide an AWS Lambda function name: `uploadS3andDynamoDB`
- Choose the runtime that you want to use: `Python`
- Do you want to configure advanced settings: `Y`
- Do you want to access other resources in this project from your Lambda function: `Y`
- Select the category: `storage` (press [Space]) and press [Enter]
    - Storage has 2 resources in this project. Select the one you would like your Lambda to access: Press `i` and press [Enter]
    - Select the operations you want to permit for your S3 bucket: Press [Space] to select `create`, `read`, `update` and press [Enter]
    - Select the operations you want to permit for photo_metadata (dynamoDB): Press [Space] to select `create`, `read`, `update` and press [Enter] 
- Do you want to invoke this function on a recurring schedule: `N`
- Do you want to configure Lambda layers for this function: `N`
- Do you want to edit the local lambda function now: `N`
- Finish building the function by using: `amplify function build`
    - Are you sure you want to continue building the resources: `Y`
- In a browser, navigate to the lambda console, and select the lambda function: `uploadS3andDynamoDB-dev`
    - Under **Function code**, double click the file named `index.py`
    - Replace the code in this file by pasting the code from `uploadS3andDynamoDB.py` into this repository.
    - Click `Deploy`

#### UploadMetadataToDynamoDB

- In the amplify cli, add a function: `amplify add function`
- Select which capability you want to add: `Lambda function (severless function)`
- Provide an AWS Lambda function name: `uploadMetadataToDynamoDB`
- Choose the runtime that you want to use: `Python`
- Do you want to configure advanced settings: `Y`
- Do you want to access other resources in this project from your Lambda function: `Y`
- Select the category: `storage` (press [Space]) and press [Enter]
    -  Storage has 2 resources in this project. Select the one you would like your Lambda to access: Press `i`
    - Select the operations you want to permit for photoStorage(note this is the bucket name and may be different): Press [Space] for `read` and press [Enter]
    - Select the operations you want to permit for photo_metadata: Press `i` and press [Enter]
- Do you want to invoke this function on a recurring schedule: `N`
- Do you want to configure Lambda layers for this function: `N`
- Do you want to edit the local lambda function now: `N`
- Finish building the function by using: `amplify function build`
    - Are you sure you want to continue building the resources: `Y`
- In a browser, navigate to the lambda console, and select the lambda function: `uploadMetadataToDynamoDB-dev`
    - Under `Designer`, click on `Add trigger`
        - Select trigger: `s3`
        - Bucket: photoStorage (note maybe difference)
        - Event type: `All object create events`
        - Select the acknowledgement for recursive invocation
        - Select `Add`
    - Click on the `Permissions` tab
        - In `Execution Role`, select the role name
        - In the opened IAM console, under `Permissions`, click on `Attach Policies`
        - In the search bar, type `AmazonRekognitionFullAccess` and select it
        - Click on `Attach`
    - Navigate back to the lambda function in the console
    - Under **Function code**, double click the file named `index.py`
    - Replace the code in this file by pasting the code from `uploadMetadataToDynamoDB.py` in this repository. 
    - Click `Deploy`

#### SentimentAnalysisToDynamoDB

- In the amplify cli, add a function: `amplify add function`
- Select which capability you want to add: `Lambda function (severless function)`
- Provide an AWS Lambda function name: `sentimentAnalysisToDynamoDB`
- Choose the runtime that you want to use: `Python`
- Do you want to configure advanced settings: `Y`
- Do you want to access other resources in this project from your Lambda function: `Y`
- Select the category: `storage` (press [Space]) and press [Enter]
    -  Storage has 2 resources in this project. Select the one you would like your Lambda to access: Press space for `photo_metadata`
    - Select the operations you want to permit for photo_metadata: Press `i` and press [Enter]
- Do you want to invoke this function on a recurring schedule: `N`
- Do you want to configure Lambda layers for this function: `N`
- Do you want to edit the local lambda function now: `N`
- Finish building the function by using: `amplify function build`
    - Are you sure you want to continue building the resources: `Y`
- In a browser, navigate to the lambda console, and select the lambda function: `sentimentAnalysisToDynamoDB-dev`
    - Under `Designer`, click on `Add trigger`
        - Select trigger: `DyanmoDB`
        - DynamoDB Table: `photo_metadata`
        - Select `Add`
    - Navigate back to the lambda function in the console
    - Under **Function code**, double click the file named `index.py`
    - Replace the code in this file by pasting the code from `sentimentAnalysisToDynamoDB.py` in this repository.
    - Click `Deploy`

#### CopyDynamoToS3

- In the amplify cli, add a function: `amplify add function`
- Select which capability you want to add: `Lambda function (severless function)`
- Provide an AWS Lambda function name: `copyDynamoToS3`
- Choose the runtime that you want to use: `Python`
- Do you want to configure advanced settings: `Y`
- Do you want to access other resources in this project from your Lambda function: `Y`
- Select the category: `storage` (press [Space]) and press [Enter]
    -  Storage has 2 resources in this project. Select the one you would like your Lambda to access: Press `i` and press [Enter]
    -  Select the operations you want to permit for photoStorage (note may be different): Press `i` and press [Enter]
    - Select the operations you want to permit for photo_metadata: Press `i` and press [Enter]
- Do you want to invoke this function on a recurring schedule: `N`
- Do you want to configure Lambda layers for this function: `N`
- Do you want to edit the local lambda function now: `N`
- Finish building the function by using: `amplify function build`
    - Are you sure you want to continue building the resources: `Y`
- In a browser, navigate to the lambda console, and select the lambda function: `copyDynamoToS3-dev`
    - Under `Designer`, click on `Add trigger`
        - Select trigger: `DyanmoDB`
        - DynamoDB Table: `photo_metadata`
        - Select `Add`
    - Click on the `Permissions` tab
        - In `Execution Role`, select the role name
        - In the opened IAM console, under `Permissions`, click on `Attach Policies`
        - In the search bar, type `ComprehendReadOnly` and select it
        - Click on `Attach`
    - Navigate back to the lambda function in the console
    - Under **Function code**, double click the file named `index.py`
    - Replace the code in this file by pasting the code from `copyDynamoToS3.py` in this repository.
    - Click `Deploy`

#### GetS3andDynamoDBdata

- In the amplify cli, add a function: `amplify add function`
- Select which capability you want to add: `Lambda function (severless function)`
- Provide an AWS Lambda function name: `getS3andDynamoDBdata`
- Choose the runtime that you want to use: `Python`
- Do you want to configure advanced settings: `Y`
- Do you want to access other resources in this project from your Lambda function: `Y`
- Select the category: `storage` (press [Space]) and press [Enter]
    - Storage has 2 resources in this project. Select the one you would like your Lambda to access: Press [Space] for photoStorage
    - Select the operations you want to permit for photoStorage(note this is the bucket name and may be different): Press [Space] for `read` and `enter`
- Do you want to invoke this function on a recurring schedule: `N`
- Do you want to configure Lambda layers for this function: `N`
- Do you want to edit the local lambda function now: `N`
- Finish building the function by using: `amplify function build`
    - Are you sure you want to continue building the resources: `Y`
- In a browser, navigate to the lambda console, and select the lambda function: `getS3andDynamoDBdata-dev`
    - Under **Function code**, double click the file named `index.py`
    - Replace the code in this file by pasting the code from `getS3andDynamoDBdata.py` in this repository.
    - Click `Deploy`


### API Gateway

- In a command line window type amplify add api
- Select REST
- Enter a name for the resource: restApi
- Enter /items
- Select Use a Lambda function already added in the current Amplify project and choose the uploadS3andDynamoDB function
- Enter Y
- Select Authenticated users only
- Select create and read
- Enter N
- Navigate to the aws console, and go into the API gateway console
    - Under APIs, click on restApi
    - Under Resources, click on `Actions`
    - In the drop down menu, select `Create Method`
    - Select `GET` in the drop down menu and click on the tick button
    - In the integration type use Lambda (default) and set the lambda function to be `getS3andDynamoDBdata-dev`
    - Click `Save` and `Ok`
    - When navigated back to the resource page, select `ANY`
        - Select `Method Response on the right window`
        - Click on `Add Response` and enter the status code as `200`
        - Expand the `200` status code
        - Click on `Add Header`
            - Add `Access-Control-Allow-Headers	`
        - Click on `Add Header`
            - Add `Access-Control-Allow-Origin		`
        - Click on `Add Header`
            - Add `Access-Control-Allow-Credentials	`
        - Click on `Add Header`
            - Add `Access-Control-Allow-Methods	`
        - Click on `Response Models`
            - Add `application/json` as context, `Request Schema` as Models
        - Repeat the steps in above indentation for `GET`   
    - Under Actions, select `Deploy API`
        - Select the development stage as: `dev` and click `Deploy`

## Deploy

To deploy all the resources that you have created above in amplify use the following command: `amplify push`. You can then log into the amplify console to locate the appropriate resources. 
