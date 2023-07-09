npm run build:production
aws s3 cp --recursive build s3://wordle.ramakocherlakota.net
