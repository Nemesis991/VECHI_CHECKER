import { CheckResult, SamplePreset } from '../types';
import { formatPlateDisplay, getDaysRemaining, calculateStatusFromDays } from '../utils/plateUtils';

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    plate: 'СА 1234 АВ',
    title: 'Изряден автомобил',
    subtitle: 'Всички документи са валидни',
    statusType: 'valid',
  },
  {
    plate: 'СВ 8888 КК',
    title: 'Изтичаща застраховка',
    subtitle: 'Гражданска отговорност изтича след 6 дни',
    statusType: 'expiring',
  },
  {
    plate: 'В 9999 ХХ',
    title: 'Изтекъл ГТП и Винетка',
    subtitle: 'Изисква незабавно подновяване',
    statusType: 'expired',
  },
  {
    plate: 'РВ 4321 НН',
    title: 'Дължим Данък МПС',
    subtitle: 'Неплатен данък към Община Пловдив',
    statusType: 'unpaid',
  },
];

// Helper to construct dates relative to today (simulated 2026-07-22)
function createRelativeDateStr(offsetDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split('T')[0];
}

function formatDateBulgarian(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}.${month}.${year} г.`;
}

/**
 * Deterministically hash a string to a integer number
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Generates mock result for a given plate string
 */
export function generateMockResult(plateInput: string): CheckResult {
  const formattedPlate = formatPlateDisplay(plateInput) || 'СА 0000 ХХ';
  const cleanKey = formattedPlate.replace(/\s+/g, '').toUpperCase();
  const hash = hashString(cleanKey);

  // 1. Check if input matches explicit presets for perfect testing
  if (cleanKey === 'СА1234АВ' || cleanKey === 'CA1234AB') {
    const insExp = createRelativeDateStr(145);
    const gtpExp = createRelativeDateStr(210);
    const vinExp = createRelativeDateStr(88);
    return {
      plate: cleanKey,
      formattedPlate: 'СА 1234 АВ',
      checkTimestamp: new Date().toLocaleString('bg-BG'),
      vehicle: {
        make: 'BMW',
        model: '530d xDrive (G30)',
        year: 2021,
        engineType: 'Дизел / Mild Hybrid',
        powerHp: 286,
        engineCapacityCc: 2993,
        vin: 'WBA11CH020CB12345',
        color: 'Черен металик (Black Sapphire)',
        category: 'М1 - Лек автомобил',
        firstRegistrationDate: '15.03.2021 г.',
        euroStandard: 'EURO 6d',
      },
      insurance: {
        status: 'valid',
        statusText: 'Валидна',
        insurer: 'ДЗИ Застраховане АД',
        expiryDate: formatDateBulgarian(insExp),
        policyNumber: 'BG/20/126/00984321',
        remainingDays: getDaysRemaining(insExp),
        annualCostBgn: 340,
      },
      inspection: {
        status: 'valid',
        statusText: 'Валиден',
        expiryDate: formatDateBulgarian(gtpExp),
        remainingDays: getDaysRemaining(gtpExp),
        inspectionStation: 'Пункт №1042 - СБА София Изток',
        ecoCategory: 'ЕКО 4 (Еколог. група IV)',
        certificateNumber: 'Удостоверение № 0089421',
      },
      vignette: {
        vignetteType: 'Годишна винетка',
        status: 'valid',
        statusText: 'Валидна',
        expiryDate: formatDateBulgarian(vinExp),
        remainingDays: getDaysRemaining(vinExp),
        serialNumber: 'BG-VIN-2026-094821',
        priceBgn: 87,
      },
      tax: {
        status: 'paid',
        statusText: 'Платен',
        municipality: 'Столична Община (район Младост)',
        taxYear: 2026,
        amountBgn: 284.50,
        dueDate: '30.06.2026 г.',
      },
      overallStatus: 'valid',
    };
  }

  if (cleanKey === 'СВ8888КК' || cleanKey === 'CB8888KK') {
    const insExp = createRelativeDateStr(6); // 6 days left -> Expiring
    const gtpExp = createRelativeDateStr(120);
    const vinExp = createRelativeDateStr(190);
    return {
      plate: cleanKey,
      formattedPlate: 'СВ 8888 КК',
      checkTimestamp: new Date().toLocaleString('bg-BG'),
      vehicle: {
        make: 'Audi',
        model: 'A6 Avant 3.0 TDI',
        year: 2019,
        engineType: 'Дизел',
        powerHp: 286,
        engineCapacityCc: 2967,
        vin: 'WAUZZZF20KN088888',
        color: 'Сив металик (Daytona Gray)',
        category: 'М1 - Лек автомобил',
        firstRegistrationDate: '08.10.2019 г.',
        euroStandard: 'EURO 6c',
      },
      insurance: {
        status: 'expiring',
        statusText: 'Изтича скоро (след 6 дни)',
        insurer: 'ЗД Лев Инс АД',
        expiryDate: formatDateBulgarian(insExp),
        policyNumber: 'BG/20/118/00554120',
        remainingDays: getDaysRemaining(insExp),
        annualCostBgn: 320,
      },
      inspection: {
        status: 'valid',
        statusText: 'Валиден',
        expiryDate: formatDateBulgarian(gtpExp),
        remainingDays: getDaysRemaining(gtpExp),
        inspectionStation: 'Пункт №1008 - Второ ГТП София',
        ecoCategory: 'ЕКО 4 (Еколог. група IV)',
        certificateNumber: 'Удостоверение № 0071239',
      },
      vignette: {
        vignetteType: 'Годишна винетка',
        status: 'valid',
        statusText: 'Валидна',
        expiryDate: formatDateBulgarian(vinExp),
        remainingDays: getDaysRemaining(vinExp),
        serialNumber: 'BG-VIN-2026-781203',
        priceBgn: 87,
      },
      tax: {
        status: 'paid',
        statusText: 'Платен',
        municipality: 'Столична Община (район Лозенец)',
        taxYear: 2026,
        amountBgn: 310.00,
        dueDate: '30.06.2026 г.',
      },
      overallStatus: 'warning',
    };
  }

  if (cleanKey === 'В9999ХХ' || cleanKey === 'B9999XX') {
    const insExp = createRelativeDateStr(90);
    const gtpExp = createRelativeDateStr(-18); // expired 18 days ago
    const vinExp = createRelativeDateStr(-4); // expired 4 days ago
    return {
      plate: cleanKey,
      formattedPlate: 'В 9999 ХХ',
      checkTimestamp: new Date().toLocaleString('bg-BG'),
      vehicle: {
        make: 'Volkswagen',
        model: 'Golf 2.0 TDI (VII GTD)',
        year: 2016,
        engineType: 'Дизел',
        powerHp: 184,
        engineCapacityCc: 1968,
        vin: 'WVWZZZAUZGW099999',
        color: 'Тъмно син (Night Blue)',
        category: 'М1 - Лек автомобил',
        firstRegistrationDate: '04.05.2016 г.',
        euroStandard: 'EURO 6',
      },
      insurance: {
        status: 'valid',
        statusText: 'Валидна',
        insurer: 'ЗК Армеец АД',
        expiryDate: formatDateBulgarian(insExp),
        policyNumber: 'BG/20/102/00331902',
        remainingDays: getDaysRemaining(insExp),
        annualCostBgn: 290,
      },
      inspection: {
        status: 'expired',
        statusText: 'ИЗТЕКЪЛ! (преди 18 дни)',
        expiryDate: formatDateBulgarian(gtpExp),
        remainingDays: getDaysRemaining(gtpExp),
        inspectionStation: 'Пункт №3012 - Варна Автосервиз',
        ecoCategory: 'ЕКО 3 (Еколог. група III)',
        certificateNumber: 'Удостоверение № 0048123',
      },
      vignette: {
        vignetteType: 'Месечна винетка',
        status: 'expired',
        statusText: 'ИЗТЕКЛА! (преди 4 дни)',
        expiryDate: formatDateBulgarian(vinExp),
        remainingDays: getDaysRemaining(vinExp),
        serialNumber: 'BG-VIN-2026-003391',
        priceBgn: 30,
      },
      tax: {
        status: 'paid',
        statusText: 'Платен',
        municipality: 'Община Варна (район Приморски)',
        taxYear: 2026,
        amountBgn: 175.00,
        dueDate: '30.06.2026 г.',
      },
      overallStatus: 'danger',
    };
  }

  if (cleanKey === 'РВ4321НН' || cleanKey === 'PB4321HH') {
    const insExp = createRelativeDateStr(180);
    const gtpExp = createRelativeDateStr(60);
    const vinExp = createRelativeDateStr(120);
    return {
      plate: cleanKey,
      formattedPlate: 'РВ 4321 НН',
      checkTimestamp: new Date().toLocaleString('bg-BG'),
      vehicle: {
        make: 'Mercedes-Benz',
        model: 'E 220 d (W213)',
        year: 2018,
        engineType: 'Дизел',
        powerHp: 194,
        engineCapacityCc: 1950,
        vin: 'WDD2130041A432100',
        color: 'Сребърен металик (Iridium Silver)',
        category: 'М1 - Лек автомобил',
        firstRegistrationDate: '11.09.2018 г.',
        euroStandard: 'EURO 6d-TEMP',
      },
      insurance: {
        status: 'valid',
        statusText: 'Валидна',
        insurer: 'Евроинс АД',
        expiryDate: formatDateBulgarian(insExp),
        policyNumber: 'BG/20/105/00774129',
        remainingDays: getDaysRemaining(insExp),
        annualCostBgn: 310,
      },
      inspection: {
        status: 'valid',
        statusText: 'Валиден',
        expiryDate: formatDateBulgarian(gtpExp),
        remainingDays: getDaysRemaining(gtpExp),
        inspectionStation: 'Пункт №2004 - Авто Експерт Пловдив',
        ecoCategory: 'ЕКО 4 (Еколог. група IV)',
        certificateNumber: 'Удостоверение № 0061920',
      },
      vignette: {
        vignetteType: 'Годишна винетка',
        status: 'valid',
        statusText: 'Валидна',
        expiryDate: formatDateBulgarian(vinExp),
        remainingDays: getDaysRemaining(vinExp),
        serialNumber: 'BG-VIN-2026-339102',
        priceBgn: 87,
      },
      tax: {
        status: 'unpaid',
        statusText: 'НЕПЛАТЕН!',
        municipality: 'Община Пловдив (район Централен)',
        taxYear: 2026,
        amountBgn: 215.40,
        dueDate: '30.06.2026 г.',
      },
      overallStatus: 'danger',
    };
  }

  // 2. Dynamic generation based on hash for any user-typed plate
  const makes = ['Toyota', 'Skoda', 'Mercedes-Benz', 'Audi', 'BMW', 'Volkswagen', 'Honda', 'Hyundai', 'Volvo', 'Peugeot', 'Ford'];
  const models: Record<string, string[]> = {
    'Toyota': ['RAV4 Hybrid', 'Corolla 1.8 Hybrid', 'Camry 2.5 Hybrid', 'Yaris Cross'],
    'Skoda': ['Octavia Combi 2.0 TDI', 'Superb 2.0 TSI 4x4', 'Kodiaq 2.0 TDI'],
    'Mercedes-Benz': ['C 220 d (W205)', 'E 300 e Hybrid', 'GLE 350 d 4MATIC'],
    'Audi': ['A4 2.0 TDI quattro', 'Q5 40 TDI', 'A5 Sportback 2.0 TFSI'],
    'BMW': ['320d xDrive (G20)', 'X5 xDrive30d (G05)', '118i (F40)'],
    'Volkswagen': ['Passat 2.0 TDI', 'Tiguan 2.0 TDI 4Motion', 'Golf 8 1.5 eTSI'],
    'Honda': ['CR-V 2.0 i-MMD Hybrid', 'Civic 1.5 VTEC Turbo'],
    'Hyundai': ['Tucson 1.6 T-GDI 4WD', 'i30 Fastback 1.4 T-GDI'],
    'Volvo': ['XC60 B5 Mild Hybrid', 'V60 D4 Cross Country'],
    'Peugeot': ['3008 1.5 BlueHDi', '508 SW 2.0 BlueHDi'],
    'Ford': ['Focus 1.5 EcoBlue', 'Kuga 2.5 Duratec FHEV']
  };
  const insurers = ['ДЗИ Застраховане АД', 'ЗД Лев Инс АД', 'ЗК Армеец АД', 'Застрахователно дружество Бул Инс АД', 'ЗД Евроинс АД', 'Алианц България АД'];
  const municipalities = ['Столична Община', 'Община Пловдив', 'Община Варна', 'Община Бургас', 'Община Русе', 'Община Стара Загора', 'Община Велико Търново', 'Община Плевен'];
  const colors = ['Черен металик', 'Бял перлен', 'Тъмно син металик', 'Сребърен металик', 'Сив (Nardo Gray)', 'Червен металик'];

  const selectedMake = makes[hash % makes.length];
  const modelList = models[selectedMake] || ['2.0 TDI'];
  const selectedModel = modelList[hash % modelList.length];
  const selectedYear = 2015 + (hash % 10);
  const selectedColor = colors[hash % colors.length];
  const selectedInsurer = insurers[hash % insurers.length];
  const selectedMunicipality = municipalities[hash % municipalities.length];

  // Pseudo-random date scenarios based on hash modulo
  const scenarioMod = hash % 5;
  let insDays = 120 + (hash % 180);
  let gtpDays = 40 + (hash % 200);
  let vinDays = 15 + (hash % 150);
  let isTaxPaid = true;

  if (scenarioMod === 1) {
    insDays = 5; // expiring
  } else if (scenarioMod === 2) {
    gtpDays = -12; // expired
  } else if (scenarioMod === 3) {
    vinDays = -2; // expired
  } else if (scenarioMod === 4) {
    isTaxPaid = false; // unpaid
  }

  const insExpDateStr = createRelativeDateStr(insDays);
  const gtpExpDateStr = createRelativeDateStr(gtpDays);
  const vinExpDateStr = createRelativeDateStr(vinDays);

  const insStatus = calculateStatusFromDays(insDays);
  const gtpStatus = calculateStatusFromDays(gtpDays);
  const vinStatus = calculateStatusFromDays(vinDays);
  const taxStatus = isTaxPaid ? 'paid' : 'unpaid';

  let overallStatus: 'valid' | 'warning' | 'danger' = 'valid';
  if (insStatus === 'expired' || gtpStatus === 'expired' || vinStatus === 'expired' || !isTaxPaid) {
    overallStatus = 'danger';
  } else if (insStatus === 'expiring' || gtpStatus === 'expiring' || vinStatus === 'expiring') {
    overallStatus = 'warning';
  }

  const vinNum = `W${selectedMake.substring(0, 2).toUpperCase()}ZZZ${(hash * 93).toString(36).toUpperCase().padStart(12, '0')}`.substring(0, 17);

  return {
    plate: cleanKey,
    formattedPlate,
    checkTimestamp: new Date().toLocaleString('bg-BG'),
    vehicle: {
      make: selectedMake,
      model: selectedModel,
      year: selectedYear,
      engineType: hash % 3 === 0 ? 'Бензин' : (hash % 3 === 1 ? 'Дизел' : 'Хибрид (Бензин/Електро)'),
      powerHp: 130 + (hash % 160),
      engineCapacityCc: 1400 + (hash % 1200),
      vin: vinNum,
      color: selectedColor,
      category: 'М1 - Лек автомобил',
      firstRegistrationDate: `12.05.${selectedYear} г.`,
      euroStandard: selectedYear >= 2021 ? 'EURO 6d' : (selectedYear >= 2018 ? 'EURO 6c' : 'EURO 6'),
    },
    insurance: {
      status: insStatus,
      statusText: insStatus === 'valid' ? 'Валидна' : (insStatus === 'expiring' ? `Изтича скоро (${insDays} дни)` : 'ИЗТЕКЛА!'),
      insurer: selectedInsurer,
      expiryDate: formatDateBulgarian(insExpDateStr),
      policyNumber: `BG/20/${100 + (hash % 50)}/${(100000 + hash % 900000)}`,
      remainingDays: insDays,
      annualCostBgn: 260 + (hash % 120),
    },
    inspection: {
      status: gtpStatus,
      statusText: gtpStatus === 'valid' ? 'Валиден' : (gtpStatus === 'expiring' ? `Изтича скоро (${gtpDays} дни)` : 'ИЗТЕКЪЛ!'),
      expiryDate: formatDateBulgarian(gtpExpDateStr),
      remainingDays: gtpDays,
      inspectionStation: `Пункт №${1000 + (hash % 800)} - Авто Контрол`,
      ecoCategory: `ЕКО ${(hash % 3) + 3} (Еколог. група)`,
      certificateNumber: `Удостоверение № ${(hash * 17) % 900000 + 100000}`,
    },
    vignette: {
      vignetteType: hash % 4 === 0 ? 'Месечна винетка' : 'Годишна винетка',
      status: vinStatus,
      statusText: vinStatus === 'valid' ? 'Валидна' : (vinStatus === 'expiring' ? `Изтича скоро (${vinDays} дни)` : 'ИЗТЕКЛА!'),
      expiryDate: formatDateBulgarian(vinExpDateStr),
      remainingDays: vinDays,
      serialNumber: `BG-VIN-2026-${(hash * 31) % 900000 + 100000}`,
      priceBgn: hash % 4 === 0 ? 30 : 87,
    },
    tax: {
      status: taxStatus,
      statusText: isTaxPaid ? 'Платен' : 'НЕПЛАТЕН!',
      municipality: selectedMunicipality,
      taxYear: 2026,
      amountBgn: 140 + (hash % 180),
      dueDate: '30.06.2026 г.',
    },
    overallStatus,
  };
}
