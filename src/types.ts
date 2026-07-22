export type StatusType = 'valid' | 'expiring' | 'expired' | 'paid' | 'unpaid' | 'no_data';

export interface VehicleDetails {
  make: string;
  model: string;
  year: number;
  engineType: string; // e.g. Дизел, Бензин, Електрически, Хибрид
  powerHp: number;
  engineCapacityCc?: number;
  vin: string;
  color: string;
  category: string; // e.g. М1 - Лек автомобил
  firstRegistrationDate: string;
  euroStandard: string; // e.g. EURO 6d
  country?: string;
}

export interface InsuranceDetails {
  status: StatusType;
  statusText: string;
  insurer: string; // e.g. ДЗИ, Лев Инс, Бул Инс, Armeec
  expiryDate: string;
  policyNumber: string;
  remainingDays: number;
  annualCostBgn: number;
}

export interface InspectionDetails {
  status: StatusType;
  statusText: string;
  expiryDate: string;
  remainingDays: number;
  inspectionStation: string;
  ecoCategory: string; // e.g. ЕКО 4
  certificateNumber: string;
}

export interface VignetteDetails {
  vignetteType: string; // e.g. Годишна, Месечна, Тримесечна, Уикенд
  status: StatusType;
  statusText: string;
  expiryDate: string;
  remainingDays: number;
  serialNumber: string;
  priceBgn: number;
}

export interface TaxDetails {
  status: StatusType;
  statusText: string;
  municipality: string;
  taxYear: number;
  amountBgn: number;
  dueDate: string;
}

export interface CustomDates {
  go_expiration?: string;
  tax_expiration?: string;
  gtp_expiration?: string;
  vignette_expiration?: string;
  parking_permit_expiration?: string;
  updated_at?: string;
}

export interface CheckResult {
  plate: string;
  formattedPlate: string;
  checkTimestamp: string;
  vehicle: VehicleDetails;
  insurance: InsuranceDetails;
  inspection: InspectionDetails;
  vignette: VignetteDetails;
  tax: TaxDetails;
  overallStatus: 'valid' | 'warning' | 'danger';
  customDates?: CustomDates;
}

export interface SamplePreset {
  plate: string;
  title: string;
  subtitle: string;
  statusType: 'valid' | 'expiring' | 'expired' | 'unpaid';
}
