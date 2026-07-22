import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'data', 'vehicle_custom_dates.json');

const app = express();
const PORT = 3005;

app.use(cors());
app.use(express.json());

const cyrillicToLatinMap = {
  'А': 'A', 'Б': 'B', 'В': 'B', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ж': 'J',
  'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'H',
  'О': 'O', 'П': 'P', 'Р': 'P', 'С': 'C', 'Т': 'T', 'У': 'Y', 'Ф': 'F',
  'Х': 'X', 'Ц': 'C', 'Ч': 'CH', 'Ш': 'SH', 'Щ': 'SHT', 'Ъ': 'A', 'Ь': 'Y',
  'Ю': 'YU', 'Я': 'YA'
};

function isVIN(input) {
  const latin = input.split('').map(c => cyrillicToLatinMap[c] || c).join('');
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(latin);
}

app.get('/api/check-plate/:plate', async (req, res) => {
  // Strip spaces and hyphens, convert to uppercase
  const rawPlate = req.params.plate || '';
  const plate = rawPlate.replace(/[\s-]/g, '').toUpperCase();
  const latinPlate = plate.split('').map(c => cyrillicToLatinMap[c] || c).join('');

  // Load custom dates if they exist
  let customDatesData = {};
  try {
    const fileContent = await fs.readFile(DB_PATH, 'utf-8');
    customDatesData = JSON.parse(fileContent);
  } catch (e) {
    // If file doesn't exist or is invalid, just proceed
  }
  const customDates = customDatesData[latinPlate] || {};

  // Create base response with "no_data" for protected fields
  const baseResponse = {
    plate,
    formattedPlate: plate,
    checkTimestamp: new Date().toISOString(),
    overallStatus: 'warning',
    customDates,
    vehicle: {
      make: 'Няма данни',
      model: 'Няма данни',
      year: 0,
      engineType: 'Няма данни',
      powerHp: 0,
      vin: 'Няма данни',
      color: 'Няма данни',
      category: 'Няма данни',
      firstRegistrationDate: 'Няма данни',
      euroStandard: 'Няма данни'
    },
    insurance: {
      status: 'no_data',
      statusText: 'Няма данни',
      insurer: 'Няма данни',
      expiryDate: 'Няма данни',
      policyNumber: 'Няма данни',
      remainingDays: 0,
      annualCostBgn: 0
    },
    inspection: {
      status: 'no_data',
      statusText: 'Няма данни',
      expiryDate: 'Няма данни',
      remainingDays: 0,
      inspectionStation: 'Няма данни',
      ecoCategory: 'Няма данни',
      certificateNumber: 'Няма данни'
    },
    tax: {
      status: 'no_data',
      statusText: 'Няма данни',
      municipality: 'Няма данни',
      taxYear: new Date().getFullYear(),
      amountBgn: 0,
      dueDate: 'Няма данни'
    },
    vignette: {
      vignetteType: 'Няма данни',
      status: 'no_data',
      statusText: 'Няма данни',
      expiryDate: 'Няма данни',
      remainingDays: 0,
      serialNumber: '—',
      priceBgn: 0
    }
  };

  if (isVIN(plate)) {
    try {
      const nhtsaRes = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${encodeURIComponent(latinPlate)}?format=json`);
      if (nhtsaRes.ok) {
        const data = await nhtsaRes.json();
        const results = data.Results || [];
        const getValue = (varName) => {
          const item = results.find(r => r.Variable === varName);
          return item && item.Value && item.Value !== "Not Applicable" ? item.Value : 'Няма данни';
        };

        baseResponse.vehicle.make = getValue("Make") || 'Няма данни';
        baseResponse.vehicle.model = getValue("Model") || 'Няма данни';
        
        const year = getValue("Model Year");
        baseResponse.vehicle.year = year !== 'Няма данни' ? parseInt(year, 10) : 0;
        
        baseResponse.vehicle.category = getValue("Body Class") || 'Няма данни';
        baseResponse.vehicle.engineType = getValue("Fuel Type - Primary") || 'Няма данни';
        
        const displacement = getValue("Displacement (L)");
        if (displacement !== 'Няма данни') {
           baseResponse.vehicle.engineCapacityCc = parseFloat(displacement) * 1000;
        }

        baseResponse.vehicle.country = getValue("Plant Country") || getValue("Manufacturer Name") || 'Няма данни';
        baseResponse.vehicle.vin = latinPlate;
        baseResponse.overallStatus = 'success';
        
        return res.json(baseResponse);
      }
    } catch (error) {
      console.error(`[VIN Fetch Error] ${error.message}`);
    }
  }

  try {
    // Make live request to BG Toll official public API
    const tollResponse = await fetch(`https://check.bgtoll.bg/check/vignette/plate/BG/${encodeURIComponent(latinPlate)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (tollResponse.ok) {
      const data = await tollResponse.json();

      if (data && data.ok === true && data.vignette) {
        const vig = data.vignette;
        
        let parsedTime = 0;
        let validToDateStr = 'Няма данни';
        
        // Handle validityDateToFormated (e.g., "16.04.2027 23:59:59")
        if (vig.validityDateToFormated) {
           const parts = vig.validityDateToFormated.split(' ');
           const datePart = parts[0]; // "16.04.2027"
           validToDateStr = datePart;
           
           if (datePart.includes('.')) {
              const [day, month, year] = datePart.split('.');
              const timePart = parts[1] || '23:59:59';
              parsedTime = new Date(`${year}-${month}-${day}T${timePart}`).getTime();
           }
        } else if (vig.validityDateTo && typeof vig.validityDateTo === 'number') {
           parsedTime = vig.validityDateTo;
           validToDateStr = new Date(parsedTime).toISOString().split('T')[0];
        } else if (vig.validityDateTo && typeof vig.validityDateTo === 'string') {
           // fallback if it's an ISO string
           parsedTime = new Date(vig.validityDateTo).getTime();
           validToDateStr = vig.validityDateTo.split('T')[0];
        }

        const now = Date.now();
        const remainingMs = parsedTime ? parsedTime - now : -1;
        const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
        const isValid = remainingDays > 0;

        let vigType = vig.type || 'Е-винетка';
        if (vigType === 'ANNUAL') vigType = 'Годишна';
        else if (vigType === 'MONTHLY') vigType = 'Месечна';
        else if (vigType === 'WEEKLY') vigType = 'Седмична';
        else if (vigType === 'WEEKEND') vigType = 'Уикенд';
        else if (vigType === 'QUARTERLY') vigType = 'Тримесечна';

        baseResponse.vignette = {
          vignetteType: vigType,
          status: isValid ? 'valid' : 'expired',
          statusText: isValid ? 'Валидна' : 'Изтекла',
          expiryDate: validToDateStr,
          // Only force 0 if it's genuinely expired and less than 0, else keep the negative value so the UI shows "Изтекла преди X дни"
          remainingDays: remainingDays || 0,
          serialNumber: vig.vignetteNumber || vig.id || '—',
          priceBgn: vig.price || 0
        };
      } else {
        // Vehicle checked successfully, but NO ACTIVE VIGNETTE found in BG Toll registry
        baseResponse.vignette = {
          vignetteType: 'Е-винетка',
          status: 'expired',
          statusText: 'Няма намерена винетка',
          expiryDate: 'Няма активна винетка',
          remainingDays: 0,
          serialNumber: '—',
          priceBgn: 0
        };
      }
    } else {
      console.warn(`BG Toll API returned HTTP status ${tollResponse.status}`);
      baseResponse.vignette = {
        vignetteType: 'Е-винетка',
        status: 'no_data',
        statusText: 'Грешка при проверка',
        expiryDate: 'Няма данни',
        remainingDays: 0,
        serialNumber: '—',
        priceBgn: 0
      };
    }
  } catch (error) {
    console.error(`[Vignette Fetch Error] ${error.message}`);
    baseResponse.vignette = {
      vignetteType: 'Е-винетка',
      status: 'no_data',
      statusText: 'Неуспешна връзка',
      expiryDate: 'Няма данни',
      remainingDays: 0,
      serialNumber: '—',
      priceBgn: 0
    };
  }

  return res.json(baseResponse);
});

// Endpoint to update custom dates
app.post('/api/custom-dates/:plate', async (req, res) => {
  const rawPlate = req.params.plate || '';
  const plate = rawPlate.replace(/[\s-]/g, '').toUpperCase();
  const latinPlate = plate.split('').map(c => cyrillicToLatinMap[c] || c).join('');
  const { field, value } = req.body;

  if (!field) {
    return res.status(400).json({ error: 'Field is required' });
  }

  try {
    let customDatesData = {};
    try {
      const fileContent = await fs.readFile(DB_PATH, 'utf-8');
      customDatesData = JSON.parse(fileContent);
    } catch (e) {
      // File doesn't exist, we will create it
    }

    if (!customDatesData[latinPlate]) {
      customDatesData[latinPlate] = {};
    }

    if (value) {
      customDatesData[latinPlate][field] = value;
    } else {
      delete customDatesData[latinPlate][field];
    }
    
    customDatesData[latinPlate].updated_at = new Date().toISOString();

    // Ensure directory exists
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(customDatesData, null, 2), 'utf-8');

    res.json({ success: true, plate: latinPlate, data: customDatesData[latinPlate] });
  } catch (error) {
    console.error(`[Custom Dates Error] ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

export default app;
