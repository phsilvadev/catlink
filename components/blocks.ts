export const blockDefinitions = [
  {
    type: "text",
    label: "Text",
    icon: "title",
    fields: [{ key: "content", label: "Text content", multiline: true }],
  },
  {
    type: "calendar",
    label: "Calendar",
    icon: "calendar_today",
    fields: [
      { key: "title", label: "Title" },
      { key: "url", label: "Calendar URL", inputType: "url" },
    ],
  },
  {
    type: "booking",
    label: "Booking List",
    icon: "list_alt",
    fields: [
      { key: "title", label: "Title" },
      { key: "url", label: "Booking URL", inputType: "url" },
    ],
  },
  {
    type: "image",
    label: "Image",
    icon: "image",
    fields: [
      { key: "url", label: "Image URL", inputType: "url" },
      { key: "alt", label: "Alternative text" },
    ],
  },
  {
    type: "button",
    label: "Button",
    icon: "smart_button",
    fields: [
      { key: "label", label: "Button label" },
      { key: "url", label: "Destination URL", inputType: "url" },
    ],
  },
  {
    type: "link",
    label: "Link",
    icon: "link",
    fields: [
      { key: "label", label: "Link label" },
      { key: "url", label: "Destination URL", inputType: "url" },
    ],
  },
] as const;
export type BlockType = (typeof blockDefinitions)[number]["type"];
export type BlockDefinition = (typeof blockDefinitions)[number];
export type BlockValues = Record<string, string>;
