"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play, Pause, Loader2 } from "lucide-react";

interface CloudflareStreamPlayerProps {
  videoId: string; // Cloudflare Stream video UID
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
  thumbnail?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

/**
 * Cloudflare Stream Video Player Component
 * Uses Cloudflare Stream iframe embed for optimal video playback
 */
export default function CloudflareStreamPlayer({
  videoId,
  autoplay = false,
  controls = true,
  muted = false,
  loop = false,
  className = "",
  thumbnail,
  onPlay,
  onPause,
  onEnded,
}: CloudflareStreamPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  // Construct Cloudflare Stream embed URL
  const embedUrl = `https://iframe.videodelivery.net/${videoId}?${new URLSearchParams({
    autoplay: autoplay ? "true" : "false",
    controls: controls ? "true" : "false",
    muted: muted ? "true" : "false",
    loop: loop ? "true" : "false",
  }).toString()}`;

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      setIsLoading(false);
    };

    iframe.addEventListener("load", handleLoad);

    // Listen for messages from Cloudflare Stream iframe
    const handleMessage = (event: MessageEvent) => {
      // Cloudflare Stream sends messages about playback state
      if (event.data?.type === "play") {
        setIsPlaying(true);
        onPlay?.();
      } else if (event.data?.type === "pause") {
        setIsPlaying(false);
        onPause?.();
      } else if (event.data?.type === "ended") {
        setIsPlaying(false);
        onEnded?.();
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      iframe.removeEventListener("load", handleLoad);
      window.removeEventListener("message", handleMessage);
    };
  }, [onPlay, onPause, onEnded]);

  return (
    <div className={`relative w-full aspect-video bg-black rounded-lg overflow-hidden ${className}`}>
      {isLoading && thumbnail && (
        <div className="absolute inset-0 z-10">
          <Image
            src={thumbnail}
            alt="Video thumbnail"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </div>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        src={embedUrl}
        className="w-full h-full"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen
        style={{ border: "none" }}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}

/**
 * Alternative: Direct HLS/DASH playback using video element
 * Use this if you need more control over the player
 */
export function CloudflareStreamVideoElement({
  videoId,
  autoplay = false,
  controls = true,
  muted = false,
  loop = false,
  className = "",
  thumbnail,
  onPlay,
  onPause,
  onEnded,
}: CloudflareStreamPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const accountId = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID || "";

  // Construct HLS manifest URL
  const hlsUrl = accountId 
    ? `https://customer-${accountId}.cloudflarestream.com/${videoId}/manifest/video.m3u8`
    : `https://iframe.videodelivery.net/${videoId}`;

  return (
    <div className={`relative w-full aspect-video bg-black rounded-lg overflow-hidden ${className}`}>
      {thumbnail && (
        <Image
          src={thumbnail}
          alt="Video thumbnail"
          fill
          className="object-cover opacity-0 peer-[.playing]:opacity-0"
          unoptimized
        />
      )}
      <video
        ref={videoRef}
        src={hlsUrl}
        autoPlay={autoplay}
        controls={controls}
        muted={muted}
        loop={loop}
        className="w-full h-full"
        onPlay={() => onPlay?.()}
        onPause={() => onPause?.()}
        onEnded={() => onEnded?.()}
        playsInline
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

