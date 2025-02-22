import React from "react";
import ProfileCard from "./profile_card";

const ScrollElement = () => {
  const profiles = [
    { imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9gDCP9BFo39iLLCHnwlyzJGC8vxB9i-RoHTTbseIuQjU3pOSBZs9UuRnPN4Kyl5OXGX0CRP5m-h8CEK3xpuf7KR9CQRDnyrOK3zfywCo", name: "Matthew McConaughey", role: "Cooper" },
    { imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9gDCP9BFo39iLLCHnwlyzJGC8vxB9i-RoHTTbseIuQjU3pOSBZs9UuRnPN4Kyl5OXGX0CRP5m-h8CEK3xpuf7KR9CQRDnyrOK3zfywCo", name: "Matthew McConaughey", role: "Cooper" },
    { imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9gDCP9BFo39iLLCHnwlyzJGC8vxB9i-RoHTTbseIuQjU3pOSBZs9UuRnPN4Kyl5OXGX0CRP5m-h8CEK3xpuf7KR9CQRDnyrOK3zfywCo", name: "Matthew McConaughey", role: "Cooper" },
    { imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9gDCP9BFo39iLLCHnwlyzJGC8vxB9i-RoHTTbseIuQjU3pOSBZs9UuRnPN4Kyl5OXGX0CRP5m-h8CEK3xpuf7KR9CQRDnyrOK3zfywCo", name: "Matthew McConaughey", role: "Cooper" },
    { imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9gDCP9BFo39iLLCHnwlyzJGC8vxB9i-RoHTTbseIuQjU3pOSBZs9UuRnPN4Kyl5OXGX0CRP5m-h8CEK3xpuf7KR9CQRDnyrOK3zfywCo", name: "Matthew McConaughey", role: "Cooper" },
    { imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9gDCP9BFo39iLLCHnwlyzJGC8vxB9i-RoHTTbseIuQjU3pOSBZs9UuRnPN4Kyl5OXGX0CRP5m-h8CEK3xpuf7KR9CQRDnyrOK3zfywCo", name: "Matthew McConaughey", role: "Cooper" },
  ];

  return (
    <div className="w-full max-w-4xl overflow-x-auto whitespace-nowrap p-4">
      <div className="flex space-x-4">
        {profiles.map((profile, index) => (
          <ProfileCard key={index} {...profile} />
        ))}
      </div>
    </div>
  );
};

export default ScrollElement;
