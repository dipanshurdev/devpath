// import Link from "next/link";
// import { ArrowRight, Clock, BarChart2 } from "lucide-react";
// import { RoleType } from "@/types";

// export default function RoadmapCard({
//   name,
//   id,
//   inConstruction,
//   difficulty,
//   estimatedTime,
//   topics,
// }: RoleType) {
//   return (
//     <div
//       className={`${
//         inConstruction ? "cursor-progress" : "cursor-default"
//       } bg-darkLight  rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300`}
//     >
//       <div className="p-6">
//         <h2 className="text-2xl font-bold mb-2 text-primaryWhite capitalize">
//           {name}
//         </h2>

//         <div className="flex justify-between items-center text-sm text-light mb-4">
//           <div className="flex items-center">
//             <Clock size={16} className="mr-1" />
//             <span>{estimatedTime}</span>
//           </div>
//           <div
//             className={`flex items-center ${
//               difficulty === "Advanced"
//                 ? "text-yellow-500"
//                 : difficulty === "Intermediate"
//                 ? "text-green-500"
//                 : difficulty === "Expert"
//                 ? "text-red-300"
//                 : "text-gray-500 "
//             }`}
//           >
//             <BarChart2 size={16} className="mr-1" />
//             <span>{difficulty}</span>
//           </div>
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-sm font-medium bg-blue-100 text-blue-800 py-1 px-2 rounded dark:bg-blue-900 dark:text-blue-200">
//             {/* {roadmap.nodes.length} */}
//             {topics} Topics
//           </span>
//           {inConstruction ? (
//             <span className="text-sm font-medium bg-red-100 text-red-800 py-1 px-2 rounded dark:bg-red-900 dark:text-red-200">
//               In Construction
//             </span>
//           ) : (
//             <Link
//               href={`/roadmaps/${id}`}
//               className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
//             >
//               View Roadmap
//               <ArrowRight size={16} className="ml-1" />
//             </Link>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import Link from "next/link";
import { ArrowRight, Clock, Construction } from "lucide-react";
import { RoleType } from "@/types";

export default function RoadmapCard({
  name,
  id,
  inConstruction,
  difficulty,
  estimatedTime,
  topics,
}: RoleType) {
  return (
    <div
      className={`${
        inConstruction ? "cursor-not-allowed" : "cursor-pointer"
      } bg-darkLight rounded-lg shadow-sm overflow-hidden hover:shadow-lg hover:scale-105 duration-500 shadow-primaryDarkLight  relative `}
    >
      <div className="p-6">
        <div className="text-2xl font-bold mb-2 text-primaryWhite capitalize flex items-center justify-between">
          <span>{name}</span>

          {difficulty === "Advanced" ? (
            <div className=" bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow-md">
              {difficulty}
            </div>
          ) : difficulty === "Intermediate" ? (
            <div className=" bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow-md">
              {difficulty}
            </div>
          ) : difficulty === "Expert" ? (
            <div className=" bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow-md">
              {difficulty}
            </div>
          ) : (
            <div className=" bg-gray-500 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow-md">
              {difficulty}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center text-sm text-light mb-4">
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>{estimatedTime}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium bg-blue-100 text-blue-800 py-1 px-2 rounded dark:bg-blue-900 dark:text-blue-200">
            {topics} Topics
          </span>
          {inConstruction ? (
            <span className="text-sm flex items-center justify-evenly gap-2 font-medium bg-red-100 text-red-800 py-1 px-2 rounded dark:bg-red-900 dark:text-red-200">
              In Construction
              <Construction size={16} />
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
      {/* Leater adding */}
      {/* Footer Section: Progress Bar (for future use)
      {!inConstruction && (
        <div className="bg-gray-700 h-2 rounded-b-lg overflow-hidden">
          <div
            className="bg-green-500 h-full"
            style={{ width: "50%" }} // Replace 50% with dynamic progress
            title="Progress: 50%"
          ></div>
        </div>
      )} */}
    </div>
  );
}
