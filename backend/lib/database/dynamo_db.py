"""Dynamo DB connection methods."""
import os

import boto3


def connect():
    """Method to connect to dynamo_db."""
    if not all((key in os.environ for key in ['AWS_ACCESS_KEY', 'AWS_SECRET_KEY'])):
        print('WARNING - No AWS credentials available.')
        return None
    session = boto3.Session(
        aws_access_key_id=os.environ['AWS_ACCESS_KEY'],
        aws_secret_access_key=os.environ['AWS_SECRET_KEY'],
        region_name='us-west-1'
    )
    return session.resource('dynamodb')


def get_table(resource_session, table):
    """Return a dynamodb table from a resource session."""
    if resource_session:
        return resource_session.Table(table)
