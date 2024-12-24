import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

export const Reports = () => {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Reports Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              The Reports section is currently being rebuilt to provide you with improved functionality and better performance.
              Please check back soon.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};