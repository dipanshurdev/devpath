import { Button } from "@/components/ui/button";
import Link from "next/link";

const CTA = () => {
  return (
    <section className="py-20 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-primaryWhite mb-6">
          Ready to Start Your Journey?
        </h2>
        <p className="text-xl text-primaryWhite mb-8 max-w-2xl mx-auto">
          Join DevPath today and take the first step towards becoming a better
          developer. Our personalized roadmaps and curated resources are waiting
          for you.
        </p>
        <Button
          variant="default"
          className="font-semibold bg-primaryBlue text-primaryWhite rounded-lg py-4 px-2"
        >
          <Link href="/roadmaps">Get Started for Free</Link>
        </Button>
      </div>
    </section>
  );
};

export default CTA;
