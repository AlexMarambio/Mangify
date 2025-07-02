import type { ChangeEvent } from "react";

export const moods = ["feliz", "drama", "acción", "tensión"] as const;
type MoodType = (typeof moods)[number];

type Props = {
  value: MoodType;
  onChange: (value: MoodType) => void;
};

export type MusicType = (typeof moods)[number];

export default function Mood({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
        onChange(e.target.value as MoodType)
      }
      className="text-black rounded p-1"
    >
      {moods.map((mood) => (
        <option key={mood} value={mood}>
          {mood}
        </option>
      ))}
    </select>
  );
}
