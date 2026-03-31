const GHL_TOKEN = 'pit-892c127e-210b-48af-b71c-2e682baa6ce4';
const GHL_LOCATION = 'tU5RspLbwv7W9cxoWDwv';

export async function registerWithGHL(email, sobrietyDate) {
  try {
    const response = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GHL_TOKEN}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locationId: GHL_LOCATION,
        email: email,
        tags: ['jss-user'],
        customField: {
          'contact.sobriety_date': sobrietyDate || null,
          'contact.jss_user': 'Yes',
        },
        source: 'JustStaySober App',
      }),
    });
    const data = await response.json();
    console.log('GHL contact created:', data?.contact?.id);
    return data;
  } catch (err) {
    console.error('GHL registration failed (non-blocking):', err);
    // Silent fail — don't block the user experience
  }
}
