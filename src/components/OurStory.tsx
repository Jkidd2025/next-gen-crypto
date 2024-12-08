import { Card, CardContent } from "@/components/ui/card";

export const OurStory = () => {
  return (
    <section id="our-story" className="py-16 px-4 md:px-8 bg-gradient-radial from-primary/10 via-background to-background">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center text-primary">Our Story</h2>
        <Card className="bg-white/5 border-primary/20">
          <CardContent className="p-8">
            <div className="space-y-6 text-black">
              <p>
                Our journey began with a fascination for blockchain technology and its limitless potential to reshape industries and communities. Driven by curiosity and a vision to create something impactful, we embarked on a mission to build a venture that serves not only as a milestone for the technology and crypto community but also as an open door of opportunity for everyone.
              </p>
              <p>
                It wasn't an easy road. It took years of dedication to understand blockchain's intricate capabilities and master the art of coding "smart contracts." Along the way, another game-changing innovation emerged: artificial intelligence. The convergence of these two groundbreaking technologies became the catalyst for our project's birth.
              </p>
              <p>
                At the heart of what we do are values that guide every decision and effort—hard work, perseverance, dedication, loyalty, trust, community, and fun. These principles shaped our achievements, including the successful deployment of our smart contract on the Solana mainnet, the integration of a DApp on our community website, and the development of robust security features to protect token holders.
              </p>
              <p>
                Leading this initiative is our founder, Joshua Kidd, a serial entrepreneur with over 20 years of executive leadership in the tech space. Joshua's passion for the crypto community fuels his drive to create innovative products powered by Web3 technologies and artificial intelligence.
              </p>
              <p>
                To those who join us on this journey—whether as token holders, community members, or supporters—know that we deeply respect your commitment and trust. Your investment is more than financial; it's a belief in our vision, our integrity, and the transformative power of technology.
              </p>
              <p>
                Together, we aim to show the world that, in the right hands, technology can make a profound and lasting impact on society.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};