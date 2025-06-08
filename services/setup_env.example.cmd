:: setup_env.example.cmd -- COMMITTED as a template

@echo off

:: open search integration test
set OPENSEARCH_ENDPOINT=

:: upload service integration test
set BUCKET_NAME=
set EVENT_BUS_NAME=

:: meal uploaded event consumer Lambda to insert dynamo DB records
set MEALS_TABLE=

:: Cognito auth login Lambda
set COGNITO_CLIENT_ID=
