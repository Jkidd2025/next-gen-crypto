import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const GettingStarted = () => {
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
          Getting Started with Cryptocurrency
        </h1>

        <div className="space-y-12">
          <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <h2 className="text-3xl font-semibold mb-6 text-primary">What is Cryptocurrency?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Cryptocurrency is a digital or virtual form of currency that uses cryptography for security. 
              Unlike traditional currencies issued by governments, cryptocurrencies are typically decentralized 
              systems based on blockchain technology.
            </p>
          </section>

          <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <h2 className="text-3xl font-semibold mb-6 text-primary">Key Concepts</h2>
            <ul className="list-none space-y-4 text-muted-foreground">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3"></span>
                <div>
                  <strong className="text-foreground block mb-1">Blockchain:</strong>
                  A distributed ledger that records all transactions
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3"></span>
                <div>
                  <strong className="text-foreground block mb-1">Wallet:</strong>
                  A digital tool to store and manage your cryptocurrencies
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3"></span>
                <div>
                  <strong className="text-foreground block mb-1">Private Keys:</strong>
                  Secret codes that prove your ownership of crypto assets
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3"></span>
                <div>
                  <strong className="text-foreground block mb-1">Public Keys:</strong>
                  Your cryptocurrency address for receiving funds
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3"></span>
                <div>
                  <strong className="text-foreground block mb-1">Mining:</strong>
                  The process of validating transactions and creating new coins
                </div>
              </li>
            </ul>
          </section>

          <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <h2 className="text-3xl font-semibold mb-6 text-primary">Safety First</h2>
            <div className="space-y-6 text-muted-foreground">
              <div>
                <strong className="text-foreground block mb-2">Research thoroughly</strong>
                <p>Before investing, understand the cryptocurrency project, team, and technology behind it.</p>
              </div>
              <div>
                <strong className="text-foreground block mb-2">Secure your wallet</strong>
                <p>Use strong passwords, enable two-factor authentication, and keep your private keys safe.</p>
              </div>
              <div>
                <strong className="text-foreground block mb-2">Start small</strong>
                <p>Begin with small amounts while learning about the market and different cryptocurrencies.</p>
              </div>
              <div>
                <strong className="text-foreground block mb-2">Use reputable exchanges</strong>
                <p>Only trade on well-known, regulated cryptocurrency exchanges.</p>
              </div>
            </div>
          </section>

          <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <h2 className="text-3xl font-semibold mb-6 text-primary">Getting Your First Cryptocurrency</h2>
            <ol className="list-decimal list-inside space-y-4 text-muted-foreground ml-4">
              <li className="pl-2">Choose a reputable cryptocurrency exchange</li>
              <li className="pl-2">Create and verify your account</li>
              <li className="pl-2">Set up secure two-factor authentication</li>
              <li className="pl-2">Connect a payment method</li>
              <li className="pl-2">Start with a small purchase of an established cryptocurrency</li>
              <li className="pl-2">Consider moving your crypto to a secure wallet</li>
            </ol>
          </section>

          <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <h2 className="text-3xl font-semibold mb-6 text-primary">Common Mistakes to Avoid</h2>
            <ul className="list-none space-y-4 text-muted-foreground">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-accent mt-2 mr-3"></span>
                Investing more than you can afford to lose
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-accent mt-2 mr-3"></span>
                Falling for cryptocurrency scams or "get rich quick" schemes
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-accent mt-2 mr-3"></span>
                Sharing private keys or wallet recovery phrases
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-accent mt-2 mr-3"></span>
                Trading based on emotions or FOMO (Fear Of Missing Out)
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-accent mt-2 mr-3"></span>
                Neglecting to research before investing
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;