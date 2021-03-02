import boto3
import json
from pprint import pprint

# Function to detect sentiment using AWS Comprehend
# Inputs:
#   text (string) = the comment to perform sentiment analysis on
#   disp (boolean) = whether to display comprehend output
# Outputs:
#   sentiment_dict (string) = json comprehend output containing sentiment and score for the comment
#       sentiment (string) = overall sentiment in comment
#       score (float) = confidence level in sentiment 
def detect_sentiment(text, disp):

    # Connect to Comprehend and call detect_sentiment API
    comprehend = boto3.client("comprehend")
    response = comprehend.detect_sentiment(Text=text, LanguageCode="en")

    # Print out sentiment and scores for each type of sentiment
    if disp:
        print(response["Sentiment"])
        sentiment_str = ["Mixed", "Positive", "Neutral", "Negative"]

        print("Sentiment scores")
        for i in range(4):
            print("{}: {}".format(sentiment_str[i], str(response["SentimentScore"][sentiment_str[i]])))

    # Return sentiment and confidence score
    sentiment = response["Sentiment"]
    score = max(response["SentimentScore"].values())

    sentiment_dict = json.dumps({"Sentiment": sentiment, "Confidence": score})
    return sentiment_dict


# This function is triggered by a Comment being inserted or modified in a DynamoDB
# table. It uses AWS Comprehend to perform sentiment analysis and updates the same 
# table with the sentiment and it's confidence score.
def lambda_handler(event, context):
    
    # Connect to DynamoDB
    dynamodb = boto3.resource("dynamodb")
    tableName = "photo_metadata"
    dynamoTable = dynamodb.Table(tableName) # hard coded name for now

    # Display outputs
    disp = False
    if disp:
        pprint("pprint of event {}".format(event))

    for record in event['Records']:
        if disp:
            print("eventID: {}".format(record['eventID']))
            print("eventName: {}".format(record['eventName']))

        # Only extract the id and comment when the "Comment" field is modified or has something inserted
        if (record['eventName'] == "INSERT" or record['eventName'] == "MODIFY") \
                and "Comment" in record["dynamodb"]['NewImage']:
            # Extract the id (primary key) and comment inserted
            id = record["dynamodb"]['NewImage']["ID"]["S"]
            text = record["dynamodb"]['NewImage']["Comment"]["S"]

            if disp:
                print("ID: {}".format(record["dynamodb"]['NewImage']["ID"]["S"]))
                print("Comment: {}".format(record["dynamodb"]['NewImage']["Comment"]["S"]))

            sentiment_dict = detect_sentiment(text, disp)

            # Write to DynamoDB
            dynamoTable.update_item(
            TableName = tableName,
            Key = {"ID": id}, 
            UpdateExpression = "set CommentSentiment = :val1", 
            ExpressionAttributeValues={':val1': sentiment_dict}
            )
            
    print('Successfully processed %s records.' % str(len(event['Records'])))