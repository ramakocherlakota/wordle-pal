npm run build:development
aws s3 cp --recursive build-dev s3://wordle-dev.ramakocherlakota.net
