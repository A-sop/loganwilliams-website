# Pricing Strategy

**Status:** Draft — In Progress  
**Last Updated:** 2026-02-09  
**Purpose:** Complete pricing strategy document covering philosophy, tiers, implementation considerations, and communication plan.

---

## 1. Pricing Philosophy

### Why We Charge From Day One

Charging from day one validates real demand. If someone pays for your product, you've validated that:
- The problem is real enough to pay for
- Your solution is valuable enough to justify the price
- You have real demand, not just interest

**Key Principles:**
- **Validation Test:** Charging from day one is your validation test. If someone pays $X/month for your product, you've validated real demand.
- **Avoid Free Products:** Free products attract users who have no commitment, cost you money without generating revenue, rarely convert to paying customers, and don't validate demand.
- **Rob Walling Philosophy:** Founder of TinySeed and organizer of MicroConf advocates charging from day one to validate real demand. Building without charging is like cooking a meal without knowing if anyone is hungry.

**References:**
- Rob Walling (TinySeed, MicroConf) — extensive content on charging from day one
- MicroConf YouTube channel — talks and discussions on this topic

### Freemium vs Free Trials

**Why We Avoid Freemium:**
- Lack of commitment: Free users have no skin in the game
- High infrastructure costs: Free users cost money to serve without generating revenue
- Low conversion rates: Converting free users to paid is extremely difficult (often 1-5%)
- Diluted focus: Free users demand features you might not want to build

**Why Free Trials Work Better:**
- **Time-Limited Trials (e.g., 7 days, 14 days):**
  - Creates urgency — users know they need to evaluate before trial ends
  - Requires commitment — user must provide payment method
  - Clear conversion path — trial ends, subscription begins
  - Validates demand — if someone starts a trial, they're interested enough to pay

- **Usage-Limited Trials (e.g., "5 widgets free, then pay"):**
  - Users experience value before hitting limit
  - Natural upgrade moment when they hit the limit
  - Clear value proposition — they've used it, now they pay to continue

**Our Approach:**
- **Day One:** Paid pricing only + compelling demo that shows value
- **Later:** Add time-limited or usage-limited free trials once we have product-market fit
- **Never:** Freemium (permanent free plan)

---

## 2. Estimated Customer Value & Value-Based Price Range

**Note:** [LDW] — Requires human input to estimate customer value based on:
- Alternative solutions and their cost
- Time saved per month (hours) and typical hourly rate
- Risk / opportunity cost avoided

**Placeholder Calculations:**
- Customer value estimation: TBD
- Value-based price range: TBD (target: 5-20% of value created)

---

## 3. Pricing Tiers

**Note:** [LDW] — Requires human input to define:
- Tier names (e.g., Starter, Pro, Executive)
- Monthly USD prices for each tier
- Feature mapping to tiers
- Target user for each tier

**Placeholder Structure:**
- **Tier 1 (Starter):** TBD price — Core features for single executive/small operator
- **Tier 2 (Pro):** TBD price — Power features, advanced workflow, deeper automation
- **Tier 3 (Enterprise/Team):** TBD price — Multi-user, higher limits, priority support, compliance

---

## 4. Implementation Considerations

### Standard SaaS Patterns (✅ Recommended for MVP)

- ✅ **Recurring subscriptions:** Monthly or annual billing cycles (most common SaaS pattern)
- ✅ **Tiered plans:** 2-3 clear tiers with feature-based differentiation (Starter, Pro, Enterprise)
- ✅ **Free trials:** Time-limited trials (e.g., 7 days, 14 days) that convert to paid subscriptions
- ✅ **Usage-limited trials:** Allow a certain number of uses for free, then require payment
- ✅ **Single currency:** Start with one currency (typically USD) to keep implementation simple
- ✅ **Feature-based tiers:** Different plans unlock different features (easier to implement than usage-based)

### Patterns to Avoid for MVP (⚠️ Save for Later)

- ⚠️ **Multi-currency pricing:** Requires additional complexity in billing setup (start with one currency)
- ⚠️ **Custom pricing per customer:** Enterprise deals with unique pricing require manual setup or custom development
- ⚠️ **Usage-based/metered billing:** Charging based on usage requires tracking and calculating usage—more complex than fixed tiers
- ⚠️ **Per-seat pricing:** Variable pricing based on number of users requires seat tracking (can add later)
- ⚠️ **Complex tax handling:** Multiple tax jurisdictions add complexity (start simple)

### Why This Matters

Standard pricing patterns are:
- **Faster to implement** (you'll set up billing in later lessons)
- **Easier to maintain** (less custom code)
- **More familiar to users** (they understand tiered subscriptions)
- **Easier to explain** (clear value proposition)
- **Lower risk** (proven patterns work)

You can always add advanced features later (multi-currency, usage-based billing, custom pricing) once you have revenue and validated demand. For now, focus on getting to revenue with simple, clear pricing.

---

## 5. Communication Plan

**Note:** [LDW] — Requires human input to define:
- Key messaging for pricing page
- Value propositions for each tier
- How to explain pricing to users

**Placeholder:**
- Pricing page messaging: TBD
- Value statements: TBD
- User communication: TBD

---

## Next Steps

1. [LDW] Complete customer value estimation (Section 2)
2. [LDW] Define pricing tiers with feature mapping (Section 3)
3. [LDW] Create communication plan (Section 5)
4. Review pricing against easy-to-implement patterns (Section 4) — ✅ Complete
5. Document complete pricing strategy — In progress

---

**Related Issues:**
- A-26: Pricing Philosophy (✅ Complete)
- A-27: Value-Based Pricing — [LDW] Requires human input
- A-28: Design Pricing Tiers — [LDW] Requires human input
- A-29: Ensure Pricing Uses Simple Patterns (✅ Complete)
- A-30: Write Complete Pricing Strategy Document (In progress)
