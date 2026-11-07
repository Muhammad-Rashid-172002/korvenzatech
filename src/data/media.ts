/** Optimised WebP covers for the portfolio projects (/media/work/<base>-{800,1536}.webp). */
const PROJECT_MEDIA: Record<string, string> = {
  'fitmind-ai': 'fitmind',
  'ielts-ai-master': 'ielts',
  skillnova: 'skillnova',
  caredesk: 'caredesk',
};

export function projectImage(id: string, original: string) {
  const base = PROJECT_MEDIA[id];
  if (!base) return { src: original, srcSet: undefined as string | undefined };
  return {
    src: `/media/work/${base}-1536.webp`,
    srcSet: `/media/work/${base}-800.webp 800w, /media/work/${base}-1536.webp 1536w`,
  };
}
