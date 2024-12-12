import { ArrowLeft, Shield, Lock, ShieldCheck, AlertTriangle, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";

const SecurityBestPractices = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link 
          to="/" 
          className="inline-flex items-center text-primary hover:text-primary/80 mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="text-5xl font-bold mb-12 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Security Best Practices
        </h1>

        <div className="space-y-12">
          <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <Shield className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-semibold text-primary">Basic Security Principles</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Securing your cryptocurrency investments requires a comprehensive approach to security. 
              Understanding and implementing these basic principles will help protect your digital assets 
              from various threats and vulnerabilities.
            </p>
          </section>

          <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <Lock className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-semibold text-primary">Secure Storage Solutions</h2>
            </div>
            <div className="space-y-6 text-muted-foreground">
              <div>
                <strong className="text-foreground block mb-2">Hardware Wallets</strong>
                <p>Physical devices that store your private keys offline, providing maximum security.</p>
              </div>
              <div>
                <strong className="text-foreground block mb-2">Software Wallets</strong>
                <p>Desktop or mobile applications for storing cryptocurrencies with varying security levels.</p>
              </div>
              <div>
                <strong className="text-foreground block mb-2">Paper Wallets</strong>
                <p>Physical documents containing your private keys, stored in a secure location.</p>
              </div>
            </div>
          </section>

          <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <KeyRound className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-semibold text-primary">Private Key Management</h2>
            </div>
            <ul className="list-none space-y-4 text-muted-foreground">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3"></span>
                <div>
                  <strong className="text-foreground block mb-1">Never Share Private Keys:</strong>
                  Keep your private keys confidential and secure at all times
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3"></span>
                <div>
                  <strong className="text-foreground block mb-1">Backup Solutions:</strong>
                  Maintain secure backups of your private keys in multiple locations
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3"></span>
                <div>
                  <strong className="text-foreground block mb-1">Recovery Phrases:</strong>
                  Store seed phrases securely and never digitally
                </div>
              </li>
            </ul>
          </section>

          <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <AlertTriangle className="h-8 w-8 text-accent" />
              <h2 className="text-3xl font-semibold text-primary">Common Security Threats</h2>
            </div>
            <ul className="list-none space-y-4 text-muted-foreground">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-accent mt-2 mr-3"></span>
                Phishing attacks targeting cryptocurrency holders
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-accent mt-2 mr-3"></span>
                Malware designed to steal private keys
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-accent mt-2 mr-3"></span>
                Social engineering attempts
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-accent mt-2 mr-3"></span>
                Fake cryptocurrency exchanges and websites
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SecurityBestPractices;