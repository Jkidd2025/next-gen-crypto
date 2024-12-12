import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CreditCard } from "lucide-react";

export const BuyWithCard = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full mt-4"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Buy with Card
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Buy Tokens with Card</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-4">
            Coming soon! You'll be able to buy tokens directly with your credit or debit card.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};