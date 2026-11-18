"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "cn";

interface ItemGalleryProps {
  /** All available images — falls back to a single `imageUrl`. */
  images?: string[];
  alt: string;
}

/**
 * Image gallery for the item details page — large preview plus a thumbnail
 * row when multiple images are available. UI only, local state.
 */
const ItemGallery = ({ images = [], alt }: ItemGalleryProps) => {
  const list = images.filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);

  if (list.length === 0) {
    return (
      <div className="bg-muted text-muted-foreground flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-border">
        <div className="flex flex-col items-center gap-2">
          <ImageOff className="size-8" aria-hidden="true" />
          <span className="text-sm">No image available</span>
        </div>
      </div>
    );
  }

  const active = list[activeIndex] ?? list[0];

  return (
    <div className="space-y-3">
      {/* Main preview */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={active}
          alt={alt}
          className="size-full object-cover"
        />
        {list.length > 1 && (
          <span className="bg-background/90 text-foreground absolute right-3 bottom-3 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
            {activeIndex + 1} / {list.length}
          </span>
        )}
      </div>

      {/* Thumbnails — only when multiple images exist */}
      {list.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {list.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              aria-label={`View image ${index + 1}`}
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-opacity sm:size-20",
                index === activeIndex
                  ? "border-primary opacity-100"
                  : "border-border opacity-60 hover:opacity-100",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                loading="lazy"
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemGallery;
