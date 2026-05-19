interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
}

export default function SectionHeading({
  title,
  subtitle,
  align = 'center'
}: SectionHeadingProps) {
  const isCenter = align === 'center';
  return (
    <div className={isCenter ? 'text-center' : 'text-left'}>
      <h2 className="font-display text-2xl md:text-4xl font-bold text-gray-900 uppercase tracking-wide">
        {title}
      </h2>
      <div
        className={`mt-3 mb-4 h-[3px] w-24 bg-accent rounded ${isCenter ? 'mx-auto' : ''}`}
      />
      {subtitle && (
        <p className={`text-sm md:text-base text-gray-600 leading-relaxed ${isCenter ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
