import { useEffect, useRef } from "react";
import type { BlockDefinition, BlockValues } from "./blocks";

type Props = {
  block: BlockDefinition;
  values: BlockValues;
  onChange: (key: string, value: string) => void;
  onClose: () => void;
};
export default function BlockSettings({
  block,
  values,
  onChange,
  onClose,
}: Props) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, [block.type]);
  return (
    <div className="p-6">
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-700 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <span
            className="material-icons-round text-primary"
            aria-hidden="true"
          >
            {block.icon}
          </span>
          <h2
            ref={heading}
            tabIndex={-1}
            className="font-bold text-lg focus:outline-none"
          >
            {block.label} settings
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close block settings"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <span className="material-icons-round" aria-hidden="true">
            close
          </span>
        </button>
      </div>
      <div className="space-y-5">
        {block.fields.map((field) => {
          const id = `block-${block.type}-${field.key}`;
          const className =
            "mt-2 w-full rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:border-primary focus:ring-primary";
          return (
            <div key={field.key}>
              <label htmlFor={id} className="text-sm font-medium">
                {field.label}
              </label>
              {"multiline" in field ? (
                <textarea
                  id={id}
                  rows={6}
                  className={className}
                  value={values[field.key] ?? ""}
                  onChange={(event) => onChange(field.key, event.target.value)}
                />
              ) : (
                <input
                  id={id}
                  type={"inputType" in field ? field.inputType : "text"}
                  className={className}
                  value={values[field.key] ?? ""}
                  onChange={(event) => onChange(field.key, event.target.value)}
                />
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-xs text-gray-500">
        Configure this block here. Return to Design to customize the page
        appearance.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-5 w-full py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
      >
        Back to Design
      </button>
    </div>
  );
}
