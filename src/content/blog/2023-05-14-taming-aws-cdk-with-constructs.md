---
title: Taming AWS CDK with Constructs
date: 2023-05-14
---

After spending a year writing raw CloudFormation and another year copy-pasting CDK snippets across stacks, I've settled on a pattern that keeps infrastructure code maintainable: building a library of custom constructs.

## What a construct is

In CDK, a *construct* is just a class that extends `Construct`. Everything from a single S3 bucket to an entire VPC is a construct. The key insight is that you can compose low-level constructs into higher-level ones, just like you compose React components.

## The problem with raw stacks

A stack full of inline resource definitions quickly becomes a wall of code. Worse, the same pattern (e.g. "an SQS queue with a dead-letter queue and an alarm") gets copy-pasted across stacks and diverges over time.

## Building a reusable construct

```typescript
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { Duration } from 'aws-cdk-lib';

export interface ReliableQueueProps {
  visibilityTimeout?: Duration;
  alarmThreshold?: number;
}

export class ReliableQueue extends Construct {
  public readonly queue: sqs.Queue;
  public readonly dlq: sqs.Queue;

  constructor(scope: Construct, id: string, props: ReliableQueueProps = {}) {
    super(scope, id);

    this.dlq = new sqs.Queue(this, 'Dlq', {
      retentionPeriod: Duration.days(14),
    });

    this.queue = new sqs.Queue(this, 'Queue', {
      visibilityTimeout: props.visibilityTimeout ?? Duration.seconds(30),
      deadLetterQueue: {
        queue: this.dlq,
        maxReceiveCount: 3,
      },
    });

    const dlqAlarm = new cloudwatch.Alarm(this, 'DlqAlarm', {
      metric: this.dlq.metricNumberOfMessagesSent(),
      threshold: props.alarmThreshold ?? 1,
      evaluationPeriods: 1,
    });
  }
}
```

Now in any stack:

```typescript
const orderQueue = new ReliableQueue(this, 'OrderQueue', {
  visibilityTimeout: Duration.minutes(5),
});
```

One line. Consistent defaults. Alarm included.

## Sharing across stacks

Once the construct is in a dedicated package (e.g. `@myorg/cdk-constructs`), every team can install it as a dependency. Upgrades propagate via normal package management, and breaking changes surface at compile time.

```json
{
  "dependencies": {
    "@myorg/cdk-constructs": "^1.4.0"
  }
}
```

## Tips

- **Keep props minimal** — only expose what callers actually need to change. Every new prop is API surface you have to maintain.
- **Expose child constructs** — make `queue` and `dlq` public so callers can grant permissions or hook in other resources.
- **Write snapshot tests** — `expect(stack).toMatchSnapshot()` catches unintended changes to generated CloudFormation.

CDK constructs are one of those patterns that feel like overhead until the third time you need the same resource combination. Then you can't imagine working without them.
