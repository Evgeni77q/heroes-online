export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL!,
  wsUrl: process.env.NEXT_PUBLIC_WS_URL!,
};

if (!env.apiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

if (!env.wsUrl) {
  throw new Error("NEXT_PUBLIC_WS_URL is not defined");
}
