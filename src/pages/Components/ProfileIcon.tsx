import React from "react";

interface ProfileIconProps {
  name?: string; // optional, but we handle it safely
  size?: number;
}

const ProfileIcon: React.FC<ProfileIconProps> = ({ name = "User", size = 40 }) => {
  const colors = [
    "#F44336", "#E91E63", "#9C27B0", "#3F51B5",
    "#2196F3", "#00BCD4", "#4CAF50", "#FF9800",
    "#795548", "#607D8B"
  ];

  

  const getRandomColor = (seed: string = "user"): string => {
    const hash = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const firstLetter = name.charAt(0).toUpperCase();
  const bgColor = getRandomColor(name);

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        color: "#fff",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size / 2,
        fontWeight: "bold",
        userSelect: "none"
      }}
    >
      {firstLetter}
    </div>
  );
};

export default ProfileIcon;
