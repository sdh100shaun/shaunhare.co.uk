import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'

export interface GithubDeployRoleStackProps extends cdk.StackProps {
  /** GitHub org or user, e.g. "sdh100shaun" */
  githubOrg: string
  /** GitHub repo name, e.g. "shaunhare.co.uk" */
  githubRepo: string
  /** Full ARN of the S3 bucket to deploy into */
  s3BucketArn: string
  /**
   * Full ARN of the CloudFront distribution.
   * Only needed if you want the role to be able to create invalidations.
   * Format: arn:aws:cloudfront::<account>:distribution/<id>
   */
  cloudfrontDistributionArn?: string
  /**
   * ARN of an existing GitHub Actions OIDC provider in this account.
   * Only one provider is allowed per account. If one already exists pass
   * its ARN here and this stack will import it rather than create a new one.
   * Format: arn:aws:iam::<account>:oidc-provider/token.actions.githubusercontent.com
   */
  existingOidcProviderArn?: string
}

export class GithubDeployRoleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: GithubDeployRoleStackProps) {
    super(scope, id, props)

    // ── OIDC Provider ──────────────────────────────────────────────────────
    // Only one OIDC provider for token.actions.githubusercontent.com is
    // allowed per AWS account. If one already exists pass existingOidcProviderArn
    // and this stack will import it; otherwise a new one will be created.
    const provider = props.existingOidcProviderArn
      ? iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(
          this,
          'GithubOidcProvider',
          props.existingOidcProviderArn,
        )
      : new iam.OpenIdConnectProvider(this, 'GithubOidcProvider', {
          url: 'https://token.actions.githubusercontent.com',
          // AWS manages thumbprints automatically for GitHub Actions —
          // an empty list is intentional here.
          clientIds: ['sts.amazonaws.com'],
          thumbprints: [],
        })

    // ── IAM Role ───────────────────────────────────────────────────────────
    const role = new iam.Role(this, 'GithubDeployRole', {
      roleName: `github-deploy-${props.githubRepo.replace(/\./g, '-')}`,
      description: `Assumed by GitHub Actions for ${props.githubOrg}/${props.githubRepo} deployments`,
      assumedBy: new iam.WebIdentityPrincipal(provider.openIdConnectProviderArn, {
        StringEquals: {
          'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
        },
        // Scoped to any ref (branch/tag/release) in the specific repo.
        // Narrow to `ref:refs/heads/main` if you want only the main branch.
        StringLike: {
          'token.actions.githubusercontent.com:sub':
            `repo:${props.githubOrg}/${props.githubRepo}:*`,
        },
      }),
      maxSessionDuration: cdk.Duration.hours(1),
    })

    // ── S3 Permissions ─────────────────────────────────────────────────────
    role.addToPolicy(
      new iam.PolicyStatement({
        sid: 'S3BucketList',
        effect: iam.Effect.ALLOW,
        actions: ['s3:ListBucket'],
        resources: [props.s3BucketArn],
      }),
    )

    role.addToPolicy(
      new iam.PolicyStatement({
        sid: 'S3ObjectReadWrite',
        effect: iam.Effect.ALLOW,
        actions: ['s3:GetObject', 's3:PutObject', 's3:DeleteObject'],
        resources: [`${props.s3BucketArn}/*`],
      }),
    )

    // ── CloudFront Permissions (optional) ──────────────────────────────────
    if (props.cloudfrontDistributionArn) {
      role.addToPolicy(
        new iam.PolicyStatement({
          sid: 'CloudFrontInvalidation',
          effect: iam.Effect.ALLOW,
          actions: ['cloudfront:CreateInvalidation'],
          resources: [props.cloudfrontDistributionArn],
        }),
      )
    }

    // ── Outputs ────────────────────────────────────────────────────────────
    new cdk.CfnOutput(this, 'RoleArn', {
      value: role.roleArn,
      description: 'Set as AWS_ROLE_ARN in GitHub repository secrets',
    })

    new cdk.CfnOutput(this, 'OidcProviderArn', {
      value: provider.openIdConnectProviderArn,
      description: 'Pass as existingOidcProviderArn if deploying other stacks in this account',
    })
  }
}
