#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { GithubDeployRoleStack } from '../lib/github-deploy-role-stack'

const app = new cdk.App()

// Context values can be supplied at synth/deploy time with -c key=value,
// or persisted in cdk.context.json after the first `cdk synth`.
const s3BucketArn = app.node.tryGetContext('s3BucketArn') as string | undefined
const cloudfrontDistributionArn = app.node.tryGetContext('cloudfrontDistributionArn') as
  | string
  | undefined
const existingOidcProviderArn = app.node.tryGetContext('existingOidcProviderArn') as
  | string
  | undefined

if (!s3BucketArn) {
  throw new Error(
    'Required context missing: s3BucketArn\n' +
      'Pass it with: cdk deploy -c s3BucketArn=arn:aws:s3:::your-bucket-name',
  )
}

new GithubDeployRoleStack(app, 'ShaunHareDeployRole', {
  githubOrg: 'sdh100shaun',
  githubRepo: 'shaunhare.co.uk',
  s3BucketArn,
  cloudfrontDistributionArn,
  existingOidcProviderArn,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
})
