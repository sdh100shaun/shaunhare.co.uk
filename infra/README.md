# infra

CDK stack that creates the IAM role assumed by GitHub Actions via OIDC when
deploying the site to S3. No long-lived credentials are stored anywhere.

## What it creates

| Resource | Details |
|---|---|
| `AWS::IAM::OIDCProvider` | GitHub Actions OIDC provider (one per account; importable if it already exists) |
| `AWS::IAM::Role` | `github-deploy-shaunhare-co-uk` — trusted only by this repo's Actions workflows |
| Inline policy | `s3:ListBucket`, `s3:GetObject`, `s3:PutObject`, `s3:DeleteObject` on the site bucket; `cloudfront:CreateInvalidation` if a distribution ARN is supplied |

## Prerequisites

- Node.js 22+
- AWS CLI configured (`aws configure` or environment variables)
- The IAM user/role running the deploy needs permission to create IAM roles,
  OIDC providers, and read CloudFormation stacks
- CDK bootstrapped in the target account/region (one-time, see below)

## First-time bootstrap

CDK needs a small amount of infrastructure in your account before it can deploy
(an S3 bucket and ECR repo for assets). Run this once per account/region:

```bash
cd infra
npm install
npx cdk bootstrap aws://<ACCOUNT_ID>/<REGION>
```

## Deploy

### Minimal (no CloudFront)

```bash
cd infra
npm install
npx cdk deploy -c s3BucketArn=arn:aws:s3:::your-bucket-name
```

### With CloudFront invalidation

```bash
npx cdk deploy \
  -c s3BucketArn=arn:aws:s3:::your-bucket-name \
  -c cloudfrontDistributionArn=arn:aws:cloudfront::<ACCOUNT_ID>:distribution/<DIST_ID>
```

### OIDC provider already exists in this account

If you have already deployed a GitHub Actions OIDC provider (e.g. for another
project), pass its ARN to avoid a duplicate-provider error:

```bash
npx cdk deploy \
  -c s3BucketArn=arn:aws:s3:::your-bucket-name \
  -c existingOidcProviderArn=arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com
```

To check whether one already exists in your account:

```bash
aws iam list-open-id-connect-providers \
  --query 'OpenIDConnectProviderList[*].Arn' \
  --output text
```

## After deploying

The stack outputs the role ARN:

```
Outputs:
ShaunHareDeployRole.RoleArn = arn:aws:iam::<ACCOUNT_ID>:role/github-deploy-shaunhare-co-uk
```

Copy that value and add it as a repository secret in GitHub:

| Secret name | Value |
|---|---|
| `AWS_ROLE_ARN` | `arn:aws:iam::<ACCOUNT_ID>:role/github-deploy-shaunhare-co-uk` |

Also set these in **Settings → Secrets and variables → Actions**:

| Type | Name | Value |
|---|---|---|
| Secret | `S3_BUCKET` | your bucket name (without `s3://`) |
| Secret | `CLOUDFRONT_DISTRIBUTION_ID` | distribution ID (optional) |
| Variable | `AWS_REGION` | e.g. `eu-west-1` |

## Useful commands

```bash
# Preview changes without deploying
npx cdk diff -c s3BucketArn=arn:aws:s3:::your-bucket-name

# Print the CloudFormation template
npx cdk synth -c s3BucketArn=arn:aws:s3:::your-bucket-name

# Tear down (does not delete your S3 bucket or CloudFront distribution)
npx cdk destroy
```

## Narrowing the trust policy

By default the role can be assumed by any ref in this repo (branches, tags,
pull requests). To restrict it to the `main` branch only, edit
`lib/github-deploy-role-stack.ts` and change the `StringLike` condition:

```typescript
StringLike: {
  'token.actions.githubusercontent.com:sub':
    'repo:sdh100shaun/shaunhare.co.uk:ref:refs/heads/main',
},
```

This is the recommended setting once you have verified everything is working.
