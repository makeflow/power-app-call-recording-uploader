export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `${year}/${month}/${day} ${two(hour)}:${two(minute)}`;
}

function two(n: number): string {
  return n < 10 ? '0' + n : String(n);
}
