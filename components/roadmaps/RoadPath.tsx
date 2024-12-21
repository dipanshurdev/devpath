export default function RoadPath() {
  return (
    <svg
      className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full"
      width="100"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <path
        d="M50 0 L25 25 L75 75 L25 125 L75 175 L25 225 L75 275"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeDasharray="8 8"
        className="text-gray-300 dark:text-gray-600"
      />
    </svg>
  );
}
