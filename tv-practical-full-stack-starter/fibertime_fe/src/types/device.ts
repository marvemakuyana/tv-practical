export interface Device {
  code: string;
  isConnected: boolean;
  userPhone?: string;
  bundleInfo?: {
    days: number;
    hours: number;
  };
}
