// backend/services/safeBrowsingService.js
import dotenv from 'dotenv';
dotenv.config();

export async function checkUrlSafety(url) {
  try {
    const apiKey = process.env.SAFE_BROWSING_KEY;
    const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;

    const body = {
      client: { clientId: 'scamshield', clientVersion: '1.0' },
      threatInfo: {
        threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [{ url }],
      },
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    // ถ้า Google พบภัยคุกคาม
    if (data.matches && data.matches.length > 0) {
      const threats = data.matches.map(m => m.threatType);
      return { isMalicious: true, threats };
    }

    return { isMalicious: false, threats: [] };
  } catch (err) {
    // ถ้า Safe Browsing API ล้มเหลว ให้ข้ามไปวิเคราะห์ด้วย Gemini แทน
    console.warn('⚠️ Safe Browsing unavailable:', err.message);
    return { isMalicious: false, threats: [], error: true };
  }
}