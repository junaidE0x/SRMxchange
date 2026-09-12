// lib/images.ts
export const getCardImage = (url?: string): string | undefined => {
  if (!url) return undefined;
  return url.replace('/upload/', '/upload/w_400,h_300,c_fit,q_auto,f_auto/');
};

export const getDetailImage = (url?: string): string | undefined => {
  if (!url) return undefined;
  return url.replace('/upload/', '/upload/w_800,h_600,c_fit,q_auto,f_auto/');
};

