#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { GithubDeployRoleStack } from '../lib/github-deploy-role-stack'
import { WebsiteStack } from '../lib/website-stack'

const app = new cdk.App()

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
}

// ── Website Stack ─────────────────────────────────────────────────────────────
// Creates the CloudFront distribution and URL-rewrite function.
// Pass existingBucketName to use a pre-existing bucket (recommended):
//   cdk deploy -c existingBucketName=www.shaunhare.co.uk
const existingBucketName = app.node.tryGetContext('existingBucketName') as string | undefined

const website = new WebsiteStack(app, 'ShaunHareWebsite', {
  domainName: 'shaunhare.co.uk',
  existingBucketName,
  env,
})

// ── GitHub Deploy Role Stack ──────────────────────────────────────────────────
// ARNs are taken from the WebsiteStack by default. You can override them with
// -c flags if you need to point at a pre-existing bucket or distribution.
const s3BucketArn =
  (app.node.tryGetContext('s3BucketArn') as string | undefined) ?? website.bucket.bucketArn

const cloudfrontDistributionArn =
  (app.node.tryGetContext('cloudfrontDistributionArn') as string | undefined) ??
  `arn:aws:cloudfront::${env.account}:distribution/${website.distribution.distributionId}`

const existingOidcProviderArn = app.node.tryGetContext('existingOidcProviderArn') as
  | string
  | undefined

new GithubDeployRoleStack(app, 'ShaunHareDeployRole', {
  githubOrg: 'sdh100shaun',
  githubRepo: 'shaunhare.co.uk',
  s3BucketArn,
  cloudfrontDistributionArn,
  existingOidcProviderArn,
  env,
})
