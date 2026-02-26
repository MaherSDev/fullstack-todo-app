import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { type ReactNode } from "react";

interface IProps {
	isOpen: boolean;
	closeModal: () => void;
	title?: string;
	description?: string;
	children: ReactNode;
}

const Modal = ({isOpen, closeModal, title, description, children} : IProps) => {

  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className="relative h-screen focus:outline-none"
        onClose={closeModal}
      >
				<DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-lg bg-white p-2 sm:p-6 3xs:p-4 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
            >
              {title && <DialogTitle
                as="h3"
                className="text-base/7 capitalize font-medium text-black"
              >
                {title}
              </DialogTitle>}
              
              <div className="mt-4">
                {children}
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Modal;
