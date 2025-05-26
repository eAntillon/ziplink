import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as RadixSwitch from '@radix-ui/react-switch'; // Import Switch from Radix UI
import { Cross2Icon } from '@radix-ui/react-icons';
import { Flex, Text } from '@radix-ui/themes'; // Import Flex and Text from Radix Themes
import { useLocalStorage } from 'usehooks-ts'; // Import useLocalStorage

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onOpenChange }) => {
  const [createEphemeralLinks, setCreateEphemeralLinks] = useLocalStorage(
    'createEphemeralLinksByDefault',
    false
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg focus:outline-none data-[state=open]:animate-contentShow max-h-[85vh] overflow-y-auto">
          <Dialog.Title className="mb-4 text-lg font-medium text-neutral-900">
            Application Settings
          </Dialog.Title>
          
          <Flex align="center" justify="between" className="mt-4 py-2">
            <Text size="2" as="label" htmlFor="ephemeral-switch" className="text-gray-700 select-none">
              Create ephemeral links by default
            </Text>
            <RadixSwitch.Root
              id="ephemeral-switch"
              checked={createEphemeralLinks}
              onCheckedChange={setCreateEphemeralLinks}
              className="relative h-[25px] w-[42px] cursor-pointer rounded-full bg-gray-300 shadow-sm outline-none data-[state=checked]:bg-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <RadixSwitch.Thumb className="block h-[21px] w-[21px] translate-x-0.5 transform rounded-full bg-white shadow-sm transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
            </RadixSwitch.Root>
          </Flex>

          <div className="my-5 border-t pt-4 mt-4"> {/* Added some separation */}
            Settings content will go here.
            <br />
            Theme selection (coming soon)
          </div>

          <Dialog.Close asChild>
            <button 
              className="absolute top-3 right-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-transparent text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300" 
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SettingsModal;
