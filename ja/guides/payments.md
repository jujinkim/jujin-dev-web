# Payment channels, PG, and merchant of record

A payment button is the beginning of the paperwork.

ID: payments
Language: en
Revision: 3
Translation source revision: 3
Canonical: https://kickoff.jujin.dev/en/guides/payments/

## Why: the goal or problem

A customer reaches a success page but never receives access, or repeated notifications grant the same purchase twice. A checkout screen alone cannot establish a trustworthy sale. You need to connect an order, verified payment evidence and exactly the entitlement promised, while making sales and support responsibilities explicit.

## How: work toward a solution

1. Define the sale before integrating a button: product, price, currency, customer identity, access duration and refund behavior. Decide who is the contractual seller and who answers support requests. A payment processor and an outsourced seller do not take on identical responsibilities; examine the actual agreement.
2. Create an order on the trusted server using the agreed catalog price. Associate it with the provider's checkout or payment identifier. Browser-provided amounts and a visit to a success URL are not sufficient proof that the expected order was paid.
3. Receive the provider's verified event or query its trusted payment record. Check the order, currency, amount and relevant completion state. Some methods finish later, so show pending rather than granting access merely because the checkout flow returned. Follow the provider's authentication and event-verification procedure.
4. Make processing safe to repeat. Store which payment has produced which entitlement, and ensure concurrent or retried processing cannot grant it again. If recording access fails after payment, retain a recoverable state and retry that operation. Starting another charge is not a substitute for recovering fulfillment.
5. Exercise the difficult paths in a test environment: duplicate event, delayed success, failure, interrupted browser return and refund. Confirm both the payment record and the product's access record. A successful redirect test does not cover missed notifications, and a payment refund does not automatically implement your application's access policy.

Keep a support trail linking order, provider reference and entitlement state without exposing secrets. Define how an operator can identify a paid-but-unfulfilled order and recover it. Before release, verify supported products, countries and distribution channels against current agreements and platform rules. Do not infer obligations from the provider's marketing category alone.

Agree how long an order may stay pending and what support message customers see while an unresolved payment is investigated.

## What: the concept

A payment channel is a route, a processor handles payment, and a merchant of record is the seller for covered transactions. [Stripe's fulfillment guidance](https://docs.stripe.com/checkout/fulfillment) separates payment evidence from access delivery. [Lemon Squeezy](https://docs.lemonsqueezy.com/help/payments/merchant-of-record) describes its seller role; retained duties depend on the agreement. Sources checked 2026-09-23. These implementation checks do not replace a review of the actual sales arrangement.
