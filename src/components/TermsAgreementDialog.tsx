import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { TermsContent } from "./terms/TermsContent";

export const TermsAgreementDialog = () => {
  const [open, setOpen] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleAgree = async () => {
    if (agreed) {
      localStorage.setItem('termsAgreed', 'true');
      setOpen(false);
    }
  };

  const handleDecline = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleOpenChange = (newOpen: boolean) => {
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
        
        <TermsContent />

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