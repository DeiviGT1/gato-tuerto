import React from "react";
import "./ReturnPolicy.css";

export default function ReturnPolicy() {
  return (
    <main className="return-policy">
      <div className="rp-container">
        {/* Header */}
        <header>
          <a href="/" className="rp-back" aria-label="Return Home">
            ← Return Home
          </a>
          <span className="rp-date">Effective: August 20, 2025</span>
        </header>

        {/* Title */}
        <h1>Return & Refund Policy</h1>
        <p>
          El Gato Tuerto Liquor Store (the “Company,” “we,” “our,” or “us”) sells alcoholic
          beverages for off-premise consumption to customers who are 21 years of age or older.
          This Return & Refund Policy (the “Policy”) governs purchases made in-store and, where
          offered, local delivery or pickup within Florida.
        </p>

        {/* All Sales Final */}
        <section>
          <h2>1) All Sales Final — No Returns, Exchanges, or Refunds</h2>
          <p>
            Due to the nature of alcoholic beverages and for health, safety, and regulatory reasons,
            <span style={{ fontWeight: 600 }}> all sales are final</span>. We do not accept returns, exchanges, or provide refunds
            after an order has been tendered (including curbside and delivery hand-off). This applies to
            unopened, opened, and partially consumed items, as well as change-of-mind, taste
            preference, or over-purchase situations.
          </p>
        </section>

        {/* Legally Required Carve-Outs */}
        <section>
          <h2>2) Narrow Exceptions Where Required by Law</h2>
          <p>
            We comply with applicable Florida law. In limited circumstances required by law, we will
            assess an appropriate remedy (which may include replacement of the same item or a refund):
          </p>
          <ul>
            <li>
              <strong>Product recall or manufacturer/distributor directive.</strong> If a product is subject to an
              official recall or directive making it unlawful or unsafe to sell or consume, we will follow the
              instructions provided by the issuing authority.
            </li>
            <li>
              <strong>Verified safety or quality defect present at the time of sale.</strong> If, consistent with
              applicable law, an item is determined to be unsafe, adulterated, or otherwise unfit for
              consumption at the time of sale, we will offer a remedy consistent with legal guidance.
              Sensory preferences (e.g., “corked,” “do not like the taste”) are not defects.
            </li>
            <li>
              <strong>Incorrect charge or fulfilment error.</strong> If we charged you incorrectly or fulfilled a different
              item than shown on the receipt, we will correct the error.
            </li>
          </ul>
          <p>
            Nothing in this Policy limits any non-waivable rights you may have under Florida law.
          </p>
        </section>

        {/* Florida Posting Requirement */}
        <section>
          <h2>3) Florida Posting Requirement</h2>
          <p>
            In accordance with Florida Statutes § 501.142, our <strong>“ALL SALES FINAL — NO REFUNDS OR
            EXCHANGES”</strong> notice is conspicuously posted at the point of sale. If you request a copy of
            this Policy, we will provide it in writing.
          </p>
          <div className="rp-notice">
            ALL SALES FINAL — NO REFUNDS OR EXCHANGES
          </div>
        </section>

        {/* How to Request Help */}
        <section>
          <h2>4) Requesting Help for the Narrow Exceptions</h2>
          <p>
            If you believe your situation falls within the legal carve-outs above, please contact us within
            48 hours of purchase or delivery and do not dispose of the product until instructed. Bring a
            valid, itemized receipt and the product in its original packaging (if applicable). We may
            request reasonable documentation or evidence to evaluate your request.
          </p>
        </section>

        {/* Online Orders / Cancellations */}
        <section>
          <h2>5) Online Orders & Cancellations</h2>
          <p>
            Orders may be canceled before payment is captured and fulfillment begins. Once payment is
            captured or the order is prepared for pickup/delivery, the transaction is final.
          </p>
        </section>

        {/* Age & Compliance */}
        <section>
          <h2>6) Age Verification & Compliance</h2>
          <p>
            You must be 21+ with valid, unexpired government-issued photo ID at the time of purchase or
            delivery hand-off. We reserve the right to refuse or cancel any order where age/capacity cannot
            be verified, where prohibited by law, or where fraud is suspected. In such cases, if payment has
            been taken, we will process a refund.
          </p>
        </section>

        {/* Governing Law */}
        <section>
          <h2>7) Governing Law</h2>
          <p>
            This Policy is governed by the laws of the State of Florida. Venue for any dispute shall lie in
            the state courts of the county where the purchase occurred, unless otherwise required by law.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2>Contact</h2>
          <p>
            El Gato Tuerto Liquor Store<br />
            476 SW 8th St, Miami, FL 33120<br />
            Phone: (305) 854-8576 • Email: 1eyecat1@gmail.com
          </p>
        </section>

        <footer>
          This page is provided for general informational purposes and does not constitute legal advice.
          Policy subject to change without notice.
        </footer>
      </div>
    </main>
  );
}