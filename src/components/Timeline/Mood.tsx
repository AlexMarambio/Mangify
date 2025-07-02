import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export const moods = ["feliz", "drama", "acción", "tensión"] as const;
type MoodType = (typeof moods)[number];

type Props = {
  value: MoodType;
  onChange: (value: MoodType) => void;
};

export default function Mood({ value, onChange }: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Selecciona un estado de ánimo" />
      </SelectTrigger>
      <SelectContent>
        {moods.map((mood) => (
          <SelectItem key={mood} value={mood}>
            {mood}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
