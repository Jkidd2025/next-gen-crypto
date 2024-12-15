import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <ScrollArea className="h-[80vh]">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-primary">TERMS OF SERVICE</h1>
              <p className="text-muted-foreground">Effective Date: 12/15/2024</p>

              <div className="prose prose-slate max-w-none">
                <p>
                  Welcome to Next Gen Crypto ("Company," "we," "our," or "us"). These Terms of Service ("Terms") govern your use of our website, services, and features, including logging in, viewing crypto market prices, swapping tokens, chatting with other users, updating profiles, and participating in votes on new features (collectively, "Services"). By registering for and using our Services, you agree to these Terms. If you do not agree, please do not use our Services.
                </p>

                <h2 className="text-xl font-semibold mt-6">1. Eligibility</h2>
                <ul className="list-disc pl-6">
                  <li>You must be at least 18 years old or the age of majority in your jurisdiction to use our Services.</li>
                  <li>By registering, you represent and warrant that you meet these requirements and that all information you provide is accurate and up to date.</li>
                </ul>

                <h2 className="text-xl font-semibold mt-6">2. Account Registration and Security</h2>
                <ul className="list-disc pl-6">
                  <li>Account Creation: You must create an account to access certain features. This requires providing a valid email address, creating a secure password, and agreeing to these Terms.</li>
                  <li>Account Responsibility: You are solely responsible for maintaining the confidentiality of your login credentials and any activity conducted under your account.</li>
                  <li>Unauthorized Access: Notify us immediately at admin@myngcrypto.com if you suspect unauthorized access to your account.</li>
                </ul>

                <h2 className="text-xl font-semibold mt-6">3. Permitted Uses</h2>
                <p>You agree to use our Services only for lawful purposes and in compliance with these Terms. Specifically, you agree NOT to:</p>
                <ul className="list-disc pl-6">
                  <li>Use the Services for any fraudulent, illegal, or harmful activity.</li>
                  <li>Misrepresent your identity or impersonate another person.</li>
                  <li>Attempt to disrupt, hack, or gain unauthorized access to the Services or other users' accounts.</li>
                  <li>Use automated systems, bots, or scraping tools to collect data from the Services.</li>
                </ul>

                <h2 className="text-xl font-semibold mt-6">4. Crypto Market Data and Token Swapping</h2>
                <p>Market Data: The crypto market prices displayed on our website are provided for informational purposes only. We do not guarantee the accuracy, completeness, or timeliness of this information.</p>
                <p>Token Swapping: When using our token swap functionality, you understand that:</p>
                <ul className="list-disc pl-6">
                  <li>Transactions are irreversible once processed.</li>
                  <li>Fees may apply, and you are solely responsible for verifying transaction details.</li>
                  <li>We are not liable for losses resulting from your token swap activities, including errors, market volatility, or blockchain network issues.</li>
                </ul>

                <h2 className="text-xl font-semibold mt-6">5. User-Generated Content</h2>
                <p>Chat and Profile Updates: You may share content via chat, profile updates, or other features. You agree that:</p>
                <ul className="list-disc pl-6">
                  <li>You retain ownership of your content but grant us a non-exclusive, royalty-free, worldwide license to use, display, and distribute your content as necessary to provide the Services.</li>
                  <li>You will not upload or share any content that is illegal, defamatory, obscene, or infringes on third-party rights.</li>
                  <li>We reserve the right to remove or restrict access to content that violates these Terms.</li>
                </ul>

                <h2 className="text-xl font-semibold mt-6">6. Voting on New Features</h2>
                <p>Participating in votes for new features does not obligate us to implement them. We reserve the right to determine the feasibility and priority of any suggested or voted-upon features.</p>

                <h2 className="text-xl font-semibold mt-6">7. Privacy Policy</h2>
                <p>Our collection and use of personal data are governed by our Privacy Policy. By using the Services, you consent to the practices described in our Privacy Policy.</p>

                <h2 className="text-xl font-semibold mt-6">8. Third-Party Services and Links</h2>
                <p>Our Services may include links to third-party websites or services. We are not responsible for the content, functionality, or privacy practices of these third parties. Access them at your own risk.</p>

                <h2 className="text-xl font-semibold mt-6">9. Termination of Services</h2>
                <p>We reserve the right to suspend or terminate your access to the Services at any time, with or without notice, if we suspect a violation of these Terms or for any other reason, including technical or security issues.</p>

                <h2 className="text-xl font-semibold mt-6">10. Disclaimers and Limitation of Liability</h2>
                <ul className="list-disc pl-6">
                  <li>No Investment Advice: Our Services do not constitute financial, investment, or legal advice. Always conduct your own research before making decisions involving cryptocurrencies.</li>
                  <li>No Guarantees: We provide the Services on an "as is" and "as available" basis, without any warranties, express or implied.</li>
                  <li>Limitation of Liability: To the maximum extent permitted by law, we are not liable for any damages, including but not limited to loss of profits, data, or tokens arising from your use of the Services.</li>
                </ul>

                <h2 className="text-xl font-semibold mt-6">11. Indemnification</h2>
                <p>You agree to indemnify and hold harmless Next Gen Crypto, its affiliates, and its employees from any claims, damages, or liabilities arising from your use of the Services, violation of these Terms, or infringement of third-party rights.</p>

                <h2 className="text-xl font-semibold mt-6">12. Governing Law and Dispute Resolution</h2>
                <ul className="list-disc pl-6">
                  <li>Governing Law: These Terms are governed by the laws of the United States.</li>
                  <li>Dispute Resolution: Any disputes will be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, except where prohibited by law.</li>
                </ul>

                <h2 className="text-xl font-semibold mt-6">13. Changes to These Terms</h2>
                <p>We may update these Terms at any time. If we make significant changes, we will notify you via email or a prominent notice on the website. Continued use of the Services constitutes your acceptance of the updated Terms.</p>

                <h2 className="text-xl font-semibold mt-6">14. Contact Information</h2>
                <p>If you have questions about these Terms, please contact us at:</p>
                <p>Next Gen Crypto<br />Attn: Legal<br />admin@myngcrypto.com</p>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;