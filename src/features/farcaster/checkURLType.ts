export type URLType = 'image' | 'webpage' | 'unknown' | 'error';

export async function checkURLType(url: string): Promise<URLType> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType =
      response.headers.get('content-type')?.toLowerCase() || '';

    if (contentType.startsWith('image/')) {
      return 'image';
    } else if (contentType.includes('text/html')) {
      return 'webpage';
    } else {
      return 'unknown';
    }
  } catch (error) {
    console.error('error checking URL:', error);
    return 'error';
  }
}
