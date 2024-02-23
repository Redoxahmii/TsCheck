export function convertTime(time: number) {
  const date = new Date(time);
  const formattedtime = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  console.log(formattedtime);
  return formattedtime;
}
