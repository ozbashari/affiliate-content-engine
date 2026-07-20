# Product Selection Rules

## Purpose

This document defines the business rules for selecting AliExpress products for publication in the Telegram channel.

The goal is to consistently publish products that are useful, trustworthy, visually understandable, relevant to a broad Israeli audience, and likely to attract attention and generate clicks.

The objective is not to find the perfect product.

The objective is to consistently publish the strongest available product from the current scan.

These rules define the product selection philosophy and should remain stable even if the implementation evolves over time.

---

# Core Selection Principle

Every selected product should immediately give the reader a reason to care.

The product should be understandable within a few seconds by looking at its title, image, and basic information.

Strong products usually satisfy one or more of the following:

- Solve a common everyday problem.
- Save time.
- Save money.
- Save space.
- Improve convenience.
- Feel clever or surprising.
- Make a good gift.
- Offer excellent value.
- Come from a recognizable brand.
- Are easy to explain in a short Telegram post.

Popularity alone is never enough.

A product with thousands of orders may still be a poor publication if it is generic, confusing, visually weak, overly technical, or relevant only to a very small audience.

---

# Hard Requirements

A product must meet all of the following before entering the selection process.

- Valid product ID.
- Product title.
- Product image.
- Product page URL.
- Sale price greater than zero.
- Supported currency.
- Supported product source.

Before publication the system must also be able to:

- Generate a valid affiliate URL.
- Generate an accurate Telegram post.
- Verify that the product has not already been published.

Products that fail any hard requirement must never be published.

---

# Rejected Products

The following products should normally be rejected.

## Generic Low-Value Products

- Generic USB cables.
- Generic adapters.
- Basic phone cases.
- Basic screen protectors.
- Generic replacement batteries.
- Products that provide no obvious value compared to similar alternatives.

These products may still qualify if they provide a clear unique advantage.

---

## Spare Parts

Reject products that are primarily intended as:

- Spare parts.
- Repair parts.
- Internal electronic components.
- Replacement components.
- Mechanical parts.
- Individual connectors.
- Individual switches.
- Small installation hardware.

Unless the product has broad consumer appeal.

---

## Restricted Products

Never publish:

- Weapons.
- Adult products.
- Counterfeit products.
- Illegal products.
- Prescription products.
- Medical treatments.
- Supplements.
- Unverified cosmetics.

---

## Compatibility Risks

Avoid products when:

- Compatibility is unclear.
- The product only fits a very specific model.
- Voltage or plug compatibility is uncertain.
- Important information is missing.

---

# Preferred Product Characteristics

Prefer products that:

- Solve a real problem.
- Can be understood immediately.
- Look visually attractive.
- Have broad audience appeal.
- Create curiosity.
- Encourage impulse clicks.
- Feel useful.
- Feel like good value.
- Can be explained in one short Telegram post.

---

# Trust Signals

The following signals increase confidence in a product.

- High customer rating.
- Strong sales history.
- Trusted brand.
- Clear product images.
- Reliable seller.
- Honest description.
- Reasonable discount.
- Positive reviews.

Suggested MVP thresholds:

- Rating: 4.6+
- Sales: 50+
- Clear product image.

These are preferences, not mandatory rules.

---

# Preferred Categories

High Priority

- Home
- Kitchen
- Consumer Electronics
- Mobile Accessories
- Charging
- Car Accessories
- Smart Home
- Office
- Outdoor
- Camping
- Travel
- Kids
- Baby
- Pets
- Gaming Accessories

Medium Priority

- Sports
- Seasonal Products
- Gifts
- Storage
- Hobby Products

Low Priority

- Fashion
- Jewelry
- Beauty
- Industrial Components
- Model-specific Replacement Parts

Priority does not automatically determine selection.

---

# Product Diversity

The channel should remain varied.

Avoid publishing many products from the same category consecutively.

Instead of publishing:

- Charger
- Charger
- Charger
- Power Bank

Prefer:

- Home
- Kitchen
- Electronics
- Car
- Gadget
- Outdoor

Diversity improves the reader experience.

---

# Value Philosophy

The goal is not to find the cheapest product.

The goal is to find products that deliver obvious value.

A $50 product may be stronger than a $10 product if its usefulness is significantly greater.

Large discounts should never be the primary reason for selection.

---

# Selection Strategy

For the MVP:

1. Remove products that fail Hard Requirements.
2. Remove Rejected Products.
3. Prefer products with strong Trust Signals.
4. Prefer products with strong Product Characteristics.
5. Prefer category diversity.
6. Publish the strongest remaining product.

---

# Future Improvements

Future versions may introduce scoring based on real performance.

Potential future signals include:

- Click-through rate.
- Link clicks.
- Revenue.
- Category performance.
- Brand performance.
- Price range performance.
- Time-of-day performance.
- Historical engagement.

Business decisions should eventually be based on production data rather than assumptions.