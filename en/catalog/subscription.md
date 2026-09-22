# Subscription

Recurring billing with explicit access policies.

ID: subscription
Language: en
Revision: 2
Translation source revision: 2
Canonical: https://kickoff.jujin.dev/en/catalog/subscription/

## Why: the goal or problem

A service provides ongoing value and incurs ongoing costs. A single sale may not match that continuing relationship.

## How: work toward a solution

A fictional export tool charges 12 monthly: three successful months total 36, with 100, 300 and 600 exports. Advance periods, disable renewal or simulate failure. Here cancellation ends access at the paid period boundary; failure pauses access until a successful retry. These are example policies. Taxes, fees and refunds are omitted.

## What: the concept

A subscription repeats billing over agreed periods. It can include usage charges; recurring does not mean flat-rate.

Specify renewal and failure handling; combine with usage metering when consumption varies.

[Source](https://docs.stripe.com/billing/subscriptions/overview)
