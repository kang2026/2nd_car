
export enum View {
  Dashboard = 'dashboard',
  Maintenance = 'maintenance',
  CarWash = 'carwash',
  Settings = 'settings'
}

export interface ConsumableStatus {
  lastChangedDate: string;
  lastChangedMileage: number;
  intervalMileage: number;
  intervalMonths: number;
}

export interface CarInfo {
  brand: string;
  model: string;
  subModel: string;
  imageUrl: string;
  mileage: number;
  plateNumber: string;
  deliveryDate: string;
  status: '최상' | '양호' | '보통' | '점검필요';
  consumables: {
    engineOil: ConsumableStatus;
    acFilter: ConsumableStatus;
    tires: ConsumableStatus;
    brakePads: ConsumableStatus;
  };
}

export interface MaintenanceRecord {
  id: string;
  part: string;
  desc: string;
  cost: number;
  date: string;
  time: string;
  method: 'shop' | 'self';
  icon: string;
}

export interface WashActivity {
  id: string;
  type: string;
  date: string;
  shop: string;
  category: 'manual' | 'auto';
  cost: number;
}
