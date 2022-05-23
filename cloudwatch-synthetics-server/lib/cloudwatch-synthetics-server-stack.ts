import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as synthetic from "@aws-cdk/aws-synthetics-alpha";

export class CloudwatchSyntheticsServerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const serverlessCanary = new synthetic.Canary(this, "ServerCanary", {
      schedule: synthetic.Schedule.expression("rate(10 minutes)"),
      runtime: synthetic.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_4,
      test: synthetic.Test.custom({
        code: synthetic.Code.fromAsset("canary"),
        handler: "index.handler",
      }),
      canaryName: "server-canary",
    });
  }
}
