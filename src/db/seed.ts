import { pool } from "../config/db";

const seedDatabase = async () => {
  try {
    // Database cleared
    await pool.query(`
      TRUNCATE TABLE 
        material_categories,
        categories,
        materials,
        material_types,
        comments,
        design_versions,
        design_users,
        designs,
        roles,
        users 
      RESTART IDENTITY CASCADE;
    `);
    console.log("Database cleared successfully!");

    // Insert initial data into the 'users' table
    await pool.query(`
      INSERT INTO "users" (username, email, password, sso_id, phone, status)
      VALUES
        ('Glow Design TEST', 'test@glow-design.com', 'GlowDesign1', NULL, NULL, 'active'),
        ('John Doe', 'john@example.com', 'hashedpassword1', NULL, '1234567890', 'active'),
        ('Jane Smith', 'jane@example.com', 'hashedpassword2', NULL, '9876543210', 'inactive');
    `);
    console.log("Seeded users successfully.");

    // Insert initial data into the 'roles' table
    await pool.query(`
      INSERT INTO "roles" (name, description)
      VALUES
        ('Admin', 'Administrator role with full access'),
        ('Designer', 'Role for designers'),
        ('Viewer', 'Role for viewing only');
    `);
    console.log("Seeded roles successfully.");

    // Insert initial data into the 'designs' table
    await pool.query(`
      INSERT INTO "designs" (name, description, preview_url, data, created_by, is_deleted)
      VALUES
        ('Modern Living Room', 'A beautiful living room design', 'https://example.com/preview1', '{"layout": "modern"}', 1, false),
        ('Classic Kitchen', 'A classic kitchen design', 'https://example.com/preview2', '{"layout": "classic"}', 2, false);
    `);
    console.log("Seeded designs successfully.");

    // Insert initial data into the 'design_users' table
    await pool.query(`
      INSERT INTO "design_users" (design_id, user_id, role_id)
      VALUES
        (1, 1, 1), -- John Doe is an Admin of design 1
        (2, 2, 2); -- Jane Smith is a Designer of design 2
    `);
    console.log("Seeded design_users successfully.");

    // Insert initial data into the 'design_versions' table
    await pool.query(`
      INSERT INTO "design_versions" (design_id, data, created_at)
      VALUES
        (1, '{"layout": "modern", "version": 1, "updates": ["added sofa", "changed colors"]}', NOW()),
        (1, '{"layout": "modern"}', NOW()),
        (2, '{"layout": "classic", "version": 1, "updates": ["initial setup"]}', NOW()),
        (2, '{"layout": "classic"}', NOW())
        ON CONFLICT DO NOTHING;
      `);
    console.log("Seeded design_versions successfully.");

    // Insert initial data into the 'comments' table
    await pool.query(`
      INSERT INTO "comments" (design_id, user_id, content, x_position, y_position)
      VALUES
        (1, 1, 'Great design!', 100.5, 200.75),
        (2, 2, 'Needs more color', 150.0, 250.0);
    `);
    console.log("Seeded comments successfully.");

    // Insert initial data into the 'material_types' table
    await pool.query(`
      INSERT INTO "material_types" (name, description)
      VALUES
        ('furniture', 'Materials used for furniture construction'),
        ('flooring', 'Materials used for flooring surfaces'),
        ('window', 'Materials used for window frames and coverings'),
        ('door', 'Materials used for doors and door frames');
    `);
    console.log("Seeded material_types successfully.");

    // Insert initial data into the 'materials' table
    await pool.query(`
      INSERT INTO "materials" (type_id, name, img_url)
      VALUES
        -- furniture
        ((SELECT id FROM material_types WHERE name = 'furniture'), 'Pine Wood', 'https://example.com/pine_texture'),
        ((SELECT id FROM material_types WHERE name = 'furniture'), 'Leather', 'https://example.com/leather_texture'),
        ((SELECT id FROM material_types WHERE name = 'furniture'), 'Velvet Fabric', 'https://example.com/velvet_texture'),
        ((SELECT id FROM material_types WHERE name = 'furniture'), 'Metal Frame', 'https://example.com/metal_frame_texture'),

        -- flooring
        ((SELECT id FROM material_types WHERE name = 'flooring'), 'Marble', 'https://example.com/marble_texture'),
        ((SELECT id FROM material_types WHERE name = 'flooring'), 'Laminate', 'https://example.com/laminate_texture'),
        ((SELECT id FROM material_types WHERE name = 'flooring'), 'Tiles', 'https://example.com/tiles_texture'),

        -- window
        ((SELECT id FROM material_types WHERE name = 'window'), 'Clear Glass', 'https://example.com/clear_glass_texture'),
        ((SELECT id FROM material_types WHERE name = 'window'), 'Aluminum Frame', 'https://example.com/aluminum_frame_texture'),

        -- door
        ((SELECT id FROM material_types WHERE name = 'door'), 'Solid Wood', 'https://example.com/solid_wood_texture'),
        ((SELECT id FROM material_types WHERE name = 'door'), 'Steel', 'https://example.com/steel_texture'),
        ((SELECT id FROM material_types WHERE name = 'door'), 'Glass Panel', 'https://example.com/glass_panel_texture'),
        ((SELECT id FROM material_types WHERE name = 'door'), 'Composite', 'https://example.com/composite_texture')
      ON CONFLICT DO NOTHING;
    `);
    console.log("Seeded materials successfully.");

    // Insert initial data into the 'categories' table
    await pool.query(`
      INSERT INTO categories (type_id, parent_id, name)
      VALUES
        -- furniture categories
        ((SELECT id FROM material_types WHERE name = 'furniture'), NULL, '按房間類別'),
        ((SELECT id FROM material_types WHERE name = 'furniture'), NULL, '按家具類別'),

        -- flooring categories
        ((SELECT id FROM material_types WHERE name = 'flooring'), NULL, 'Wood'),
        ((SELECT id FROM material_types WHERE name = 'flooring'), NULL, 'Tiles');
    `);
    await pool.query(`
      INSERT INTO categories (type_id, parent_id, name)
      VALUES 
        -- furniture categories
        ((SELECT id FROM material_types WHERE name = 'furniture'), (SELECT id FROM categories WHERE name = '按房間類別'), '客廳'),
        ((SELECT id FROM material_types WHERE name = 'furniture'), (SELECT id FROM categories WHERE name = '按房間類別'), '房間'),
        ((SELECT id FROM material_types WHERE name = 'furniture'), (SELECT id FROM categories WHERE name = '按家具類別'), '沙發')
    `);
    console.log("Seeded categories successfully.");

    // Insert initial data into the 'material_categories' table
    await pool.query(`
      INSERT INTO material_categories (material_id, category_id)
      VALUES
        -- Furniture associations
        ((SELECT id FROM materials WHERE name = 'Pine Wood'), 
         (SELECT id FROM categories WHERE name = '客廳')), -- 按房間類別 -> 客廳
        ((SELECT id FROM materials WHERE name = 'Pine Wood'), 
         (SELECT id FROM categories WHERE name = '沙發')), -- 按家具類別 -> 沙發
        ((SELECT id FROM materials WHERE name = 'Pine Wood'), 
         (SELECT id FROM categories WHERE name = '房間')), -- 按房間類別 -> 房間
        ((SELECT id FROM materials WHERE name = 'Pine Wood'), 
         (SELECT id FROM categories WHERE name = '按房間類別')), -- 按房間類別

        ((SELECT id FROM materials WHERE name = 'Leather'), 
         (SELECT id FROM categories WHERE name = '客廳')), -- 按房間類別 -> 客廳
        ((SELECT id FROM materials WHERE name = 'Leather'), 
         (SELECT id FROM categories WHERE name = '沙發')), -- 按家具類別 -> 沙發

        ((SELECT id FROM materials WHERE name = 'Metal Frame'), 
         (SELECT id FROM categories WHERE name = '客廳')), -- 按房間類別 -> 客廳
        ((SELECT id FROM materials WHERE name = 'Metal Frame'), 
         (SELECT id FROM categories WHERE name = '沙發')), -- 按家具類別 -> 沙發
        ((SELECT id FROM materials WHERE name = 'Metal Frame'), 
         (SELECT id FROM categories WHERE name = '房間')), -- 按房間類別 -> 房間

        -- Flooring associations
        ((SELECT id FROM materials WHERE name = 'Marble'), 
         (SELECT id FROM categories WHERE name = 'Tiles')),
        ((SELECT id FROM materials WHERE name = 'Laminate'), 
         (SELECT id FROM categories WHERE name = 'Wood')),
        ((SELECT id FROM materials WHERE name = 'Tiles'), 
         (SELECT id FROM categories WHERE name = 'Tiles'));
    `);
    console.log("Seeded material_categories successfully.");

    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await pool.end(); // Close the connection
  }
};

seedDatabase();
