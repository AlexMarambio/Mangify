// components/MangaCard.tsx
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

type MangaCardProps = {
  title: string;
  imageUrl: string;
  onClick?: () => void;
};

const MangaCard: React.FC<MangaCardProps> = ({ title, imageUrl, onClick }) => {
  return (
    <div>
      <Card onClick={onClick} className="cursor-pointer m-0 p-0 w-full gap-0 overflow-hidden hover:scale-105 transform transition">
        <CardContent className="p-0">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-48"
          />
        </CardContent>
        <CardFooter className="flex text-sm font-semibold px-0 my-3 justify-center items-center">
          {title}
        </CardFooter>
      </Card>
    </div>
  );
};

export default MangaCard;
