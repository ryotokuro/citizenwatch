import boto3
import json
from datetime import datetime, timedelta
from botocore.client import Config

def handler(event, context):
  s3 = boto3.client('s3', config=Config(signature_version='s3v4'))
  BUCKET_NAME = 'photostorage113550-dev';
  s3_bucket_content = s3.list_objects(Bucket=BUCKET_NAME)['Contents']
  contents = []
  
  for obj in s3_bucket_content:
    key = obj['Key'].replace('.jpg', '')
    params = {'Bucket': BUCKET_NAME, 'Key': obj['Key']}
    date = obj['LastModified'] # This is in 
    print(date)
    url = s3.generate_presigned_url('get_object', params, ExpiresIn=600)
    contents.append({
      'key': key,
      'date': date.strftime("%d-%b-%Y %H:%M:%S"),
      'url': url
    })
  
  return {
    'contents': contents
  }
