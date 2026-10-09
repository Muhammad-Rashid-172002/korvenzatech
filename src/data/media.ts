/** Optimised WebP derivatives for existing project imagery. Originals stay as fallbacks. */
const PROJECT_MEDIA: Record<string, string> = {
  'ielts-ai-master': 'ielts-ai-master',
  skilllink: 'skilllink',
};

export function projectImage(id: string, original: string) {
  const base = PROJECT_MEDIA[id];
  if (!base) return { src: original, srcSet: undefined as string | undefined };
  return {
    src: original,
    srcSet: `/media/work/${base}-800.webp 800w, /media/work/${base}-1536.webp 1536w`,
  };
}
