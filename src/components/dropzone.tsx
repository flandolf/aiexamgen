import { useState } from "react";

type DropzoneProps = {
  onDrop: (files: File[]) => void;
};

export default function Dropzone({ onDrop }: DropzoneProps) {
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);

  const handleFiles = (files: File[]) => {
    setDroppedFiles(files);
    onDrop(files);
  };

  return (
    <div className="space-y-6">
      <div
        className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center hover:border-primary/50 transition-all duration-200 cursor-pointer"
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add("border-primary");
          e.currentTarget.classList.remove("border-primary/20");
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove("border-primary");
          e.currentTarget.classList.add("border-primary/20");
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove("border-primary");
          e.currentTarget.classList.add("border-primary/20");

          const files = Array.from(e.dataTransfer.files);
          if (files.length > 0) {
            handleFiles(files);
          }
        }}
        onClick={() => {
          document.getElementById("filePicker")?.click();
        }}
      >
        <p className="text-muted-foreground">
          Click or drag files here to upload!
        </p>
      </div>

      <input
        id="filePicker"
        type="file"
        multiple
        hidden
        onChange={(e) => {
          const files = e.target.files ? Array.from(e.target.files) : [];
          if (files.length > 0) {
            handleFiles(files);
          }
        }}
      />

      {droppedFiles.length > 0 && (
        <div className="rounded-lg border p-4 bg-muted text-muted-foreground">
          <p className="font-medium mb-2">Uploaded Files:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {droppedFiles.map((file, idx) => (
              <li key={idx}>
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
