"use client";

import { CldImage } from "next-cloudinary";

type ImageCoverProps = {
  publicId: string;
  className?: string;
  size?: number; // You can define size in props if needed
};

export default function ImageCover({
  publicId,
  className,
  size = 200 // Default size if not provided
}: ImageCoverProps) {
  return (
    <div
      className="relative overflow-hidden"
      style={{ width: size, height: size }}
    >
      <CldImage
        className={`object-cover ${className}`}
        src={publicId}
        alt="User Image"
        fill
      />
    </div>
  );
}
