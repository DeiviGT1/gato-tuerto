import React from 'react';
import './TermsAndConditions.css';

const TermsAndConditions = () => {
  return (
    <main className="terms-conditions">
      <div className="tc-container">
        {/* Header */}
        <header>
          <a
            href="/"
            className="tc-back"
            aria-label="Return Home"
          >
            ← Return Home
          </a>
          <span className="tc-date">Effective: August 20, 2025</span>
        </header>

        <h1>Terms and Conditions</h1>

        <section>
          <h2>Terms</h2>
          <p>
            By accessing this website, you are agreeing to be bound by these web site Terms and Conditions of Use...
          </p>
        </section>

        <section>
          <h2>Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials...
          </p>
          <ul>
            <li>Modify or copy the materials;</li>
            <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
            <li>Attempt to decompile or reverse engineer any software contained on El Gato Tuerto's website;</li>
            <li>Remove any copyright or other proprietary notations from the materials; or</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>
          <p>
            This license shall automatically terminate if you violate any of these restrictions...
          </p>
        </section>

        <section>
          <h2>Disclaimer</h2>
          <p>
            The materials on El Gato Tuerto's website are provided "as is". El Gato Tuerto makes no warranties...
          </p>
        </section>

        <section>
          <h2>Limitations</h2>
          <p>
            In no event shall El Gato Tuerto or its suppliers be liable for any damages...
          </p>
        </section>

        <section>
          <h2>Revisions and Errata</h2>
          <p>
            The materials appearing on El Gato Tuerto's website could include technical, typographical, or photographic errors...
          </p>
        </section>

        <section>
          <h2>Links</h2>
          <p>
            El Gato Tuerto has not reviewed all of the sites linked to its website and is not responsible...
          </p>
        </section>

        <section>
          <h2>Site Terms of Use Modifications</h2>
          <p>
            El Gato Tuerto may revise these terms of use for its website at any time without notice...
          </p>
        </section>

        <section>
          <h2>Governing Law</h2>
          <p>
            Any claim relating to El Gato Tuerto's website shall be governed by the laws of the State of Florida...
          </p>
          <p>General Terms and Conditions applicable to Use of a Website.</p>
        </section>

        <footer>
          This page is provided for informational purposes only and does not constitute legal advice.
        </footer>
      </div>
    </main>
  );
};

export default TermsAndConditions;