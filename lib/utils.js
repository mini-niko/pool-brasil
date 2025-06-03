import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const fetcher = (url) =>
  fetch(url).then(async (res) => {
    const body = await res.json();

    if (!res.ok) throw Error(body.message);

    return body;
  });
