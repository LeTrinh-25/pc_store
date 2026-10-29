"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const fallbackImage = "/product-placeholder.svg";
const remoteHosts = new Set(["images.unsplash.com", "placehold.co"]);

function safeImageSource(source: string | null | undefined) {
  const value = String(source ?? "").trim();
  if (!value) return fallbackImage;
  if (value.startsWith("/") && !value.startsWith("//")) return value;

  try {
    const url = new URL(value);
    if (url.protocol === "https:" && remoteHosts.has(url.hostname)) return url.toString();
  } catch {
    return fallbackImage;
  }

  return fallbackImage;
}

type ProductImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  onLoad?: () => void;
};

export default function ProductImage({ src, alt, className, sizes, fill, width, height, priority, onLoad }: ProductImageProps) {
  const resolvedSource = safeImageSource(src);
  const [failed, setFailed] = useState(false);
  const imageSource = failed ? fallbackImage : resolvedSource;

  useEffect(() => setFailed(false), [resolvedSource]);

  return <Image
    src={imageSource}
    alt={alt}
    className={className}
    sizes={sizes}
    fill={fill}
    width={fill ? undefined : width}
    height={fill ? undefined : height}
    priority={priority}
    onLoad={onLoad}
    onError={() => setFailed(true)}
  />;
}
