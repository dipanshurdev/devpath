import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";

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

        <Link
          href="/roadmaps"
          className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-3 text-base font-medium text-white hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform transform hover:scale-105 duration-200"
        >
          Start Learning
          <BsArrowRight className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
};

export default CTA;
