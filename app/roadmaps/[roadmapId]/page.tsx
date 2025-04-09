"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import RoadmapFlow from "@/components/roadmaps/RoadmapFlow";
import RoadmapInfo from "@/components/roadmaps/RoadmapInfo";
import NodeDetails from "@/components/roadmaps/NodeDetails";
import { Models } from "appwrite";
import Loader from "@/components/Loader";
import { useGetRoadmap } from "@/lib/hooks/swr-hooks";
import { useAnalytics } from "@/lib/hooks/useAnalytics";
import SimilarRoadmaps from "@/components/roadmaps/SuggustedRoadmaps";
import roadmapState from "@/lib/state";
import { useUserContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function RoadmapPage({
  params,
}: {
  params: { roadmapId: string };
}) {
  const router = useRouter();
  const { isAuthenticated } = useUserContext();
  const [selectedNode, setSelectedNode] = useState<Models.Document | null>(
    null
  );

  const { data: roadmap, isLoading, error } = useGetRoadmap(params.roadmapId);
  const [completedNodeIds, setCompletedNodeIds] = useState<string[]>([]);
  const { trackEvent } = useAnalytics();

  // const router = useRouter();
  const { onModalOpen } = roadmapState();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect and trigger login modal
      router.push("/");
      onModalOpen();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  if (error) {
    return <div className="text-center mt-20">Failed to load roadmap</div>;
  }
  if (isLoading) {
    return <Loader loading={isLoading} />;
  }

  const handleNodeCompletion = (nodeId: string) => {
    setCompletedNodeIds((prev) =>
      prev.includes(nodeId)
        ? prev.filter((id) => id !== nodeId)
        : [...prev, nodeId]
    );
    trackEvent("node_completed", { nodeId, roadmapId: params.roadmapId });
  };

  return (
    <div className="flex flex-col ">
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RoadmapInfo
          roadmap={roadmap as Models.Document | undefined}
          completedNodeIds={completedNodeIds}
        />
        <div className="mt-8 rounded-lg  overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div
              className="lg:w-2/3 p-4"
              style={{ height: "calc(100vh - 300px)" }}
            >
              <RoadmapFlow
                nodes={roadmap?.nodes as Models.Document[]}
                completedNodeIds={completedNodeIds}
                onNodeClick={setSelectedNode}
              />
            </div>
            <AnimatePresence>
              {selectedNode ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="lg:w-1/3 border-t lg:border-t-0 lg:border-l border-light  overflow-y-auto scrollbar"
                  style={{ maxHeight: "calc(100vh - 300px)" }}
                >
                  <NodeDetails
                    node={selectedNode}
                    isCompleted={completedNodeIds.includes(selectedNode.nodeId)}
                    onComplete={() => handleNodeCompletion(selectedNode.nodeId)}
                  />
                </motion.div>
              ) : (
                <div
                  className="lg:w-1/3 border-t lg:border-t-0 lg:border-l border-light flex flex-col items-center justify-center p-6 bg-darkLight"
                  style={{ maxHeight: "calc(100vh - 300px)" }}
                >
                  <svg
                    className="w-16 h-16 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M12 18.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13z"
                    ></path>
                  </svg>
                  <p className="text-gray-500 text-lg font-semibold">
                    Click on a node to see its details
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <SimilarRoadmaps />
      </main>
    </div>
  );
}
