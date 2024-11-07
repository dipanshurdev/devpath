import { LuStar, LuGitFork, LuCoffee, LuGitMerge } from "react-icons/lu";

export default function OpenSourceSection() {
  return (
    <section className=" text-primaryWhite  mt-16 mb-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            Join Our Open Source Community
          </h2>
          <p className="text-xl">Help us make this project even better!</p>
        </div>
        <div className="grid grid-cols-1   md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <LuStar className="mx-auto mb-4" size={48} color="#1e40af" />
            <h3 className="text-xl font-semibold mb-2">Star the Project</h3>
            <p className="mb-4">
              Show your support by starring our repository on GitHub.
            </p>
            <a
              href="https://github.com/dipanshurdev/devpath"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block  bg-primaryBlue text-primaryWhite font-semibold py-2 px-4 rounded-full hover:bg-opacity-70 transition-colors"
            >
              Star on GitHub
            </a>
          </div>
          <div className="text-center">
            <LuGitFork className="mx-auto mb-4" size={48} color="#1e40af" />
            <h3 className="text-xl font-semibold mb-2">Contribute</h3>
            <p className="mb-4">
              Fork the repo and submit your pull requests to help improve the
              project.
            </p>
            <a
              href="https://github.com/dipanshurdev/devpath/fork"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block  bg-primaryBlue text-primaryWhite font-semibold py-2 px-4 rounded-full hover:bg-opacity-70 transition-colors"
            >
              Fork on GitHub
            </a>
          </div>
          <div className="text-center">
            <LuCoffee className="mx-auto mb-4" size={48} color="#1e40af" />
            <h3 className="text-xl font-semibold mb-2">Support Us</h3>
            <p className="mb-4">
              Consider supporting the project to help with its development and
              maintenance.
            </p>
            <a
              href="#"
              // target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primaryBlue text-primaryWhite font-semibold py-2 px-4 rounded-full hover:bg-opacity-70 transition-colors"
            >
              Donate
            </a>
          </div>
        </div>
        <div className="text-center w-full my-8 ">
          <h3 className="text-2xl font-semibold">Current Project Stats</h3>
          <div className="items-center  w-full gap-8 my-8  lg:grid-cols-3 grid   sm:grid-row-3 ">
            <div className=" flex flex-row items-center justify-center">
              <span className="text-3xl font-bold text-primaryWhite flex items-center justify-center gap-2">
                02
                <LuStar color="#1e40af" />
              </span>
              <p className="text-xl ">Github Stars</p>
            </div>
            <div className="flex flex-row items-center justify-center">
              <span className="text-3xl font-bold text-primaryWhite flex items-center justify-center gap-2">
                00
                <LuGitFork color="#1e40af" />
              </span>
              <p className="text-xl">Forks</p>
            </div>
            <div className=" flex flex-row items-center justify-center">
              <span className="text-3xl font-bold text-primaryWhite flex items-center justify-center gap-2">
                02
                <LuGitMerge color="#1e40af" />
              </span>
              <p className="text-xl">Contributors</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
