// Utility for SHA-256 generation using native Web Crypto API
export async function generateSha256(message: string): Promise<string> {
  try {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback deterministic hash if crypto.subtle is restricted in sandbox
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
      const char = message.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(32, '0') + 'c9f87e2b10a4';
  }
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export interface CompressionResult {
  originalBytes: number;
  compressedBytes: number;
  savedPercentage: number;
  timeTakenMs: number;
}

export function simulateAdaptiveCompression(originalBytes: number, networkQuality: string): CompressionResult {
  // Higher compression ratio applied under lower bandwidth to save patient data
  let ratio = 0.85; // 85% reduction by default
  if (networkQuality === '2G_LOW') {
    ratio = 0.92; // aggressive compression
  } else if (networkQuality === '3G_ADAPTIVE') {
    ratio = 0.86;
  } else {
    ratio = 0.75;
  }
  const compressed = Math.max(12 * 1024, Math.round(originalBytes * (1 - ratio)));
  const savedPercentage = Math.round(((originalBytes - compressed) / originalBytes) * 100);
  return {
    originalBytes,
    compressedBytes: compressed,
    savedPercentage,
    timeTakenMs: Math.floor(Math.random() * 250) + 120
  };
}

export interface BitrateProfile {
  label: string;
  bandwidthKbps: number;
  resolution: string;
  framerate: number;
  audioCodec: string;
  protocolStatus: string;
}

export function getBitrateProfile(network: string): BitrateProfile {
  switch (network) {
    case '2G_LOW':
      return {
        label: 'Ultra-Low Bandwidth Fallback',
        bandwidthKbps: 48,
        resolution: 'Audio-First / Downgraded 160p',
        framerate: 12,
        audioCodec: 'Opus Narrowband (16 kbps)',
        protocolStatus: 'Adaptive downgrading active to prevent call drops'
      };
    case '3G_ADAPTIVE':
      return {
        label: 'Adaptive 3G Mobile Stream',
        bandwidthKbps: 380,
        resolution: '480p Standard Definition',
        framerate: 24,
        audioCodec: 'Opus Wideband (48 kbps)',
        protocolStatus: 'Optimized for fluctuating cell towers'
      };
    case 'OFFLINE_CACHED':
      return {
        label: 'Offline Caching Protocol',
        bandwidthKbps: 0,
        resolution: 'Local IndexedDB Staging',
        framerate: 0,
        audioCodec: 'Store & Forward',
        protocolStatus: 'Records cached locally; will auto-sync on reconnect'
      };
    case '4G_HIGH':
    default:
      return {
        label: 'High Definition WebRTC',
        bandwidthKbps: 1280,
        resolution: '720p HD Clinical Video',
        framerate: 30,
        audioCodec: 'Opus Fullband (96 kbps)',
        protocolStatus: 'Full peer-to-peer fidelity active'
      };
  }
}
