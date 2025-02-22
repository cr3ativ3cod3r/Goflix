import React from "react";

const ProfileCard = ({ imageUrl, name, role }) => {
  return (
    <div className="flex flex-col items-center p-4 w-40">
      <img
        src={imageUrl}
        alt="Profile"
        className="w-32 h-32 object-cover rounded-full"
      />
      <p className="mt-3 text-lg font-semibold text-center" style={{ fontFamily: "OSCB, sans-serif" }}>
        {name}
      </p>
      <p className="text-gray-400 text-center" style={{ fontFamily: "OSLB, sans-serif" }}>
        {role}
      </p>
    </div>
  );
};

export default ProfileCard;
