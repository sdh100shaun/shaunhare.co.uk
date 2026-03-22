# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Does

AWS CDK v2 TypeScript project that creates IAM resources enabling GitHub Actions to deploy to AWS S3 (and optionally invalidate CloudFront) using OIDC federation — no long-lived credentials required.

## Commands

```bash
npm run build    # Compile TypeScript → dist/
npm run synth    # Synthesize CloudFormation template (cdk.out/)
npm run diff     # Preview infrastructure changes vs deployed stack
npm run deploy   # Deploy to AWS
npm run destroy  # Tear down the stack
```

Deploy with context values:
```bash
# Minimal deploy
npx cdk deploy -c s3BucketArn=arn:aws:s3:::www.shaunhare.co.uk

# With CloudFront invalidation
npx cdk deploy -c s3BucketArn=... -c cloudfrontDistributionArn=arn:aws:cloudfront::123456789:distribution/ABCDEF

# Reuse existing OIDC provider (only 1 allowed per AWS account)
npx cdk deploy -c s3BucketArn=... -c existingOidcProviderArn=arn:aws:iam::123456789:oidc-provider/token.actions.githubusercontent.com
```

Bootstrap (first-time only): `npx cdk bootstrap aws://<ACCOUNT_ID>/<REGION>`

## Architecture

**Entry point:** `bin/infra.ts` — reads CDK context (`s3BucketArn`, `cloudfrontDistributionArn`, `existingOidcProviderArn`), validates required params, instantiates the stack.

**Stack:** `lib/github-deploy-role-stack.ts` — creates three resources:
1. **OIDC Provider** — `token.actions.githubusercontent.com` (can import existing via `existingOidcProviderArn` since only one is allowed per account)
2. **IAM Role** (`github-deploy-{repo-name}`) — trusted by GitHub Actions for a specific `org/repo`, with `StringLike` condition `repo:${org}/${repo}:*` (all refs). To restrict to main branch only, change to `repo:${org}/${repo}:ref:refs/heads/main`
3. **Inline policies** — S3 list/get/put/delete on the bucket; optional CloudFront `CreateInvalidation`

**Stack outputs:** `RoleArn` (add to GitHub repo secrets) and `OidcProviderArn` (for reuse).

**Context:** `cdk.context.json` is gitignored (contains account-specific ARNs). Pass values via `-c` flags or set them in the file locally.

## Key Constraints

- AWS allows only **one OIDC provider per URL per account**. Always pass `existingOidcProviderArn` if one already exists.
- The IAM role name is derived by replacing dots with hyphens in the repo name.
- There are no tests in this project.
