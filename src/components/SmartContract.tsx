import { Card, CardContent } from "@/components/ui/card";

export const SmartContract = () => {
  return (
    <section id="smart-contract" className="py-24 px-4 md:px-8 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4 text-primary">Smart Contract: Technology You Can Trust</h2>
          <p className="text-xl text-gray-600 mb-12">Our Solana SPL Token isn't just another cryptocurrency—it's a carefully engineered solution built to ensure trust, security, and fairness.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6">Built on Solana</h3>
              <p className="text-gray-600">
                Leveraging the power of the Solana blockchain, our SPL Token combines lightning-fast transaction speeds, minimal fees, and a scalable architecture to deliver an unparalleled user experience. With a fixed supply of 1,000,000,000 tokens and precision set at 9 decimals, we've created a robust foundation for growth and value.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6">Advanced Security Features</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Emergency Controls:</h4>
                  <p className="text-gray-600">Our contract includes the ability to pause and resume trading to safeguard against unforeseen events or market manipulation.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Anti-Whale Measures:</h4>
                  <ul className="list-disc pl-5 text-gray-600 space-y-2">
                    <li>Max Wallet Balance: No wallet can hold more than 2% of the total supply</li>
                    <li>Max Transaction Limit: Each transaction is capped at 0.5% of the total supply</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-6">Tax System</h3>
            <p className="text-gray-600 mb-4">Every transaction is subject to a 3% tax, ensuring continuous ecosystem health:</p>
            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              <li>40% of the tax contributes to the liquidity pool, supporting stability</li>
              <li>30% Bitcoin strategic reserve for project sustainability and token holder protection</li>
              <li>30% supports the marketing wallet, driving project visibility and growth</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-6">Administrative and Management Capabilities</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Emergency Admin Controls</li>
                <li>Logging System</li>
                <li>Token Burn Functionality</li>
                <li>Security Validation</li>
              </ul>
              <div>
                <h4 className="font-semibold mb-2">Why This Matters to You</h4>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li>Community First: Anti-whale measures ensure equal opportunities</li>
                  <li>Sustainable Growth: Tax system reinforces ecosystem health</li>
                  <li>Accountability: Swift response to challenges</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};