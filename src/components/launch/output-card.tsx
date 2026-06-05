import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { OutputSection } from "@/types/launch";

type OutputCardProps = {
  section: OutputSection;
  onChange?: (section: OutputSection) => void;
};

export function OutputCard({ section, onChange }: OutputCardProps) {
  const editableValue = Array.isArray(section.body) ? section.body.join("\n") : section.body;

  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">{section.title}</h3>
      {onChange ? (
        <Textarea
          className="mt-4 min-h-28"
          value={editableValue}
          onChange={(event) =>
            onChange({
              ...section,
              body: Array.isArray(section.body)
                ? event.target.value.split("\n").filter((item) => item.trim().length > 0)
                : event.target.value,
            })
          }
        />
      ) : (
        <>
          {Array.isArray(section.body) ? (
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              {section.body.map((item) => (
                <li key={item} className="rounded-lg bg-slate-50 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-700">{section.body}</p>
          )}
        </>
      )}
    </Card>
  );
}
