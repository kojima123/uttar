export type BodySide = 'left' | 'right';
export type BodyArea = 'abdomen' | 'thigh' | 'arm';

export interface InjectionRecord {
  id: string;
  date: string; // YYYY-MM-DD
  side: BodySide;
  area: BodyArea;
  timestamp: number;
}

export type Language = 'ja' | 'en';

export interface AppSettings {
  tweetTemplate: string;
  language: Language;
}

const STORAGE_KEY_RECORDS = 'uttar_records';
const STORAGE_KEY_SETTINGS = 'uttar_settings';

const DEFAULT_SETTINGS: AppSettings = {
  tweetTemplate: '自己注射完了しました。 #Uttar #自己注射',
  language: 'ja',
};

export const getRecords = (): InjectionRecord[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_RECORDS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load records', e);
    return [];
  }
};

export const saveRecord = (record: Omit<InjectionRecord, 'id' | 'timestamp'>) => {
  const records = getRecords();
  const newRecord: InjectionRecord = {
    ...record,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  records.push(newRecord);
  localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
  return newRecord;
};

export const deleteRecord = (id: string) => {
  const records = getRecords();
  const newRecords = records.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(newRecords));
};

export const deleteAllRecords = () => {
  localStorage.removeItem(STORAGE_KEY_RECORDS);
};

export const getSettings = (): AppSettings => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: Partial<AppSettings>) => {
  const current = getSettings();
  const newSettings = { ...current, ...settings };
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(newSettings));
  return newSettings;
};

export const getAreaLabel = (area: BodyArea): string => {
  switch (area) {
    case 'abdomen': return '腹部';
    case 'thigh': return '太もも';
    case 'arm': return '腕';
    default: return area;
  }
};

export const getSideLabel = (side: BodySide): string => {
  switch (side) {
    case 'left': return '左';
    case 'right': return '右';
    default: return side;
  }
};
