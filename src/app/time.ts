export function timeToTimeAgo(time: string): string {
  const now: Date = new Date();
  const created: Date = new Date(time);
  const year: number = now.getFullYear() - created.getFullYear();
  const month: number = now.getMonth() - created.getMonth();
  const day: number = now.getDate() - created.getDate();
  const hour: number = now.getHours() - created.getHours();
  const minute: number = now.getMinutes() - created.getMinutes();
  const second: number = now.getSeconds() - created.getSeconds();

  if (year >= 1) {
    return `${year} years${year > 1 ? "s" : ""} ago`;
  } else if (month >= 1) {
    return `${month} month${month > 1 ? "s" : ""} ago`;
  } else if (day >= 1) {
    return `${day} day${day > 1 ? "s" : ""} ago`;
  } else if (hour >= 1) {
    return `${hour} hour${hour > 1 ? "s" : ""} ago`;
  } else if (minute >= 1) {
    return `${minute} minute${minute > 1 ? "s" : ""} ago`;
  } else if (second > 30) {
    return `${second} seconds ago`;
  } else {
    return "Just moments ago";
  }
}
