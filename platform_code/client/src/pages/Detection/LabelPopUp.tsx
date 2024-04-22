import React, { useState } from "react";
import { IRectObject, TLabel } from "../../services/imageDetectionService";

interface LabelPopupProps {
  selectedRectangle: IRectObject;
  onClose: () => void;
  onLabelChange: (id: number, label: TLabel) => void;
}

const LabelPopup: React.FC<LabelPopupProps> = ({
  selectedRectangle,
  onClose,
  onLabelChange,
}) => {
  const [label, setLabel] = useState<TLabel>(selectedRectangle.label);

  const handleLabelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLabel(e.target.value as unknown as TLabel);
  };

  const handleSaveLabel = () => {
    onLabelChange(selectedRectangle.id, label);
    onClose();
  };

  return (
    <div onClick={onClose}>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="fixed bg-white shadow-md rounded p-4"
          onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.stopPropagation();
          }}
        >
          <h2 className="text-lg font-semibold mb-2">Select Label</h2>
          <select
            value={label}
            onChange={handleLabelChange}
            className="w-full border rounded p-2 mb-2"
          >
            <option value="">Select a label</option>
            <option value="carpet">Carpet</option>
            <option value="mirror">Mirror</option>
          </select>
          <div className="flex justify-end">
            <button
              onClick={handleSaveLabel}
              className="bg-blue-500 text-white px-4 py-2 mr-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabelPopup;
