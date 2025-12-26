import {
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  PrinterIcon,
  DeviceTabletIcon,
  ServerStackIcon,
  WifiIcon,
  VideoCameraIcon,
  TvIcon,
  CommandLineIcon,
  CursorArrowRaysIcon,
  DocumentMagnifyingGlassIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

import { EquipmentType } from '../types/equipment.types';
import type { JSX } from 'react';

export const equipmentTypes: Array<{ value: EquipmentType; label: string; icon: JSX.Element; }> = [
  {
    value: EquipmentType.LAPTOP,
    label: "Laptop",
    icon: <ComputerDesktopIcon className="w-5 h-5" />,
  },
  {
    value: EquipmentType.PC,
    label: "PC",
    icon: <ComputerDesktopIcon className="w-5 h-5" />,
  },
  {
    value: EquipmentType.ALL_IN_ONE,
    label: "All in One",
    icon: <TvIcon className="w-5 h-5" />,
  },
  {
    value: EquipmentType.SERVER,
    label: "Servidor",
    icon: <ServerStackIcon className="w-5 h-5" />,
  },
  {
    value: EquipmentType.CELLPHONE,
    label: "Celular",
    icon: <DevicePhoneMobileIcon className="w-5 h-5" />,
  },
  {
    value: EquipmentType.PRINTER,
    label: "Impresora",
    icon: <PrinterIcon className="w-5 h-5" />,
  },
  {
    value: EquipmentType.SMARTWATCH,
    label: "Smartwatch",
    icon: <ClockIcon className="w-5 h-5" />,
  },
  {
    value: EquipmentType.TABLET,
    label: "Tablet",
    icon: <DeviceTabletIcon className="w-5 h-5" />,
  },
  {
    value: EquipmentType.ROUTER,
    label: "Router",
    icon: <WifiIcon className="w-5 h-5" />,
  },
  {
    value: EquipmentType.SWITCH,
    label: "Switch",
    icon: <CommandLineIcon className="w-5 h-5" />,
  },
  {
    value: EquipmentType.WEBCAM,
    label: "Webcam",
    icon: <VideoCameraIcon className="w-5 h-5" />,
  },
  {
    value: EquipmentType.MONITOR,
    label: "Monitor",
    icon: <TvIcon className="w-5 h-5" />,
  },
  {
    value: EquipmentType.KEYBOARD,
    label: "Teclado",
    icon: <CommandLineIcon className="w-5 h-5" />,
  },
  {
    value: EquipmentType.MOUSE,
    label: "Mouse",
    icon: <CursorArrowRaysIcon className="w-5 h-5" />,
  },
  {
    value: EquipmentType.SCAMNER,
    label: "Escáner",
    icon: <DocumentMagnifyingGlassIcon className="w-5 h-5" />,
  },
];