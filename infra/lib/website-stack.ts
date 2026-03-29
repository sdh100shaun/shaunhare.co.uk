import * as cdk from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import { Construct } from 'constructs'

export interface WebsiteStackProps extends cdk.StackProps {
  /** Apex domain, e.g. "shaunhare.co.uk" */
  domainName: string
  /**
   * Name of an existing S3 bucket to use.
   * If omitted a new bucket named "www.<domainName>" is created.
   */
  existingBucketName?: string
}

export class WebsiteStack extends cdk.Stack {
  /** The S3 bucket holding the built site assets. */
  public readonly bucket: s3.IBucket
  /** The CloudFront distribution serving the site. */
  public readonly distribution: cloudfront.Distribution

  constructor(scope: Construct, id: string, props: WebsiteStackProps) {
    super(scope, id, props)

    // ── S3 Bucket ──────────────────────────────────────────────────────────
    // Import an existing bucket when existingBucketName is supplied; otherwise
    // create a new private bucket. OAC (below) handles access either way.
    this.bucket = props.existingBucketName
      ? s3.Bucket.fromBucketName(this, 'WebsiteBucket', props.existingBucketName)
      : new s3.Bucket(this, 'WebsiteBucket', {
          bucketName: `www.${props.domainName}`,
          blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
          removalPolicy: cdk.RemovalPolicy.RETAIN,
        })

    // ── CloudFront Function — clean-URL rewriting ──────────────────────────
    // VitePress with cleanUrls:true builds "about.html" but serves it at "/about".
    // Without this function CloudFront requests the S3 key "about" which doesn't
    // exist, causing a 403 AccessDenied response from the private bucket.
    //
    // Rewrites:
    //   /about        → /about.html
    //   /blog/        → /blog/index.html
    //   /             → /index.html  (also handled by defaultRootObject, belt+braces)
    const urlRewriteFn = new cloudfront.Function(this, 'UrlRewriteFn', {
      functionName: `${props.domainName.replace(/\./g, '-')}-url-rewrite`,
      runtime: cloudfront.FunctionRuntime.JS_2_0,
      code: cloudfront.FunctionCode.fromInline(`
function handler(event) {
  var uri = event.request.uri;

  if (uri === '/') {
    event.request.uri = '/index.html';
  } else if (uri.endsWith('/')) {
    event.request.uri = uri.slice(0, -1) + '.html';
  } else if (!uri.includes('.', uri.lastIndexOf('/'))) {
    event.request.uri = uri + '.html';
  }

  return event.request;
}
      `.trim()),
    })

    // ── CloudFront Distribution ────────────────────────────────────────────
    this.distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        // OAC — the modern replacement for OAI. Grants CloudFront read access
        // to the private bucket and automatically writes the bucket policy.
        origin: origins.S3BucketOrigin.withOriginAccessControl(this.bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        functionAssociations: [
          {
            function: urlRewriteFn,
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          },
        ],
      },
      // If S3 returns 403 for a genuinely missing file, serve the VitePress
      // 404 page rather than leaking the raw S3 XML error to the browser.
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 404,
          responsePagePath: '/404.html',
          ttl: cdk.Duration.seconds(0),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 404,
          responsePagePath: '/404.html',
          ttl: cdk.Duration.seconds(0),
        },
      ],
    })

    // ── Outputs ────────────────────────────────────────────────────────────
    new cdk.CfnOutput(this, 'BucketName', {
      value: this.bucket.bucketName,
      description: 'Set as S3_BUCKET in GitHub repository secrets',
    })

    new cdk.CfnOutput(this, 'BucketArn', {
      value: this.bucket.bucketArn,
      description: 'Pass as s3BucketArn when deploying ShaunHareDeployRole',
    })

    new cdk.CfnOutput(this, 'DistributionId', {
      value: this.distribution.distributionId,
      description: 'Set as CLOUDFRONT_DISTRIBUTION_ID in GitHub repository secrets',
    })

    new cdk.CfnOutput(this, 'DistributionArn', {
      value: `arn:aws:cloudfront::${this.account}:distribution/${this.distribution.distributionId}`,
      description: 'Pass as cloudfrontDistributionArn when deploying ShaunHareDeployRole',
    })

    new cdk.CfnOutput(this, 'DistributionDomain', {
      value: this.distribution.distributionDomainName,
      description: 'Point your DNS CNAME (or ALIAS) at this CloudFront domain',
    })
  }
}
