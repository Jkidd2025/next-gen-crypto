import { ContactForm } from "./contact/ContactForm";
import { SocialConnect } from "./contact/SocialConnect";

export const ContactUs = () => {
  return (
    <section id="contact-us" className="py-24 px-4 md:px-8 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-primary">Contact Us</h2>
          <p className="text-xl text-gray-600">We'd love to hear from you. Get in touch with our team.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <ContactForm />
          <div className="space-y-8">
            <SocialConnect />
          </div>
        </div>
      </div>
    </section>
  );
};