import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface LegalPageLayoutProps {
  title: string;
  effectiveDate: string;
  children: React.ReactNode;
}

export const LegalPageLayout = ({
  title,
  effectiveDate,
  children,
}: LegalPageLayoutProps) => {
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
              <h1 className="text-3xl font-bold text-primary">{title}</h1>
              <p className="text-muted-foreground">Effective Date: {effectiveDate}</p>
              <div className="prose prose-slate max-w-none">
                {children}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};