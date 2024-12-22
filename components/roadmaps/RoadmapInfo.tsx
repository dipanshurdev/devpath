import { Models } from "appwrite";

export default function RoadmapInfo({ roadmap }: { roadmap: Models.Document }) {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-4xl font-bold mb-2 inline-block text-transparent bg-clip-text bg-gradient-to-r  from-primaryBlue to-primaryWhite">
        {roadmap.title}
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        {roadmap.description}
      </p>
    </div>
  );
}
