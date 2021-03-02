import boto3
import os
import sys
import uuid
from urllib.parse import unquote_plus
import json

# Function to detect image labels using AWS Rekognition
# Inputs:
#   bucket (string) = name of s3 bucket to which image was uploaded
#   photo (string) = image filename
#   client = a low-level client representing Amazon Rekognition
#   display (boolean) = whether to display rekognition output
# Outputs:
#   label_dict (string) = json rekognition output containing LabelName and Confidence for each label found
#       LabelName (string) = name of label found within the image
#       Confidence (float) = label's confidence score 
def detect_labels(bucket, photo, client, display):

    response = client.detect_labels(Image = {"S3Object": {"Bucket": bucket, "Name": photo}}, MinConfidence = 80)

    # All print statements below are for debugging purposes so we can visualise whats actually happening
    if display:
        print("Detecting labels for {}\n".format(photo))

        for label in response["Labels"]:
            print("Label name: {}\n\
                   Confidence: {}\n".format(label["Name"], label["Confidence"]))
            print("Instances\n\n")

            for instance in label["Instances"]:
                print("Bounding box\n\
                       Top: {}\n\
                       Left: {}\n\
                       Width: {}\n\
                       Height: {}\n\
                       Confidence: {}\n".format(str(instance["BoundingBox"]["Top"]),
                                                 str(instance["BoundingBox"]["Left"]),
                                                 str(instance["BoundingBox"]["Width"]),
                                                 str(instance["BoundingBox"]["Height"]),
                                                 str(instance["Confidence"])))
            print("Parents\n\n")

            for parent in label["Parents"]:
                print (parent["Name"])

    # Return a JSON object that will be stored in DynamoDB
    label_dict = []
    for label in response["Labels"]:
        label_dict.append({"LabelName": label["Name"], "Confidence": label["Confidence"]})

    return json.dumps(label_dict)


# Function to detect text using AWS Rekognition
# Inputs:
#   bucket (string) = name of s3 bucket to which image was uploaded
#   photo (string) = image filename
#   client = a low-level client representing Amazon Rekognition
#   display (boolean) = whether to display rekognition output
# Outputs:
#   text_dict (string) = json rekognition output containing DetectedText and Confidence for each piece of text found
#       DetectedText (string) = text detected within the image
#       Confidence (float) = text's confidence score 
def detect_text(bucket, photo, client, display):

    response=client.detect_text(Image={'S3Object':{'Bucket':bucket,'Name':photo}}, Filters={"WordFilter": {"MinConfidence": 0.8}})

    # All print statements below are for debugging purposes so we can visualise whats actually happening
    if display:
        print ('Detected text\n----------')

        for text in response['TextDetections']:
                print ('Detected text:' + text['DetectedText'])
                print ('Confidence: ' + "{:.2f}".format(text['Confidence']) + "%")
                print ('Id: {}'.format(text['Id']))

                if 'ParentId' in text:
                    print ('Parent Id: {}'.format(text['ParentId']))

                print ('Type:' + text['Type'])
                print()

    # Return a JSON object that will be stored in DynamoDB
    text_dict = []
    for text in response['TextDetections']:
        text_dict.append({"DetectedText": text["DetectedText"], "Confidence": text["Confidence"]})

    return json.dumps(text_dict)


# This function uses AWS Rekognition to detect labels and text in images uploaded to an S3 bucket and writes 
# this information (along with its confidence level) to a DynamoDB table.
def lambda_handler(event, context):
    
    for record in event["Records"]:
        # Retrieve the bucket and image filename
        bucket = record["s3"]["bucket"]["name"]
        photo = unquote_plus(record["s3"]["object"]["key"])

        id = photo.replace(".jpg", "")
        print("Bucket = {} Photo = {}".format(bucket, photo))

        # Connect to DynamoDB
        dynamodb = boto3.resource("dynamodb")
        tableName = "photo_metadata" # hard coded name for now
        dynamoTable = dynamodb.Table(tableName)

        # Connect to Rekognition
        client = boto3.client("rekognition")

        # Display rekognition response
        disp_labels = False
        disp_text = False

        # Call label and text detection functions
        label_dict = detect_labels(bucket, photo, client, disp_labels)
        text_dict = detect_text(bucket, photo, client, disp_text)

        # Write to DynamoDB
        print("Writing to DynamoDB\n")
        dynamoTable.update_item(
            TableName = tableName,
            Key = {"ID": id}, 
            UpdateExpression = "set ImageLabels = :val1, ImageText = :val2", 
            ExpressionAttributeValues={":val1": label_dict, ":val2": text_dict}
            )