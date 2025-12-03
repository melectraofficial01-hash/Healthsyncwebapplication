// Vitals extraction from OCR text

export function extractVitalsFromText(text: string): any {
  const vitals: any = {};

  // Extract Blood Pressure
  const bpMatch = text.match(/(?:blood pressure|bp)[:\s]+(\d{2,3})\s*\/\s*(\d{2,3})/i);
  if (bpMatch) {
    vitals.systolic = parseInt(bpMatch[1]);
    vitals.diastolic = parseInt(bpMatch[2]);
    vitals.bloodPressure = `${bpMatch[1]}/${bpMatch[2]}`;
  }

  // Extract Blood Sugar
  const sugarMatch = text.match(/(?:blood sugar|glucose|fasting)[:\s]+(\d{2,3})\s*(?:mg\/dl)?/i);
  if (sugarMatch) {
    vitals.bloodSugar = parseInt(sugarMatch[1]);
  }

  // Extract Heart Rate
  const hrMatch = text.match(/(?:heart rate|pulse|hr)[:\s]+(\d{2,3})\s*(?:bpm)?/i);
  if (hrMatch) {
    vitals.heartRate = parseInt(hrMatch[1]);
  }

  // Extract Temperature
  const tempMatch = text.match(/(?:temperature|temp)[:\s]+(\d{2,3}\.?\d?)\s*(?:°?f)?/i);
  if (tempMatch) {
    vitals.temperature = parseFloat(tempMatch[1]);
  }

  // Extract Weight
  const weightMatch = text.match(/(?:weight)[:\s]+(\d{2,3})\s*(?:lbs|kg)?/i);
  if (weightMatch) {
    vitals.weight = parseInt(weightMatch[1]);
  }

  // Extract Cholesterol
  const cholMatch = text.match(/(?:cholesterol|total cholesterol)[:\s]+(\d{2,3})\s*(?:mg\/dl)?/i);
  if (cholMatch) {
    vitals.cholesterol = parseInt(cholMatch[1]);
  }

  // Extract HbA1c
  const hba1cMatch = text.match(/(?:hba1c)[:\s]+(\d\.?\d?)\s*%?/i);
  if (hba1cMatch) {
    vitals.hba1c = parseFloat(hba1cMatch[1]);
  }

  return vitals;
}
