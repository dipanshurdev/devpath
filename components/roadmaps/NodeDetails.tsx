import { Models } from "appwrite";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Book, Code, FileVideo, Folder, Gamepad, LinkIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export default function NodeDetails({ node }: { node: Models.Document }) {
  const getResourceIcon = (type: string) => {
    switch (type) {
      case "article":
        return <Book className="w-4 h-4" />;
      case "video":
        return <FileVideo className="w-4 h-4" />;

      case "docs":
        return <Folder className="w-4 h-4" />;
      case "game":
        return <Gamepad className="w-4 h-4" />;
      default:
        return <Code className="w-4 h-4" />;
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 "
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        {node.title}
      </h2>
      <p className="text-gray-600 dark:text-gray-300">{node.description}</p>
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
          Resources
        </h3>
        {node.resources.length > 0 ? (
          <ul className="space-y-2">
            {node.resources.map((resource: Models.Document, index: number) => (
              <Card className="mb-2" key={index}>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {getResourceIcon(resource.type)}
                    {resource.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardDescription className="text-xs">
                    {resource.description}
                  </CardDescription>
                  <div className="flex justify-between items-center mt-2 ">
                    <Badge
                      variant="secondary"
                      className="text-xs hover:bg-blue-500 bg-primaryBlue text-primaryWhite cursor-pointer"
                    >
                      {resource.difficulty}
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primaryBlue"
                      >
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Open
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No resources available for this topic.
          </p>
        )}
      </div>
    </motion.div>
  );
}
