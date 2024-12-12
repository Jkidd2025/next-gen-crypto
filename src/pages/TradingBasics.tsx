import { ArrowLeft, BarChart2, TrendingUp, ArrowUpDown, AlertTriangle, LineChart } from "lucide-react";
import { Link } from "react-router-dom";

const TradingBasics = () => {
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
          Trading Basics
        </h1>

        <div className="space-y-12">
          <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <BarChart2 className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-semibold text-primary">Understanding Markets</h2>
            </div>
            <div className="space-y-6 text-muted-foreground">
              <div>
                <strong className="text-foreground block mb-2">Market Types</strong>
                <p>Learn about different cryptocurrency markets and their characteristics.</p>
              </div>
              <div>
                <strong className="text-foreground block mb-2">Order Books</strong>
                <p>Understanding buy and sell orders, and how they affect market prices.</p>
              </div>
              <div>
                <strong className="text-foreground block mb-2">Market Participants</strong>
                <p>Different types of traders and their roles in the market.</p>
              </div>
            </div>
          </section>

          <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <TrendingUp className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-semibold text-primary">Basic Trading Concepts</h2>
            </div>
            <ul className="list-none space-y-4 text-muted-foreground">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3"></span>
                <div>
                  <strong className="text-foreground block mb-1">Market Orders:</strong>
                  Buy or sell at the current market price
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3"></span>
                <div>
                  <strong className="text-foreground block mb-1">Limit Orders:</strong>
                  Set specific prices for buying or selling
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3"></span>
                <div>
                  <strong className="text-foreground block mb-1">Stop Orders:</strong>
                  Automated orders triggered at specific price points
                </div>
              </li>
            </ul>
          </section>

          <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <LineChart className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-semibold text-primary">Technical Analysis</h2>
            </div>
            <div className="space-y-6 text-muted-foreground">
              <div>
                <strong className="text-foreground block mb-2">Chart Patterns</strong>
                <p>Basic patterns and what they might indicate about price movements.</p>
              </div>
              <div>
                <strong className="text-foreground block mb-2">Indicators</strong>
                <p>Common technical indicators and how to interpret them.</p>
              </div>
              <div>
                <strong className="text-foreground block mb-2">Time Frames</strong>
                <p>Different trading timeframes and their significance.</p>
              </div>
            </div>
          </section>

          <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <AlertTriangle className="h-8 w-8 text-accent" />
              <h2 className="text-3xl font-semibold text-primary">Risk Management</h2>
            </div>
            <ul className="list-none space-y-4 text-muted-foreground">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-accent mt-2 mr-3"></span>
                Never invest more than you can afford to lose
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-accent mt-2 mr-3"></span>
                Use stop-loss orders to limit potential losses
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-accent mt-2 mr-3"></span>
                Diversify your portfolio to spread risk
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-accent mt-2 mr-3"></span>
                Keep emotions in check while trading
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TradingBasics;