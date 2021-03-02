import json
import boto3
import uuid
import base64
# Assuming we have the following JSON format
'''
{
    "comment": "xyz"
    "image": "data:image/jpeg;base64xyz"
    "latitude": "123.0"
    "longitude": "123.0"
    "timestamp": "0000-00-00T00:00:00.000Z"
    "email": "xx@email.com"
    "city": "Wellington"
    "country": "New Zealand"
    "suburb": "Mount Victoria"
}
'''
def handler(event, context):
    comment = event["comment"]
    image = event["image"]
    latitude = event["latitude"]
    longitude = event["longitude"]
    timestamp = event["timestamp"]
    email = event["email"]
    city = event["city"]
    country = event["country"]
    suburb = event["suburb"]

    # Remove the data:image/jpeg;base64 prefix

    image = image.replace("data:image/jpeg;base64", "")

    print("Received image with comment = {} and image = {}".format(comment, image))

    # Generate the ID which will be used to associate image to metadata

    id = uuid.uuid4().hex
    image_name = "{}.jpg".format(id)

    # Save comment, latitude, longitude and timestamp to DynamoDB

    dynamo = boto3.resource("dynamodb")

    table_name = "photo_metadata-dev"
    table = dynamo.Table(table_name)

    data_document = {"ImageFileName": image_name, "ImageLabels": [], "ImageText": [], "Comment": comment, "CommentSentiment": "", "ID": id, "Latitude": latitude, "Longitude": longitude, "Timestamp": timestamp, "Email": email, "City": city, "Country": country, "Suburb": suburb}

    print("Writing the document {} to the database".format(data_document))

    table.put_item(Item = data_document)

    # Save image to S3

    s3 = boto3.resource("s3")

    bucket_name = "photostorage113550-dev"

    print("Saving image to S3 (bucket = {})".format(bucket_name))

    image_object = s3.Object(bucket_name, image_name)
    image_object.put(Body=base64.b64decode(image))
