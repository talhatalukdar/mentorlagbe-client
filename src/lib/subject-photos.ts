/**
 * Free-to-use Pexels photos (Pexels licence) matched to each subject.
 * The IDs below were taken from Pexels search results; the UI falls back to a gradient if an image fails to load.
 */
const IDS: Record<string, number> = {
  Mathematics: 8197536,
  Physics: 6208709,
  Chemistry: 6208711,
  Biology: 8617845,
  English: 6929183,
  ICT: 5474295,
  Programming: 574077,
  Accounting: 6929012,
  Economics: 6694535,
};

export const subjectPhoto = (subject: string, width = 900): string | null => {
  const id = IDS[subject];
  return id ? `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}` : null;
};
