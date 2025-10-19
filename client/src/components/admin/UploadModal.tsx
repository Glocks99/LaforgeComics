import React, { useState } from "react";
import { X, UploadCloud } from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  title?: string;
}

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title = "Upload Content",
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [text, setText] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!image || !text.trim()) return;

    const formData = new FormData();
    formData.append("image", image);
    formData.append("content", text);
    onSubmit(formData);
    onClose();
    setImage(null);
    setPreview(null);
    setText("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X />
        </button>

        {/* Title */}
        <h2 className="text-lg font-bold mb-4 text-gray-800">{title}</h2>

        {/* Image Upload */}
        <label className="block mb-2 text-sm text-gray-600">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4"
        />
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="h-40 w-full object-cover mb-4 rounded"
          />
        )}

        {/* Text Area */}
        <label className="block mb-2 text-sm text-gray-600">Content</label>
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write content..."
          className="w-full border border-gray-300 rounded-md p-2 mb-4"
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <UploadCloud size={18} /> Upload
        </button>
      </div>
    </div>
  );
};

export default UploadModal;
