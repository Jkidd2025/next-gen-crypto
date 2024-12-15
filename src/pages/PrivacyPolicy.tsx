import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { TermsSection } from "@/components/legal/terms/TermsSection";

const PrivacyPolicy = () => {
  return (
    <LegalPageLayout
      title="PRIVACY POLICY"
      effectiveDate="12/15/2024"
    >
      <p>
        This Privacy Policy describes how Next Gen Crypto ("Company," "we," "our," or "us") collects, uses, and protects the personal information of users ("you," "your") who access our website and services, including the purchase of tokens and access to members-only sections. By using our website, you agree to the practices described in this Privacy Policy.
      </p>

      <TermsSection title="1. Information We Collect">
        <p>We collect the following personal information:</p>
        <ul className="list-disc pl-6">
          <li>Name: To verify your identity and personalize your access.</li>
          <li>Email Address: To provide account access, send important communications, and manage membership-related services.</li>
        </ul>
        <p>We may also collect non-personal information such as browser type, IP address, and website usage statistics to improve our website's functionality and user experience.</p>
      </TermsSection>

      <TermsSection title="2. How We Use Your Information">
        <p>The information we collect is used for the following purposes:</p>
        <ul className="list-disc pl-6">
          <li>To provide you with access to the members-only section of our website.</li>
          <li>To process your token purchases.</li>
          <li>To send important updates, such as changes to our terms or services.</li>
          <li>To enhance the security of our platform and prevent unauthorized access.</li>
        </ul>
        <p>We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
      </TermsSection>

      <TermsSection title="3. How We Share Your Information">
        <p>Your personal information may be shared in the following limited circumstances:</p>
        <ul className="list-disc pl-6">
          <li>Service Providers: We may share your information with trusted third-party vendors who assist in website operations or provide technical support. These vendors are required to handle your data securely and in accordance with this Privacy Policy.</li>
          <li>Legal Obligations: We may disclose your information to comply with applicable laws, regulations, or legal requests.</li>
        </ul>
      </TermsSection>

      <TermsSection title="4. Data Security">
        <p>We implement industry-standard security measures to protect your personal information, including:</p>
        <ul className="list-disc pl-6">
          <li>Encryption of sensitive data during transmission.</li>
          <li>Secure storage of user data in protected databases.</li>
          <li>Regular monitoring of our systems to prevent unauthorized access or breaches.</li>
        </ul>
        <p>Despite these precautions, no method of transmission or storage is completely secure, and we cannot guarantee the absolute security of your data.</p>
      </TermsSection>

      <TermsSection title="5. Your Rights">
        <p>You have the following rights regarding your personal information:</p>
        <ul className="list-disc pl-6">
          <li>Access and Correction: You can request access to or correction of your personal data by contacting us.</li>
          <li>Deletion: You can request that your data be deleted, subject to legal or operational requirements.</li>
          <li>Withdraw Consent: You may withdraw your consent for us to use your personal data at any time.</li>
        </ul>
        <p>To exercise these rights, please contact us at admin@myngcrypto.com.</p>
      </TermsSection>

      <TermsSection title="6. Retention of Information">
        <p>We retain your personal information for as long as necessary to:</p>
        <ul className="list-disc pl-6">
          <li>Provide the services you requested.</li>
          <li>Comply with legal obligations.</li>
          <li>Resolve disputes and enforce agreements.</li>
        </ul>
        <p>After this period, your data will be securely deleted or anonymized.</p>
      </TermsSection>

      <TermsSection title="7. Cookies and Tracking Technologies">
        <p>Our website uses cookies and similar technologies to enhance your experience. Cookies help us:</p>
        <ul className="list-disc pl-6">
          <li>Remember your preferences.</li>
          <li>Analyze website performance and usage.</li>
        </ul>
        <p>You can manage your cookie preferences through your browser settings. Note that disabling cookies may affect the functionality of our website.</p>
      </TermsSection>

      <TermsSection title="8. International Users">
        <p>If you access our services from outside our jurisdiction, your information may be transferred to, stored, or processed in a jurisdiction with different data protection laws. By using our services, you consent to this transfer.</p>
      </TermsSection>

      <TermsSection title="9. Changes to This Privacy Policy">
        <p>We may update this Privacy Policy to reflect changes in our practices or applicable laws. Any significant changes will be communicated via email or a prominent notice on our website.</p>
      </TermsSection>

      <TermsSection title="10. Contact Us">
        <p>If you have any questions about this Privacy Policy or our data practices, please contact us at:</p>
        <p>Legal Department<br />admin@myngcrypto.com</p>
      </TermsSection>
    </LegalPageLayout>
  );
};

export default PrivacyPolicy;