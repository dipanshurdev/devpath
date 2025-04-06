"use client";

import { useUserContext } from "@/context/AuthContext";
// import { useState } from "react";

import Image from "next/image";

const Profile = () => {
  const { user } = useUserContext();
  // const [savedRoadmaps, setSavedRoadmaps] = useState([]);

  // useEffect(() => {
  //   if (user?.id) {
  //     getSavedRoadmaps(user.id).then(setSavedRoadmaps);
  //   }
  // }, [user]);

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <Image
          src={user.imageUrl || "/default-avatar.png"}
          alt="Profile"
          width={100}
          height={100}
          className="profile-avatar"
        />
        <h1>{user.name}</h1>
        <p>{user.bio}</p>
      </div>

      {/* Saved Roadmaps */}
      <div className="saved-roadmaps">
        <h2>Saved Roadmaps</h2>
        {/*  {savedRoadmaps.length > 0 ? (
          <ul>
            {savedRoadmaps.map((roadmap) => (
              <li key={roadmap.roadmapId}>
                <a href={`/roadmap/${roadmap.roadmapId}`}>{roadmap.title}</a>
              </li>
            ))}
          </ul>
        ) : ( */}
        <p>No saved roadmaps.</p>
        {/* )} */}
      </div>
    </div>
  );
};

export default Profile;
