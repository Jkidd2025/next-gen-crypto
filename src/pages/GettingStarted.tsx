import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const GettingStarted = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-primary hover:text-primary/80 mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-8">Getting Started with Cryptocurrency</h1>

        <div className="space-y-12 max-w-3xl">
          <section>
            <h2 className="text-2xl font-semibold mb-4">What is Cryptocurrency?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Cryptocurrency is a digital or virtual form of currency that uses cryptography for security. 
              Unlike traditional currencies issued by governments, cryptocurrencies are typically decentralized 
              systems based on blockchain technology.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Key Concepts</h2>
            <ul className="list-disc list-inside space-y-3 text-muted-foreground">
              <li>Blockchain: A distributed ledger that records all transactions</li>
              <li>Wallet: A digital tool to store and manage your cryptocurrencies</li>
              <li>Private Keys: Secret codes that prove your ownership of crypto assets</li>
              <li>Public Keys: Your cryptocurrency address for receiving funds</li>
              <li>Mining: The process of validating transactions and creating new coins</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Safety First</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">Research thoroughly:</strong> Before investing, 
                understand the cryptocurrency project, team, and technology behind it.
              </p>
              <p>
                <strong className="text-foreground">Secure your wallet:</strong> Use strong passwords, 
                enable two-factor authentication, and keep your private keys safe.
              </p>
              <p>
                <strong className="text-foreground">Start small:</strong> Begin with small amounts 
                while learning about the market and different cryptocurrencies.
              </p>
              <p>
                <strong className="text-foreground">Use reputable exchanges:</strong> Only trade on 
                well-known, regulated cryptocurrency exchanges.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Getting Your First Cryptocurrency</h2>
            <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
              <li>Choose a reputable cryptocurrency exchange</li>
              <li>Create and verify your account</li>
              <li>Set up secure two-factor authentication</li>
              <li>Connect a payment method</li>
              <li>Start with a small purchase of an established cryptocurrency</li>
              <li>Consider moving your crypto to a secure wallet</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Common Mistakes to Avoid</h2>
            <ul className="list-disc list-inside space-y-3 text-muted-foreground">
              <li>Investing more than you can afford to lose</li>
              <li>Falling for cryptocurrency scams or "get rich quick" schemes</li>
              <li>Sharing private keys or wallet recovery phrases</li>
              <li>Trading based on emotions or FOMO (Fear Of Missing Out)</li>
              <li>Neglecting to research before investing</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;