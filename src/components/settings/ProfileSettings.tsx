import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const ProfileSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Avatar className="h-24 w-24">
            <AvatarImage src="" alt="Profile picture" />
            <AvatarFallback>
              <User className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
          <Button variant="outline" className="w-full sm:w-auto">
            <Upload className="mr-2 h-4 w-4" />
            Upload Picture
          </Button>
        </div>
        <div className="space-y-2">
          <Label>Username</Label>
          <Input type="text" placeholder="Enter your username" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input type="text" placeholder="Enter your first name" />
          </div>
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input type="text" placeholder="Enter your last name" />
          </div>
        </div>
        <Button className="w-full">Save Profile</Button>
      </CardContent>
    </Card>
  );
};