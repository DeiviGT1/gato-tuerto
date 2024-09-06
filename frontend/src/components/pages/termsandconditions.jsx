import React from 'react';
import './policies.css';

const TermsAndConditions = () => {
  return (
    <div className="terms-conditions-page">
      <button className="terms-conditions-button" onClick={() => window.location.href = '/'}>Return Home</button>

      <h1 className="terms-conditions-title">Terms and Conditions</h1>

      <h2 className="terms-conditions-subtitle">Terms</h2>
      <p className="terms-conditions-text">
        By accessing this web site, you are agreeing to be bound by these web site Terms and Conditions of Use...
      </p>

      <h2 className="terms-conditions-subtitle">Use License</h2>
      <p className="terms-conditions-text">
        Permission is granted to temporarily download one copy of the materials...
      </p>
      <ul className="terms-conditions-list">
      <li>Modify or copy the materials;</li>
        <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
        <li>Attempt to decompile or reverse engineer any software contained on El Gato Tuerto's web site;</li>
        <li>Remove any copyright or other proprietary notations from the materials; or</li>
        <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
      </ul>

      <p className="terms-conditions-text">
      This license shall automatically terminate if you violate any of these restrictions and may be terminated by El Gato Tuerto at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.
      </p>

      <h2 className="terms-conditions-subtitle">Disclaimer</h2>
      <p className="terms-conditions-text">
      The materials on El Gato Tuerto's web site are provided "as is". El Gato Tuerto makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. Further, El Gato Tuerto does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its Internet web site or otherwise relating to such materials or on any sites linked to this site.
      </p>

      <h2 className="terms-conditions-subtitle">Limitations</h2>
      <p className="terms-conditions-text">
      In no event shall El Gato Tuerto or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on El Gato Tuerto's Internet site, even if El Gato Tuerto or an authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
      </p>

      <h2 className="terms-conditions-subtitle">Revisions and Errata</h2>
      <p className="terms-conditions-text">
      The materials appearing on El Gato Tuerto's web site could include technical, typographical, or photographic errors. El Gato Tuerto does not warrant that any of the materials on its web site are accurate, complete, or current. El Gato Tuerto may make changes to the materials contained on its web site at any time without notice. However, El Gato Tuerto does not make any commitment to update the materials.
      </p>

      <h2 className="terms-conditions-subtitle">Links</h2>
      <p className="terms-conditions-text">
      El Gato Tuerto has not reviewed all of the sites linked to its Internet web site and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by El Gato Tuerto of the site. Use of any such linked web site is at the user's own risk.
      </p>

      <h2 className="terms-conditions-subtitle">Site Terms of Use Modifications</h2>
      <p className="terms-conditions-text">
      El Gato Tuerto may revise these terms of use for its web site at any time without notice. By using this web site you are agreeing to be bound by the then current version of these Terms and Conditions of Use.
      </p>

      <h2 className="terms-conditions-subtitle">Governing Law</h2>
      <p className="terms-conditions-text">
      Any claim relating to El Gato Tuerto's web site shall be governed by the laws of the State of FL without regard to its conflict of law provisions.
      </p>

      <p className="terms-conditions-text">
        General Terms and Conditions applicable to Use of a Web Site.
      </p>
    </div>
  );
};

export default TermsAndConditions;