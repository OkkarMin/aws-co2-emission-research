## Getting Started

### Deploy Infrastructure

```bash
aws cloudformation deploy \
    --template-file aurora_cf_template.yaml \
    --stack-name aurora-db-color-to-rgb \
    --parameter-overrides file://{path_to_parameter_file.json}
```

### Deploy Server

Ensure `.env` is in project root with the following variables

```
HOST
DBNAME
USER
PASSWORD
PORT
```

- `USER` and `PASSWORD` are set when carrying out [Deploy Infrasture](#deploy-infrastructure) step

- Rest of the variables are obtained from AWS Aurora write instance

```bash
pip install -r requirements.txt
uvicorn --host 0.0.0.0 --port 80 main:app
```
