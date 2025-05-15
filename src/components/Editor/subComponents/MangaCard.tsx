// components/MangaCard.tsx
import React from "react";

type MangaCardProps = {
  title: string;
  imageUrl: string;
  onClick?: () => void;
};

const MangaCard: React.FC<MangaCardProps> = ({ title, imageUrl, onClick }) => {
  return (
    <div
        onClick={onClick}
        className="cursor-pointer w-full h-full bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:scale-105 transform transition"
        >
        <img
            src={imageUrl}
            alt={title}
            className="w-full h-48 "
        />
        <div className="p-2 text-center">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
            {title}
            </h4>
        </div>
    </div>

  );
};

export default MangaCard;
