// Utility for mapping session duration to building type and images

export const buildingImages = {
  B1: process.env.PUBLIC_URL + '/BuildingsIsometric/B1-bg.png',
  B2: process.env.PUBLIC_URL + '/BuildingsIsometric/B2-bg.png',
  B3: process.env.PUBLIC_URL + '/BuildingsIsometric/B3-bg.png',
  B4: process.env.PUBLIC_URL + '/BuildingsIsometric/B4-bg.png',
};

export function getBuildingTypeForDuration(duration) {
  if (duration < 30) return 'B2';
  if (duration < 60) return 'B4';
  if (duration < 90) return 'B1'; // swapped: 60-90 min = B1
  return 'B3'; // swapped: 90-120 min = B3
} 