import { ScrollArea } from "@/components/ui/scroll-area";

export const TermsContent = () => {
  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Terms of Service</h3>
        
        <section className="space-y-4">
          <p>Welcome to Next Gen Crypto ("Company," "we," "our," or "us"). These Terms of Service ("Terms") govern your use of our website, services, and features.</p>

          <div className="space-y-2">
            <h4 className="font-medium">1. Eligibility</h4>
            <ul className="list-disc pl-6">
              <li>You must be at least 18 years old to use our Services.</li>
              <li>You represent that all information provided is accurate and current.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">2. Account Security</h4>
            <ul className="list-disc pl-6">
              <li>You are responsible for maintaining the confidentiality of your account.</li>
              <li>Notify us immediately of any unauthorized access.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">3. Privacy</h4>
            <p>Your use of our Services is also governed by our Privacy Policy.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">4. Acceptable Use</h4>
            <ul className="list-disc pl-6">
              <li>You agree to use our Services only for lawful purposes.</li>
              <li>You will not engage in any harmful or fraudulent activities.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">5. Termination</h4>
            <p>We reserve the right to suspend or terminate your access for any violation of these terms.</p>
          </div>
        </section>
      </div>
    </ScrollArea>
  );
};