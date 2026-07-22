export const saveVehicleDate = async (plate: string, field: string, value: string): Promise<boolean> => {
  if (!plate || !field) return false;
  
  try {
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3005';
    const response = await fetch(`${backendUrl}/api/custom-dates/${encodeURIComponent(plate)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ field, value }),
    });

    if (response.ok) {
      return true;
    } else {
      console.error('Failed to save date:', await response.text());
      return false;
    }
  } catch (error) {
    console.error('Network error saving date:', error);
    return false;
  }
};
