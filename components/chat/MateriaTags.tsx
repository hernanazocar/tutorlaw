import { getMateriaInfo, type MateriaTag } from '@/lib/auto-tags';

interface MateriaTagsProps {
  tags: MateriaTag[];
}

export function MateriaTags({ tags }: MateriaTagsProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map((tag) => {
        const info = getMateriaInfo(tag);
        if (!info) return null;

        return (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-1 bg-[#e6f0ff] text-[#0066ff] rounded-full text-xs font-medium"
          >
            <span>{info.emoji}</span>
            <span>{info.nombre}</span>
          </span>
        );
      })}
    </div>
  );
}
