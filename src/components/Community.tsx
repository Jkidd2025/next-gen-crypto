import { Card, CardContent } from "@/components/ui/card";

export const Community = () => {
  return (
    <section id="community" className="py-16 px-4 md:px-8 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center text-primary">A Message to Our Token Holders</h2>
        <Card className="bg-white/5 border-primary/20">
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none space-y-6 text-gray-600">
              <p className="italic text-xl">To our valued token holders,</p>
              
              <p>
                First and foremost, thank you for your trust and belief in this project. Your commitment is not just an investment in a token; it's an investment in a shared vision—a vision of fairness, innovation, and community empowerment.
              </p>
              
              <p>
                We understand that your hard-earned money represents more than financial capital—it reflects your confidence in us. That's why we've built this project with a deep sense of responsibility, prioritizing transparency, security, and accountability at every step.
              </p>
              
              <p className="font-semibold">Our smart contract isn't just code—it's a promise:</p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>A promise of fairness through measures like anti-whale protections to ensure equitable participation.</li>
                <li>A promise of sustainability with a transaction tax system designed to support growth and stability.</li>
                <li>A promise of security with advanced features to safeguard your investment.</li>
              </ul>
              
              <p>
                Our team is driven by the values of hard work, perseverance, and integrity. We are fully committed to fulfilling our mission, delivering on our roadmap, and showing the world how blockchain technology, when used responsibly, can create a positive impact.
              </p>
              
              <p>
                Your support enables us to innovate, grow, and build a future that we can all be proud of. Together, we are more than a project; we are a community striving for something greater.
              </p>
              
              <p>
                Thank you for being an essential part of this journey. Your trust inspires us to push boundaries, overcome challenges, and remain steadfast in our mission.
              </p>
              
              <div className="mt-8 pt-4 border-t border-gray-200">
                <p className="italic">With gratitude and determination,</p>
                <p className="font-semibold">Next-Gen Crypto Team</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};