import React from "react";

/**
 * El Gato Tuerto Liquor Store — Return Policy Page
 * Effective Date: August 20, 2025
 *
 * Notes:
 * - This policy is written to be "all sales final" while acknowledging legal carve‑outs.
 * - Florida retailers that offer no refunds/exchanges must POST a conspicuous sign at the point of sale (F.S. 501.142).
 */

export default function ReturnPolicy() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-3xl px-4 pb-24 pt-10">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between gap-4">
          <a
            href="/"
            className="inline-flex items-center rounded-2xl border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-neutral-100"
            aria-label="Return Home"
          >
            ← Return Home
          </a>
          <span className="text-xs text-neutral-500">Effective: August 20, 2025</span>
        </header>

        {/* Title */}
        <h1 className="text-3xl font-semibold tracking-tight">Return & Refund Policy</h1>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          El Gato Tuerto Liquor Store (the “Company,” “we,” “our,” or “us”) sells alcoholic
          beverages for off‑premise consumption to customers who are 21 years of age or older.
          This Return & Refund Policy (the “Policy”) governs purchases made in‑store and, where
          offered, local delivery or pickup within Florida.
        </p>

        {/* All Sales Final */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold">1) All Sales Final — No Returns, Exchanges, or Refunds</h2>
          <p className="mt-2 text-neutral-700">
            Due to the nature of alcoholic beverages and for health, safety, and regulatory reasons,
            <span className="font-semibold"> all sales are final</span>. We do not accept returns, exchanges, or provide refunds
            after an order has been tendered (including curbside and delivery hand‑off). This applies to
            unopened, opened, and partially consumed items, as well as change‑of‑mind, taste
            preference, or over‑purchase situations.
          </p>
        </section>

        {/* Legally Required Carve‑Outs */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold">2) Narrow Exceptions Where Required by Law</h2>
          <p className="mt-2 text-neutral-700">
            We comply with applicable Florida law. In limited circumstances required by law, we will
            assess an appropriate remedy (which may include replacement of the same item or a refund):
          </p>
          <ul className="ml-5 mt-3 list-disc space-y-2 text-neutral-700">
            <li>
              <span className="font-medium">Product recall or manufacturer/distributor directive.</span> If a product is subject to an
              official recall or directive making it unlawful or unsafe to sell or consume, we will follow the
              instructions provided by the issuing authority.
            </li>
            <li>
              <span className="font-medium">Verified safety or quality defect present at the time of sale.</span> If, consistent with
              applicable law, an item is determined to be unsafe, adulterated, or otherwise unfit for
              consumption at the time of sale, we will offer a remedy consistent with legal guidance.
              Sensory preferences (e.g., “corked,” “do not like the taste”) are not defects.
            </li>
            <li>
              <span className="font-medium">Incorrect charge or fulfilment error.</span> If we charged you incorrectly or fulfilled a different
              item than shown on the receipt, we will correct the error.
            </li>
          </ul>
          <p className="mt-3 text-sm text-neutral-600">
            Nothing in this Policy limits any non‑waivable rights you may have under Florida law.
          </p>
        </section>

        {/* Florida Posting Requirement */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold">3) Florida Posting Requirement</h2>
          <p className="mt-2 text-neutral-700">
            In accordance with Florida Statutes § 501.142, our <span className="font-medium">“ALL SALES FINAL — NO REFUNDS OR
            EXCHANGES”</span> notice is conspicuously posted at the point of sale. If you request a copy of
            this Policy, we will provide it in writing.
          </p>
          <div className="mt-4 rounded-xl border border-neutral-300 bg-white p-4 text-center text-sm font-semibold">
            ALL SALES FINAL — NO REFUNDS OR EXCHANGES
          </div>
        </section>

        {/* How to Request Help */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold">4) Requesting Help for the Narrow Exceptions</h2>
          <p className="mt-2 text-neutral-700">
            If you believe your situation falls within the legal carve‑outs above, please contact us within
            48 hours of purchase or delivery and do not dispose of the product until instructed. Bring a
            valid, itemized receipt and the product in its original packaging (if applicable). We may
            request reasonable documentation or evidence to evaluate your request.
          </p>
        </section>

        {/* Online Orders / Cancellations */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold">5) Online Orders & Cancellations</h2>
          <p className="mt-2 text-neutral-700">
            Orders may be canceled before payment is captured and fulfillment begins. Once payment is
            captured or the order is prepared for pickup/delivery, the transaction is final.
          </p>
        </section>

        {/* Age & Compliance */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold">6) Age Verification & Compliance</h2>
          <p className="mt-2 text-neutral-700">
            You must be 21+ with valid, unexpired government‑issued photo ID at the time of purchase or
            delivery hand‑off. We reserve the right to refuse or cancel any order where age/capacity cannot
            be verified, where prohibited by law, or where fraud is suspected. In such cases, if payment has
            been taken, we will process a refund.
          </p>
        </section>

        {/* Governing Law */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold">7) Governing Law</h2>
          <p className="mt-2 text-neutral-700">
            This Policy is governed by the laws of the State of Florida. Venue for any dispute shall lie in
            the state courts of the county where the purchase occurred, unless otherwise required by law.
          </p>
        </section>

        {/* Contact */}
        <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="text-lg font-semibold">Contact</h2>
          <p className="mt-2 text-neutral-700">
            El Gato Tuerto Liquor Store<br />
            1234 Calle Ocho, Miami, FL 33135 (placeholder)<br />
            Phone: (305) 555‑0123 • Email: help@elgatotuerto.com
          </p>
        </section>

        <footer className="mt-10 text-xs text-neutral-500">
          This page is provided for general informational purposes and does not constitute legal advice.
          Policy subject to change without notice.
        </footer>
      </div>
    </main>
  );
}
