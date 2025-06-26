import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type ModelSelectProps = {
  model: string;
  setModel: (value: string) => void;
};

const models: string[] = [
  "gemma-3-27b-it",
  "gemma-3-12b-it",
  "gemma-3n-e4b-it",
  "gemma-3-4b-it",
  "gemma-3-1b-it",
  "gemini-2.5-pro",
  "gemini-2.5-flash",
];

export default function ModelSelect({ model, setModel }: ModelSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="model">Models</Label>
      <Select value={model} onValueChange={setModel}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Model" />
        </SelectTrigger>
        <SelectContent>
          {models.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
