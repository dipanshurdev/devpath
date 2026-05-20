import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-card bg-primary p-12 md:p-20 rounded-[3rem] text-center relative overflow-hidden shadow-2xl shadow-primary/40 border-none">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight leading-[1.1]">
              Ready to <br />
              <span className="text-white/80">Start Your Journey?</span>
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-12 leading-relaxed dark:text-foreground">
              Join thousands of developers using DevPath to navigate their tech careers. Our personalized roadmaps and curated resources are waiting for you.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="/register"
                className="bg-white text-primary hover:bg-white/90 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3"
              >
                Get Started Free
                <BsArrowRight className="w-5 h-5 shadow-sm" />
              </Link>
              <Link
                href="/pricing"
                className="bg-primary-foreground/10 text-white border border-white/20 hover:bg-primary-foreground/20 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 backdrop-blur-sm shadow-lg"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
