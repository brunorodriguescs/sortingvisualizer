import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {AnimatePresence, motion} from 'framer-motion';
import {useState} from 'react';
import {ChevronDownIcon} from '@radix-ui/react-icons';
import * as React from "react";


type Option = {
  label: string;
  onSelect: () => void;
};

interface DropdownProps {
  options: Option[];
  placeholder?: string;
}


export const Dropdown: React.FC<DropdownProps> = ({options, placeholder = "Select..." }) => {
  const [open, setOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const handleSelect = (option: Option) => {
    setSelectedLabel(option.label);
    option.onSelect();
    setOpen(false);
  };

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <motion.button
            initial={{scale: 1}}
            whileHover={{scale: 1.05}}
            transition={{duration: 0.2}}
            className="min-w-[158px] px-2 py-2 bg-blue-600 text-white rounded-md flex justify-between items-center hover:bg-blue-500 transition-shadow hover:shadow-[0_0_15px_4px_rgba(70,140,255,0.6)] active:shadow-[0_0_15px_4px_rgba(40,110,225,0.6)] cursor-pointer">
          {selectedLabel || placeholder}
          <ChevronDownIcon />
        </motion.button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <AnimatePresence>
          {open && (
            <DropdownMenu.Content asChild forceMount sideOffset={5}>
              <motion.div
                initial={{opacity: 0, scale: 0.95}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.95}}
                transition={{duration: 0.2}}
                className="bg-white border border-gray-200 rounded-md shadow-lg p-1 z-50"
              >
                {options.map((option) => (
                  <DropdownMenu.Item asChild
                    key={option.label}
                    onSelect={() => handleSelect(option)}
                  >
                    <motion.button
                      initial={{scale: 1}}
                      whileHover={{scale: 1.05}}
                      transition={{duration: 0.2}}
                      className="px-3 py-2 text-sm text-gray-700 hover:bg-indigo-100 rounded-md cursor-pointer"
                    >
                      {option.label}
                    </motion.button>
                  </DropdownMenu.Item>
                ))}
              </motion.div>
            </DropdownMenu.Content>
          )}
        </AnimatePresence>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}