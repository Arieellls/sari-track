import { XataClient } from "@/xata";

let instance: XataClient | null = null;

export const getXataClient = () => {
  if (instance) return instance;
  instance = new XataClient({
    apiKey: process.env.XATA_API_KEY,
    branch: process.env.XATA_BRANCH
  });
  return instance;
};
