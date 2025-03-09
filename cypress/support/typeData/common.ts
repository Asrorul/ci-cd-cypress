export type OTPObject = {
    otp_code: string;
  };
  
  export type DropDownSettings = {
    apiToWait?: string;
    delayBefore?: number;
    retries?: number;
    index?: number;
  };
  
  export interface TypeInputSettings {
    delay?: number;
    delayBefore?: number;
    isCurrency?: boolean;
    isTextEditor?: boolean;
    isAutoSave?: boolean;
    index?: number;
    retries?: number;
  };
  
  export type SettingsParam = {
    delay?: number;
    delayBefore?: number;
    retries?: number;
    isCurrency?: boolean;
    isTextEditor?: boolean;
    isAutoSave?: boolean;
    index?: number;
  };
  
  export type RequestAPIParams = {
    method: string;
    path: string;
    token: string;
    platform?: string;
  };