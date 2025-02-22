import React from "react";

const ProfileCard = ({ imageUrl, name, role }) => {
  return (
    <div className="flex flex-col items-center p-4">
      <img
        src={imageUrl}
        alt="Profile"
        className="w-24 h-24 rounded-full border-2 border-gray-300"
      />
      <p className="mt-2 text-lg font-semibold">{name}</p>
      <p className="text-gray-500">{role}</p>
    </div>
  );
};

export default ProfileCard;
  