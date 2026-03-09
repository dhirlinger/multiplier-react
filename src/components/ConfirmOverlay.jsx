export default function ConfirmOverlay({
  onClose,
  displayConfirm,
  confirmProps,
}) {
  return (
    <>
      <div
        className={`tw:fixed tw:inset-0 tw:z-50 tw:flex tw:items-center tw:justify-center tw:w-full tw:h-full tw:bg-gray-950 tw:transition-colors tw:duration-500 tw:ease-in-out ${
          displayConfirm
            ? "tw:bg-gray-950/90"
            : "tw:bg-gray-950/0 tw:pointer-events-none"
        }`}
      >
        <div
          className={`tw:bg-gray-900 tw:rounded-lg tw:shadow-lg tw:max-w-sm tw:w-full tw:transition-opacity tw:duration-500 tw:ease-in-out tw:border-[0.5px] tw:border-[#E6A60D] ${
            displayConfirm ? "tw:opacity-100" : "tw:opacity-0"
          }`}
        >
          <div className="tw:p-10 tw:text-gray-200 tw:text-lg tw:text-center tw:font-semibold">
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
          <div className="tw:flex tw:justify-end tw:p-4 tw:space-x-3 tw:bg-gray-700 tw:rounded-b-lg">
            {confirmProps.current.action !== "Name" && (
              <button
                onClick={onClose}
                className="tw:px-4 tw:py-2 tw:text-lg tw:bg-gray-200 tw:text-gray-800 tw:rounded hover:tw:bg-gray-300"
              >
                Cancel
              </button>
            )}
            <button
              onClick={confirmProps.current.handler}
              className={`tw:px-4 tw:py-2 tw:text-lg tw:text-white tw:rounded ${
                confirmProps.current.action !== "Name"
                  ? "tw:bg-red-500 hover:tw:bg-red-400 tw:border-red-600 tw:border-[.5]"
                  : "tw:bg-[#E6A60D] hover:tw:bg-gray-300"
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
