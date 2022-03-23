import { Stack, StackProps, SecretValue } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";

export class ServerArchitectureCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // VPC
    const defaultVpc = ec2.Vpc.fromLookup(this, "DefaultVpc", {
      isDefault: true,
    });

    // Security Group
    const colorToRGBSecurtyGroup = new ec2.SecurityGroup(
      this,
      "ColorToRGBSecurtyGroup",
      {
        vpc: defaultVpc,
        description: "Allow traffic to the color-to-rgb service",
      }
    );
    colorToRGBSecurtyGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(3000),
      "Allow port 3000"
    );
    colorToRGBSecurtyGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      "Allow SSH"
    );

    // RDS Postgres
    const rdsPostgresDB = new rds.DatabaseInstance(this, "RDSPostgresDB", {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_11_14,
      }),
      databaseName: "colorToRGBPostgres",
      credentials: rds.Credentials.fromPassword(
        process.env.DBUSER!,
        SecretValue.plainText(process.env.DBPASSWORD!)
      ),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MEDIUM
      ),
      vpc: defaultVpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      publiclyAccessible: true,
    });
    rdsPostgresDB.connections.allowFromAnyIpv4(
      ec2.Port.tcp(5432),
      "Allow port 5432"
    );

    // Preparing environment variables
    const DBHOST = rdsPostgresDB.instanceEndpoint.hostname;
    const DBPORT = 5432;
    const DBNAME = "colorToRGBPostgres";
    const DBUSER = process.env.DBUSER;
    const DBPASSWORD = process.env.DBPASSWORD;

    // EC2 Instance
    const instanceUserData = ec2.UserData.forLinux();
    instanceUserData.addCommands(
      "sudo yum install git python37 -y",
      "pip3 install --upgrade pip",
      "cd ~",
      "git clone https://github.com/OkkarMin/aws-co2-emission-research.git",
      "cd aws-co2-emission-research/server-architecture-cdk/app",
      "pip3 install -r requirements.txt",
      `export DBHOST=${DBHOST} DBNAME=${DBNAME} DBUSER=${DBUSER} DBPASSWORD=${DBPASSWORD} DBPORT=${DBPORT}`,
      "nohup uvicorn --host 0.0.0.0 --port 3000 main:app &"
    );
    const instance = new ec2.Instance(this, "ColorToRGBInstance", {
      vpc: defaultVpc,
      securityGroup: colorToRGBSecurtyGroup,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MEDIUM
      ),
      machineImage: ec2.MachineImage.latestAmazonLinux({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      userData: instanceUserData,
      keyName: "okkar-ec2-transient-8-ap-southeast-1-kp",
    });
  }
}
