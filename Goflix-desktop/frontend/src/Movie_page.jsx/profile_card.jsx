import React from "react";

const ProfileCard = ({ imageUrl, name1, name2 }) => {
  return (
    <div className="flex flex-col items-center p-4">
      <img
        src={imageUrl}
        alt="Profile"
        className="w-24 h-24 rounded-full border-2 border-gray-300"
      />
      <p className="mt-2 text-lg font-semibold">{name1}</p>
      <p className="text-gray-500">{name2}</p>
    </div>
  );
};

export default ProfileCard;
