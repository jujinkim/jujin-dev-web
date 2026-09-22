# Graduated pricing

Each slice keeps its own unit price.

ID: graduated-pricing
Language: en
Revision: 2
Translation source revision: 2
Canonical: https://kickoff.jujin.dev/en/catalog/graduated-pricing/

## Why: the goal or problem

You want bulk discounts without repricing earlier usage whenever a threshold is crossed. Charge each band separately.

## How: work toward a solution

A fictional workspace has three seats and 120 monthly exports. The first 100 cost 0.20 each; later exports cost 0.10 each. Thus 100 × 0.20 + 20 × 0.10 = 22. Change usage: 100 costs 20, 101 costs 20.10 and zero costs zero. Taxes, fees, refunds and tier flat fees are omitted.

## What: the concept

Graduated pricing prices units within each tier separately and adds the subtotals. Reaching a cheaper tier does not reprice earlier units.

Compare volume pricing using the same thresholds.

[Source](https://docs.stripe.com/subscriptions/pricing-models/tiered-pricing)
