import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const ContactUs = () => {
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
    <section id="contact-us" className="py-24 px-4 md:px-8 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-primary">Contact Us</h2>
          <p className="text-xl text-gray-600">We'd love to hear from you. Get in touch with our team.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
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

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Connect With Us</h3>
              <p className="text-gray-600 mb-6">
                Follow us on social media to stay updated with the latest news and announcements.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <Facebook className="w-6 h-6 text-primary" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <Twitter className="w-6 h-6 text-primary" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <Instagram className="w-6 h-6 text-primary" />
                </a>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <a
                  href="/privacy-policy"
                  className="text-sm text-gray-600 hover:text-primary transition-colors"
                >
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};