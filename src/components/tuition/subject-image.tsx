"use client";
import { useState } from "react";
import Image from "next/image";
import { subjectPhoto } from "@/lib/subject-photos";
import { SubjectVisual } from "./subject-visual";

/** Photo for a subject. Falls back to the gradient visual if the photo is missing or fails to load. */
export function SubjectImage({ subject, alt, sizes, priority, className = "" }: { subject: string; alt: string; sizes: string; priority?: boolean; className?: string }) {
  const [failed, setFailed] = useState(false);
  const src = subjectPhoto(subject);
  if (!src || failed) return <SubjectVisual subject={subject} className="absolute inset-0 size-full" />;
  return <Image src={src} alt={alt} fill unoptimized priority={priority} sizes={sizes} onError={() => setFailed(true)} className={`object-cover ${className}`} />;
}
