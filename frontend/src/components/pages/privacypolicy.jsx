import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <main className="privacy-policy">
      <div className="pp-container">
        {/* Header */}
        <header>
          <a
            href="/"
            className="pp-back"
            aria-label="Return Home"
          >
            ← Return Home
          </a>
          <span className="pp-date">Effective: August 20, 2025</span>
        </header>

        <h1>Privacy Policy</h1>

        <section>
          <h2>Cookies</h2>
          <p>
            Cookies are small digital signature files that are stored by your web browser that allow
            your preferences to be recorded when visiting the website. They may also be used to track
            your return visits. Third-party advertising companies may also use cookies for tracking purposes.
          </p>
          <p>
            As you navigate the site, we may collect information through cookies and web beacons
            (“Website Navigational Information”), including browser type, IP address, and actions taken.
          </p>
          <h3>Types of Cookies</h3>
          <ul>
            <li><strong>Session cookies:</strong> Stored during a session, deleted once the browser closes.</li>
            <li><strong>Persistent cookies:</strong> Remain on your computer after the browser is closed.</li>
            <li><strong>First-party cookies:</strong> Stored and sent between El Gato Tuerto servers and your browser.</li>
            <li><strong>Third-party cookies:</strong> Typically persistent, retained for external tracking entities.</li>
          </ul>
          <p>
            We use third-party cookies and web beacons with our partners to understand preferences,
            purchases, and tailor your experience.
          </p>
        </section>

        <section>
          <h2>Where Strictly Necessary</h2>
          <p>
            These cookies are essential to enable you to move around the Site and use its features...
          </p>
        </section>

        <section>
          <h2>Performance</h2>
          <p>
            These cookies collect information about how visitors use the Site, such as which pages are visited most.
          </p>
        </section>

        <section>
          <h2>Functionality</h2>
          <p>
            These cookies remember choices you make (username, language, region) to provide enhanced features.
          </p>
        </section>

        <section>
          <h2>Web Beacons</h2>
          <p>
            These may be used alongside cookies to track activity and measure effectiveness of content.
          </p>
        </section>

        <section>
          <h2>IP Addresses</h2>
          <p>
            When you visit our Site, we collect your Internet Protocol (“IP”) address to track and aggregate
            non-personal information.
          </p>
        </section>

        <section>
          <h2>Do-Not-Track</h2>
          <p>
            As this standard has not been finalized, the El Gato Tuerto site is not compatible with DNT.
          </p>
        </section>

        <section>
          <h2>Google</h2>
          <p>
            Google, as a third-party vendor, uses cookies to serve ads. You may opt out of DART cookies by
            visiting Google’s ad and content network privacy policy.
          </p>
        </section>

        <section>
          <h2>Children’s and Minor’s Privacy</h2>
          <p>
            This site is intended for adults 21 years of age and older. We do not knowingly collect personal
            information from minors under 21.
          </p>
        </section>

        <footer>
          This page is provided for informational purposes only and does not constitute legal advice.
        </footer>
      </div>
    </main>
  );
};

export default PrivacyPolicy;