import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";

export const ContactForm = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for contacting us. We'll get back to you soon!",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
      <div>
        <Input
          placeholder="Your Name"
          required
          className="border-gray-300"
        />
      </div>
      <div>
        <Input
          type="email"
          placeholder="Your Email"
          required
          className="border-gray-300"
        />
      </div>
      <div>
        <Input
          placeholder="Subject"
          required
          className="border-gray-300"
        />
      </div>
      <div>
        <Textarea
          placeholder="Your Message"
          required
          className="min-h-[150px] border-gray-300"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
      >
        Send Message
      </Button>
    </form>
  );
};