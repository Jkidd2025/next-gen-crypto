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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Terms of Service Agreement</DialogTitle>
          <DialogDescription>
            Please review and accept our Terms of Service to continue
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Terms of Service</h3>
            <p>Welcome to Next Gen Crypto. By using our services, you agree to these terms.</p>
            {/* Add more terms content here */}
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