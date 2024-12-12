import { ArrowLeft, Wallet, Key, ShieldCheck, BarChart2, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const WalletManagement = () => {
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
          Wallet Management
        </h1>

        <div className="space-y-12">
          <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <Wallet className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-semibold text-primary">Types of Wallets</h2>
            </div>
            <div className="space-y-6 text-muted-foreground">
              <div>
                <strong className="text-foreground block mb-2">Hot Wallets</strong>
                <p>Online wallets connected to the internet, suitable for frequent trading.</p>
              </div>
              <div>
                <strong className="text-foreground block mb-2">Cold Wallets</strong>
                <p>Offline storage solutions for long-term holdings and maximum security.</p>
              </div>
              <div>
                <strong className="text-foreground block mb-2">Multi-Signature Wallets</strong>
                <p>Wallets requiring multiple approvals for enhanced security.</p>
              </div>
            </div>
          </section>

          <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <Key className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-semibold text-primary">Access Management</h2>
            </div>
            <ul className="list-none space-y-4 text-muted-foreground">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3"></span>
                <div>
                  <strong className="text-foreground block mb-1">Two-Factor Authentication:</strong>
                  Enable 2FA on all your cryptocurrency accounts
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3"></span>
                <div>
                  <strong className="text-foreground block mb-1">Password Security:</strong>
                  Use strong, unique passwords for each wallet and account
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3"></span>
                <div>
                  <strong className="text-foreground block mb-1">Recovery Options:</strong>
                  Set up and maintain proper recovery methods
                </div>
              </li>
            </ul>
          </section>

          <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <BarChart2 className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-semibold text-primary">Portfolio Tracking</h2>
            </div>
            <div className="space-y-6 text-muted-foreground">
              <div>
                <strong className="text-foreground block mb-2">Asset Distribution</strong>
                <p>Monitor and maintain a balanced portfolio across different wallets.</p>
              </div>
              <div>
                <strong className="text-foreground block mb-2">Transaction History</strong>
                <p>Keep detailed records of all transactions for tax and tracking purposes.</p>
              </div>
              <div>
                <strong className="text-foreground block mb-2">Performance Monitoring</strong>
                <p>Track the performance of your holdings across different timeframes.</p>
              </div>
            </div>
          </section>

          <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <Settings className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-semibold text-primary">Maintenance and Updates</h2>
            </div>
            <ul className="list-none space-y-4 text-muted-foreground">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3"></span>
                Regular software updates for security patches
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3"></span>
                Periodic review of security settings
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3"></span>
                Backup verification and testing
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3"></span>
                Regular audit of connected applications and services
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default WalletManagement;