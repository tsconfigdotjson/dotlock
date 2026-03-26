import { i } from "@instantdb/core";

export default i.schema({
  entities: {
    $users: i.entity({}),
    licenses: i.entity({
      userId: i.string().indexed(),
      licenseKey: i.string(),
      serial: i.number(),
      createdAt: i.number(),
    }),
  },
  links: {
    licensesUser: {
      forward: {
        on: "licenses",
        has: "one",
        label: "user",
        onDelete: "cascade",
      },
      reverse: {
        on: "$users",
        has: "one",
        label: "license",
      },
    },
  },
});
