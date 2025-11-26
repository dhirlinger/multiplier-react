export default function ConfirmOverlay({
  onClose,
  displayConfirm,
  confirmProps,
}) {
  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-950 transition-colors duration-500 ease-in-out ${
          displayConfirm
            ? "bg-gray-950/90"
            : "bg-gray-950/0 pointer-events-none"
        }`}
      >
        <div
          className={`bg-gray-900 rounded-lg shadow-lg max-w-sm w-full transition-opacity duration-500 ease-in-out border-[0.5px] border-[#E6A60D] ${
            displayConfirm ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="p-10 text-gray-200 text-lg text-center font-semibold">
            {confirmProps.current.action !== "Name" && (
              <>
                {confirmProps.current.action} Preset {confirmProps.current.num}
                {confirmProps.current.filler} {confirmProps.current.name}?
              </>
            )}
            {confirmProps.current.action === "Name" && (
              <>Please enter a preset name.</>
            )}
          </div>
          <div className="flex justify-end p-4 space-x-3 bg-gray-700 rounded-b-lg">
            {confirmProps.current.action !== "Name" && (
              <button
                onClick={onClose}
                className="px-4 py-2 text-lg bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            )}
            <button
              onClick={confirmProps.current.handler}
              className={`px-4 py-2 text-lg text-white rounded ${
                confirmProps.current.action !== "Name"
                  ? "bg-red-500 hover:bg-red-400 border-red-600 border-[.5]"
                  : "bg-[#E6A60D] hover:bg-gray-300"
              }`}
            >
              {confirmProps.current.action !== "Name" &&
                confirmProps.current.action}
              {confirmProps.current.action === "Name" && "OK"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
