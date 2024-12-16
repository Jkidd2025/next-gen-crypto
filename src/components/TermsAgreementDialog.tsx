import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const TermsAgreementDialog = () => {
  const [open, setOpen] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleAgree = async () => {
    if (agreed) {
      // Store the agreement in local storage to prevent showing again
      localStorage.setItem('termsAgreed', 'true');
      setOpen(false);
    }
  };

  const handleDecline = async () => {
    // Sign out if user declines
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Prevent dialog from being closed by escape key or clicking outside
  const handleOpenChange = (newOpen: boolean) => {
    // Only allow closing through the Accept or Decline buttons
    if (newOpen === false) {
      return;
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl" hideCloseButton>
        <DialogHeader>
          <DialogTitle>Terms of Service Agreement</DialogTitle>
          <DialogDescription>
            Please review and accept our Terms of Service to continue
          </DialogDescription>
        </DialogHeader>
        
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

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked as boolean)}
          />
          <Label htmlFor="terms">
            I have read and agree to the Terms of Service
          </Label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleDecline}>
            Decline
          </Button>
          <Button onClick={handleAgree} disabled={!agreed}>
            Accept & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};