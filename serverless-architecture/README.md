## Getting Started

### Deploy Infrastructure

```bash
aws cloudformation deploy \
    --template-file ./color-to-rgb/.chalice/ddb_cf_template.yaml \
    --stack-name ddb-color-to-rgb \
```

### Deploy Serverless API

```bash
chalice deploy
```
