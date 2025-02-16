import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";

const CTA = () => {
  return (
    <section className="py-20 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-primaryWhite mb-6">
          Ready to Start Your learning Journey?
        </h2>
        <p className="text-xl text-primaryWhite mb-8 max-w-2xl mx-auto">
          Join DevPath today and take the first step towards becoming a better
          developer. Our personalized roadmaps and curated resources are waiting
          for you.
        </p>

        <Link
          href="/roadmaps"
          className="inline-flex items-center rounded-lg px-6 py-3 text-base font-medium btn-gradient hover:scale-105 duration-300 ease-out transition-all hover:shadow-md hover:shadow-primaryDarkLight"
        >
          Start Learning
          <BsArrowRight className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
};

export default CTA;
