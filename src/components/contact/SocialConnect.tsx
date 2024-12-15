import { Facebook, Twitter, Instagram, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export const SocialConnect = () => {
  return (
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
      <div className="mt-6 pt-6 border-t border-gray-200 flex gap-4 text-sm text-gray-600">
        <Link
          to="/privacy-policy"
          className="hover:text-primary transition-colors flex items-center gap-1"
        >
          <FileText className="w-4 h-4" />
          Privacy Policy
        </Link>
        <Link
          to="/terms-of-service"
          className="hover:text-primary transition-colors flex items-center gap-1"
        >
          <FileText className="w-4 h-4" />
          Terms of Service
        </Link>
      </div>
    </div>
  );
};