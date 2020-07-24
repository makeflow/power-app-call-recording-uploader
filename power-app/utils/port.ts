export function getPortFromUrl(url: string): number {
  const parsedUrl = new URL(url);
  const protocol = parsedUrl.protocol;
  if (protocol !== 'http:' && protocol !== 'https:') {
    throw new Error(`parse url error: unknown protocol ${protocol}`);
  }
  const port = parsedUrl.port;
  if (port === '') {
    if (protocol === 'http:') {
      return 80;
    }
    if (protocol === 'https:') {
      return 443;
    }
  }
  return parseInt(port, 10);
}
