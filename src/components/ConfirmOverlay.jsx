export default function ConfirmOverlay({ onClose, confirmProps }) {
  return (
    <>
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black w-screen h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Confirms</h2>
          </div>
          <div className="mb-4 text-gray-600">
            {confirmProps.current.action} Preset {confirmProps.current.num}
            {confirmProps.current.filler} {confirmProps.current.name}?
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={confirmProps.current.handler}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
