import Link from "next/link";
import { ArrowRight, Clock, BarChart2 } from "lucide-react";
// import { Models } from "appwrite";
import { RoleType } from "@/types";

export default function RoadmapCard({ name, id, inConstruction }: RoleType) {
  // These would typically come from the roadmap data
  const estimatedTime = "4-6 weeks";
  const difficulty = "Intermediate";

  return (
    <div
      className={`${
        inConstruction ? "cursor-progress" : "cursor-pointer"
      } bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300`}
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          {name}
        </h2>
        {/* <p className="text-gray-600 dark:text-gray-300 mb-4">
          {description}
        </p> */}
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>{estimatedTime}</span>
          </div>
          <div className="flex items-center">
            <BarChart2 size={16} className="mr-1" />
            <span>{difficulty}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium bg-blue-100 text-blue-800 py-1 px-2 rounded dark:bg-blue-900 dark:text-blue-200">
            {/* {roadmap.nodes.length} */}
            5+ topics
          </span>
          {inConstruction ? (
            <span className="text-sm font-medium bg-red-100 text-red-800 py-1 px-2 rounded dark:bg-red-900 dark:text-red-200">
              In Construction
            </span>
          ) : (
            <Link
              href={`/roadmaps/${id}`}
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
            >
              View Roadmap
              <ArrowRight size={16} className="ml-1" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
