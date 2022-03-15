import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class ServerlessArchitectureCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const color_to_rgb_ddb_table = new dynamodb.Table(
      this,
      "color-to-rgb-table",
      {
        partitionKey: { name: "color", type: dynamodb.AttributeType.STRING },
      }
    );

    const python_lambda_handler = new lambda.Function(
      this,
      "color-to-rgb-python-handler",
      {
        runtime: lambda.Runtime.PYTHON_3_8,
        code: lambda.Code.fromAsset("lambda"),
        handler: "app.lambda_handler",
        environment: {
          DDB_TABLE_NAME: color_to_rgb_ddb_table.tableName,
        },
      }
    );

    color_to_rgb_ddb_table.grantReadWriteData(python_lambda_handler);

    new apigateway.LambdaRestApi(this, "color-to-rgb-api", {
      handler: python_lambda_handler,
    });
  }
}
