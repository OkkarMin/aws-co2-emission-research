import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";

export class ContainerArchitectureCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // VPC
    const defaultVpc = ec2.Vpc.fromLookup(this, "DefaultVpc", {
      isDefault: true,
    });

    // Create a cluster
    const cluster = new ecs.Cluster(this, "ECSCluster", {
      vpc: defaultVpc,
    });

    // Add capacity to the cluster
    cluster.addCapacity("DefaultCapacity", {
      instanceType: new ec2.InstanceType("t3.medium"),
      desiredCapacity: 1,
    });

    // Create a task definition
    const taskDefinition = new ecs.Ec2TaskDefinition(this, "TaskDefinition");
    taskDefinition.addContainer("DefaultContaier", {
      image: ecs.ContainerImage.fromAsset("app"),
      memoryLimitMiB: 512,
      portMappings: [{ hostPort: 80, containerPort: 8000 }],
    });

    const ecsService = new ecs.Ec2Service(this, "Service", {
      cluster,
      taskDefinition,
    });
  }
}
