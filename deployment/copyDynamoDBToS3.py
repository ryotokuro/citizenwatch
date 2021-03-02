import logging
import json
import boto3
from botocore.exceptions import ClientError
import csv
import ast

#define function constants
BUCKET_NAME = 'nz-excel-data-533986738195'  # Change this to a unique bucket name of your choice
REGION = 'ap-southeast-2'  # Change this to match your DynamoDB region
TABLE_NAME = 'photo_metadata-dev' # Select target table to read from

def create_bucket():
    """
        Create an S3 bucket in a specified region
    
        :return: True if bucket created, else False
    """
    
    # Check if bucket exists first
    print('Check if bucket exists...')
    s3 = boto3.client('s3', region_name=REGION) # Retrieve the list of existing buckets
    bucket_list = s3.list_buckets()
    
    for bucket in bucket_list['Buckets']:
        if BUCKET_NAME == bucket['Name']:
            print('Bucket already exists.')
            return

    # Create bucket
    try:
        print('Creating bucket...')
        location = {'LocationConstraint': REGION}
        s3.create_bucket(Bucket=BUCKET_NAME,
                                CreateBucketConfiguration=location)
        print("Bucket created successfully.\n")
    except ClientError as e:
        logging.error(e)
        return False
    return True


def upload_file(file_name, object_name=None):
    """
        Upload a file to an S3 bucket

        :param file_name: File to upload
        :param object_name: S3 object name. If not specified then file_name is used
        :return: True if file was uploaded, else False
    """
    s3 = boto3.client('s3')

    # If S3 object_name was not specified, use file_name
    if object_name is None:
        object_name = file_name

    # Upload the file
    try:
        print('Uploading', file_name + '...')
        response = s3.upload_file(file_name, BUCKET_NAME, object_name)
        print(file_name, 'uploaded successfully.\n')
    except ClientError as e:
        logging.error(e)
        print('ERROR:', file_name, 'failed to upload\n')
        return False
    return True


def write_csv_header(path, header):
    with open(path, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(header)


def write_to_csv(path, time, location, id, dictionary, city, country, suburb, key):
    """
        Create CSV file and upload to S3
        
        :param path: Path to upload to S3 bucket
        :param id: ID of DynamoDB data item
        :param dictionary: Data set
        :param key: Key to extract information from data set
        :param city: City of photo
        :param country: Country of photo
        :param suburb: Suburb of photo
    """
    
    with open(path, 'a', newline='') as file:  # append new entries to csv
        writer = csv.writer(file)
        
        for item in dictionary:
            print(item)
            writer.writerow([time, location, id, item[key], item['Confidence'], city, country, suburb])
           

def write_to_json(json_path, csv_path):
    """
        Write a json file
        
        :param json_path: Path to upload to S3 bucket
        :param csv_path: Path to csv file in S3 bucket
    """
    
    # Define url of csv file and create json structure with dict
    url = "s3://" + BUCKET_NAME + "/" + csv_path
    
    data = {}
    data["fileLocations"] = []
    data["fileLocations"].append({"URIs": [url]})
    
    # Write to file
    with open(json_path, 'w') as file:
        json.dump(data, file)
    

def handler(event, context):
    """
        Extract data from Dynamo, filter the data and remove duplicates before
        inserting into three CSV files that get uploaded S3.
        
        Triggered when any changes are made to the DynamoDB.
    """
    
    # Create bucket (if it doesn't already exist)
    s3 = boto3.client('s3')
    create_bucket()
    
    # Define explicit S3 paths to write
    FILE_TEXTS = '/tmp/image_texts.csv'
    FILE_LABELS = '/tmp/image_labels.csv'
    FILE_SENTIMENTS = '/tmp/sentiments.csv'
    
    MANIFEST_TEXTS = '/tmp/manifest_image_texts.json'
    MANIFEST_LABELS = '/tmp/manifest_image_labels.json'
    MANIFEST_SENTIMENTS = '/tmp/manifest_sentiments.json'
    
    
    # Create CSV files and write headers in
    header = ["Timestamp", "Location", "ID", "ImageText", "Confidence", "CityName", "Country", "Suburb"]
    
    header[3] = 'ImageText'
    write_csv_header(FILE_TEXTS, header)
    
    header[3] = 'ImageLabel'
    write_csv_header(FILE_LABELS, header)
    
    header[3] = 'Sentiment'
    write_csv_header(FILE_SENTIMENTS, header)
    
    # Set up connection to Dynamo
    dynamodb = boto3.resource('dynamodb') 
    table = dynamodb.Table(TABLE_NAME)
    
    # Process Dynamo entries
    response = table.scan()  # Extract data from DynamoDB Table
    for item in response['Items']:
        # print(item)
        # Timestamp
        try:
            time = item['Timestamp']
        except:
            time = 'N/A'
        
        # Location (Format: Longitude, Latitude/)
        try:
            location = str(item['Longitude']) + ', ' + str(item['Latitude']) + '/'
        except:
            location = 'N/A'
            
        try: 
            country = item['Country']
        except:
            country = 'N/A'
            
        try: 
            city = item['City']
        except:
            city = 'N/A'
            
        try: 
            suburb = item['Suburb']
        except:
            suburb = 'N/A'
        
        
        # ID
        id = item['ID']
        
        # Image Text
        try:
            image_texts = []  # Store unique entries
            image_texts_raw = ast.literal_eval(item['ImageText'])
            for i in image_texts_raw:
                if i not in image_texts:  # Filter by new texts
                    image_texts.append(i)
        except:
            image_texts = []
                    
        
        # Image Labels
        try:
            image_labels = ast.literal_eval(item['ImageLabels'])
        except:
            image_labels = []
        
        # Sentiments
        try:
            sentiments = [ast.literal_eval(item['CommentSentiment'])]
        except:
            sentiments = []
    
        # Filter the data into 3 different CSVs
        # 1. [image_texts.csv, BUCKET, ID, ImageText, Confidence]
        write_to_csv(FILE_TEXTS, time, location, id, image_texts, city, country, suburb, 'DetectedText')
        
        # 2. [image_labels.csv, BUCKET, ID, ImageLabel, Confidence]
        write_to_csv(FILE_LABELS, time, location,  id, image_labels, city, country, suburb, 'LabelName')
        
        # 3. [sentiments.csv, BUCKET, ID, Sentiment, Confidence]
        write_to_csv(FILE_SENTIMENTS, time, location, id, sentiments, city, country, suburb, 'Sentiment')
        
    
    # Upload dynamo data to bucket
    upload_file(FILE_TEXTS)
    upload_file(FILE_LABELS)
    upload_file(FILE_SENTIMENTS)
    
    # Write manifest files
    print("Writing to json")
    write_to_json(MANIFEST_TEXTS, FILE_TEXTS)
    write_to_json(MANIFEST_LABELS, FILE_LABELS)
    write_to_json(MANIFEST_SENTIMENTS, FILE_SENTIMENTS)
    
    # Upload manifest files to bucket
    print("Uploading json")
    upload_file(MANIFEST_TEXTS)
    upload_file(MANIFEST_LABELS)
    upload_file(MANIFEST_SENTIMENTS)
    
    return 'EXECUTION SUCCESS'
