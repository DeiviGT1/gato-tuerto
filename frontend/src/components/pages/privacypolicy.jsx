import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-page">
      <button className="privacy-policy-button" onClick={() => window.location.href = '/'}>Return Home</button>

      <h1 className="privacy-policy-title">Privacy Policy</h1>

      <h2 className="privacy-policy-subtitle">COOKIES</h2>
      <p className="privacy-policy-text">
      Cookies are small digital signature files that are stored by your web browser that allow
        your preferences to be recorded when visiting the website. Also they may be used to track
        your return visits to the website. Third-party advertising companies may also use cookies for tracking purposes.
      </p>

      <p className="privacy-policy-text">
        As you navigate the site, we may also collect information through the use of commonly-used
        information-gathering tools, such as cookies and web beacons (collectively “Website Navigational
        Information”). Website Navigational Information includes standard information from your web browser
        (such as browser type and browser language), your Internet Protocol (“IP”) address, and the actions
        you take on the Site (such as the web pages viewed and the links clicked).
      </p>

      <h3 className="privacy-policy-subsubtitle">Cookies</h3>
      <p className="privacy-policy-text">
        Like many companies, we may use cookies on this Site. Cookies are pieces of information shared
        between your web browser and a website. Use of cookies enables a faster and easier experience for the user.
        A cookie cannot read data off your computer's hard drive.
      </p>

      <ul className="privacy-policy-list">
      <li>
          <strong>Session cookies:</strong> These are only stored on your computer during your web session. They
          are automatically deleted when the browser is closed. They do not collect any information from your computer.
        </li>
        <li>
          <strong>Persistent cookies:</strong> A persistent cookie is one stored as a file on your computer, and it remains
          there when you close your web browser.
        </li>
        <li>
          <strong>First-party cookies:</strong> These are stored and sent between El Gato Tuerto servers and your
          computer’s hard drive. They are used for personalization as set by you.
        </li>
        <li>
          <strong>Third-party cookies:</strong> These retain your interaction with a particular website for an entity that
          does not own that website. They are usually Persistent cookies.
        </li>
      </ul>

      <p className="privacy-policy-text">
      We do use third-party cookies on our Sites, as well as third-party provided web beacons. These cookies are
        used by us and our marketing partners to better understand your preferences, purchases, and to tailor your experience.
      </p>

      <h3 className="privacy-policy-subsubtitle">Where strictly necessary</h3>
      <p className="privacy-policy-text">
        These cookies are essential to enable you to move around the Site and use its features...
      </p>

      <h3 className="privacy-policy-subsubtitle">Performance</h3>
      <p className="privacy-policy-text">
      These cookies are essential to enable you to move around the Site and use its features, such as accessing secure areas
        of the Site.
      </p>

      <h3 className="privacy-policy-subsubtitle">Functionality</h3>
      <p className="privacy-policy-text">
      These cookies collect information about how visitors use a Site, for instance, which pages visitors go to most often,
        and if they get error messages from web pages.
      </p>

      <h2 className="privacy-policy-subtitle">Web Beacons</h2>
      <p className="privacy-policy-text">
      These cookies allow our Site to remember choices you make (such as your username, language, or the region you are in)
        and provide enhanced features.
      </p>

      <h2 className="privacy-policy-subtitle">IP Addresses</h2>
      <p className="privacy-policy-text">
      When you visit our Site, El Gato Tuerto collects your Internet Protocol (“IP”) addresses to track and aggregate
        non-Personal Information.
      </p>

      <h2 className="privacy-policy-subtitle">Do-Not-Track</h2>
      <p className="privacy-policy-text">
        As this standard has not been finalized, the El Gato Tuerto site is not compatible with DNT.
      </p>

      <h2 className="privacy-policy-subtitle">Google</h2>
      <p className="privacy-policy-text">
      Google, as a third-party vendor, uses cookies to serve ads. You may opt out of the use of the DART cookie by visiting the
      Google ad and content network privacy policy.
      </p>

      <h2 className="privacy-policy-subtitle">Children’s and Minor’s Privacy</h2>
      <p className="privacy-policy-text">
      The elgatotuerto.com site is intended for adults 21 years of age and older. We do not knowingly collect personal
        information from minors under the age of 21.
      </p>
    </div>
  );
};

export default PrivacyPolicy;