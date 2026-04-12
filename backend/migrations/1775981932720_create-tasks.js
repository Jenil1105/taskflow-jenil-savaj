exports.up = (pgm) => {
  pgm.createTable("tasks", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    title: { 
        type: "text", 
        notNull: true 
    },
    
    description: { type: "text" },

    status: {
      type: "text",
      notNull: true,
      default: "todo",
    },

    priority: {
      type: "text",
      notNull: true,
      default: "medium",
    },

    project_id: {
      type: "uuid",
      notNull: true,
      references: "projects",
      onDelete: "cascade",
    },

    assignee_id: {
      type: "uuid",
      references: "users",
      onDelete: "set null",
    },

    created_at: {
      type: "timestamp",
      default: pgm.func("now()"),
    },

    updated_at: {
      type: "timestamp",
      default: pgm.func("now()"),
    },
  });

  pgm.createIndex("tasks", "project_id");
  pgm.createIndex("tasks", "assignee_id");
};

exports.down = (pgm) => {
  pgm.dropTable("tasks");
};