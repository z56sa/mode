"use client";

import { useState } from "react";

interface ModCardImageProps {
  src: string | null;
  game: string;
  category: string;
  index: number;
  isGallery: boolean;
}

const FALLBACK_GAME_COVERS: Record<string, string> = {
  "Mount & Blade II: Bannerlord": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/261550/header.jpg",
  "Cyberpunk 2077": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg",
  "Stardew Valley": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/413150/header.jpg",
  "Minecraft": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1928870/header.jpg",
  "Lethal Company": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1966720/header.jpg",
  "Valheim": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/892970/header.jpg",
  "Risk of Rain 2": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/632360/header.jpg",
  "Beat Saber": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/620980/header.jpg",
  "Titanfall 2: Northstar": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1237970/header.jpg",
  "The Witcher 3: Wild Hunt": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/292030/header.jpg",
  "The Elder Scrolls V: Skyrim Special Edition": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/489830/header.jpg",
  "Elden Ring": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg",
  "Baldur's Gate 3": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg",
  "Fallout 4": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/377160/header.jpg",
  "Red Dead Redemption 2": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg",
};

export default function ModCardImage({ src, game, category, index, isGallery }: ModCardImageProps) {
  const fallback = FALLBACK_GAME_COVERS[game] || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80";
  const [currentSrc, setCurrentSrc] = useState<string | null>(src || fallback);
  const [hasError, setHasError] = useState(false);

  function handleError() {
    if (!hasError && currentSrc !== fallback) {
      setHasError(true);
      setCurrentSrc(fallback);
    }
  }

  return (
    <div className={`mod-art mod-art-${index % 4} ${isGallery || hasError ? "has-gallery" : "has-icon"}`}>
      {currentSrc && (
        <img
          className={`mod-image ${isGallery || hasError ? "mod-image-gallery" : "mod-image-icon"}`}
          src={currentSrc}
          alt=""
          loading="lazy"
          onError={handleError}
        />
      )}
      {!currentSrc && (
        <>
          <span className="art-orb" />
          <span className="art-letter">{game.slice(0, 1)}</span>
        </>
      )}
      <span className="art-category">{category}</span>
    </div>
  );
}
