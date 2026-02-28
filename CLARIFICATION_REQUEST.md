# CLARIFICATION REQUEST: `processSubscription` behavior

## 1. Background
The repository contains a `SubscriptionService` with a function:

```ts
processSubscription(userId: string, planId: string)
```

This function is currently a stub (`// TODO: implement subscription logic`) and there is no documentation in the README, source comments, or existing tests that explain its intended behavior.

## 2. Observed Ambiguity
While inspecting the codebase, the following uncertainties were identified:

- It is not clear whether `processSubscription` should immediately charge the user or simply create a subscription record.
- There is no visible mechanism for handling trial plans (if they exist), trial periods, or trial-to-paid transitions.
- The behavior when a user already has an active subscription is undefined.
- It is unknown whether the function is expected to be idempotent (safe to call multiple times with the same inputs).

## 3. Specific Clarification Questions
1. **Intent & Scope**
   1.1. Should `processSubscription` perform an immediate payment capture/charge, or only create/update a subscription record and defer payment processing to another service?  
   1.2. Is this function responsible for interacting with an external billing gateway (Stripe, PayPal, etc.), or is that handled elsewhere?

2. **Trial Plans**
   2.1. Are there subscription plans that include a trial period?  
   2.2. If so, should `processSubscription` create a trial state (e.g., `trialing`) without charging, and if so, how is the trial duration defined?  
   2.3. What should happen when a trial ends—does this function need to schedule a transition or notify another process?

3. **Existing Active Subscription**
   3.1. What is the expected behavior if `userId` already has an active subscription?  
   3.2. Should `processSubscription` reject the request, replace the existing subscription, extend it, or create a separate subscription record?  
   3.3. Are there specific status values (e.g., `active`, `paused`, `cancelled`) that the service must enforce when updating an existing subscription?

4. **Idempotency & Safe Re-tries**
   4.1. Is `processSubscription` expected to be idempotent when called multiple times with the same `userId` and `planId`?  
   4.2. If called repeatedly (e.g., due to retries in an asynchronous workflow), should it return the same result, no-op, or produce an error?

## 4. Risk of Proceeding Without Clarification
- Implementing the function without clear requirements could lead to incorrect billing behavior (e.g., double charges or missed charges).
- Misinterpreting trial logic could result in unauthorized access to paid features or accidental revenue loss.
- Undefined behavior for existing subscriptions may cause data corruption, inconsistent user state, or billing disputes.
- Without idempotency guarantees, retry logic in higher-level workflows may cause duplicate side effects.

## 5. Suggested Documentation Improvements
- Add a section to the README (or dedicated design doc) describing the subscription lifecycle, including:
  - What `processSubscription` is responsible for (billing, record creation, status transitions).
  - How trial plans are represented and handled.
  - Expected state transitions for existing subscriptions (e.g., upgrade, downgrade, renew).
- Add unit/integration tests that codify the expected behavior for:
  - New subscription creation (paid vs trial)
  - Re-processing an existing subscription request
  - Handling of invalid or conflicting states
  - Idempotency expectations
