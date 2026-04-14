export const validateGlucoseValue = (value: number) => {
  if (value < 2 || value > 30) {
    throw new Error("Invalid glucose value (mmol/L)");
  }
};

export const getGlucoseStatus = (value: number) => {
  if (value < 4) {
    return "Low";
  }

  if (value <= 7) {
    return "Normal";
  }

  if (value <= 10) {
    return "High";
  }

  return "Very High";
};

export const formatReadingTime = (readingTime: Date | string) => {
  return new Date(readingTime).toISOString();
};
