export const PriceTracker = () => {
  return (
    <div className="py-20 bg-white" id="price">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16 text-primary">Live Price</h2>
        <div className="max-w-md mx-auto bg-gray-50 rounded-lg shadow-lg p-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-accent mb-2">$0.000001</p>
            <p className="text-sm text-gray-600">Price data from DEX Screener</p>
          </div>
        </div>
      </div>
    </div>
  );
};