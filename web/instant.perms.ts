import type { InstantRules } from "@instantdb/react";

const rules = {
  licenses: {
    allow: {
      view: "isOwner",
      create: "false",
      update: "false",
      delete: "false",
    },
    bind: ["isOwner", "auth.id != null && auth.id == data.userId"],
  },
} satisfies InstantRules;

export default rules;
