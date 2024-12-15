interface TermsSectionProps {
  title: string;
  children: React.ReactNode;
}

export const TermsSection = ({ title, children }: TermsSectionProps) => {
  return (
    <section className="mt-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
};