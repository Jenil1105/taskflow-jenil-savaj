exports.up = (pgm) => {
  pgm.createTable("projects", {

    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    name: { 
        type: "text",
        notNull: true 
    },

    description: { type: "text" },

    owner_id: {
      type: "uuid",
      notNull: true,
      references: "users",
      onDelete: "cascade",
    },

    created_at: {
      type: "timestamp",
      default: pgm.func("now()"),
    },
    
  });

  pgm.createIndex("projects", "owner_id");
};

exports.down = (pgm) => {
  pgm.dropTable("projects");
};