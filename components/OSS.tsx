import { LuStar, LuGitFork, LuCoffee } from "react-icons/lu";

export default function OpenSourceSection() {
  return (
    <section className=" text-primaryWhite py-16 ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            Join Our Open Source Community
          </h2>
          <p className="text-xl">Help us make this project even better!</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <LuStar className="mx-auto mb-4" size={48} />
            <h3 className="text-xl font-semibold mb-2">Star the Project</h3>
            <p className="mb-4">
              Show your support by starring our repository on GitHub.
            </p>
            <a
              href="https://github.com/dipanshurdev/devpath"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primaryWhite text-primaryBlue font-semibold py-2 px-4 rounded-full hover:bg-opacity-70 transition-colors"
            >
              Star on GitHub
            </a>
          </div>
          <div className="text-center">
            <LuGitFork className="mx-auto mb-4" size={48} />
            <h3 className="text-xl font-semibold mb-2">Contribute</h3>
            <p className="mb-4">
              Fork the repo and submit your pull requests to help improve the
              project.
            </p>
            <a
              href="https://github.com/dipanshurdev/devpath/fork"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primaryWhite text-primaryBlue font-semibold py-2 px-4 rounded-full hover:bg-opacity-70 transition-colors"
            >
              Fork on GitHub
            </a>
          </div>
          <div className="text-center">
            <LuCoffee className="mx-auto mb-4" size={48} />
            <h3 className="text-xl font-semibold mb-2">Support Us</h3>
            <p className="mb-4">
              Consider supporting the project to help with its development and
              maintenance.
            </p>
            <a
              href="https://opencollective.com/your-project"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primaryWhite text-primaryBlue font-semibold py-2 px-4 rounded-full hover:bg-opacity-70 transition-colors"
            >
              Donate
            </a>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-6">Project Stats</h3>
          <div className="flex justify-center gap-12">
            <div>
              <span className="text-3xl font-bold text-primaryBlue">0</span>
              <p>Stars</p>
            </div>
            <div>
              <span className="text-3xl font-bold text-primaryBlue">0</span>
              <p>Forks</p>
            </div>
            <div>
              <span className="text-3xl font-bold text-primaryBlue">2</span>
              <p>Contributors</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
