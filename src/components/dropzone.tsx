type DropzoneProps = {
  onDrop: (files: File[]) => void;
};

export default function Dropzone({ onDrop }: DropzoneProps) {
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
            onDrop(files);
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
            onDrop(files);
          }
        }}
      />
    </div>
  );
}
