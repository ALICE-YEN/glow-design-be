import { pool } from "../config/db";

const seedDatabase = async () => {
  try {
    // Insert initial data into the 'users' table
    await pool.query(`
      INSERT INTO "users" (username, email, password, sso_id, phone, status)
      VALUES 
        ('John Doe', 'john@example.com', 'hashedpassword1', NULL, '1234567890', 'active'),
        ('Jane Smith', 'jane@example.com', 'hashedpassword2', NULL, '9876543210', 'inactive');
    `);

    // Insert initial data into the 'roles' table
    await pool.query(`
      INSERT INTO "roles" (name, description)
      VALUES 
        ('Admin', 'Administrator role with full access'),
        ('Designer', 'Role for designers'),
        ('Viewer', 'Role for viewing only');
    `);

    // Insert initial data into the 'designs' table
    await pool.query(`
      INSERT INTO "designs" (name, description, preview_url, data, created_by, is_deleted)
      VALUES 
        ('Modern Living Room', 'A beautiful living room design', 'https://example.com/preview1', '{"layout": "modern"}', 1, false),
        ('Classic Kitchen', 'A classic kitchen design', 'https://example.com/preview2', '{"layout": "classic"}', 2, false);
    `);

    // Insert initial data into the 'design_users' table
    await pool.query(`
      INSERT INTO "design_users" (design_id, user_id, role_id)
      VALUES 
        (1, 1, 1), -- John Doe is an Admin of design 1
        (2, 2, 2); -- Jane Smith is a Designer of design 2
    `);

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

    // Insert initial data into the 'material_types' table
    await pool.query(`
      INSERT INTO "material_types" (name, description)
      VALUES 
        ('Furniture', 'Materials used for furniture construction'),
        ('Flooring', 'Materials used for flooring surfaces'),
        ('Window', 'Materials used for window frames and coverings'),
        ('Door', 'Materials used for doors and door frames');
    `);

    // Insert initial data into the 'materials' table
    await pool.query(`
      INSERT INTO "materials" (type_id, name, img_url)
      VALUES 
        -- Furniture
        ((SELECT id FROM material_types WHERE name = 'Furniture'), 'Pine Wood', 'https://example.com/pine_texture'),
        ((SELECT id FROM material_types WHERE name = 'Furniture'), 'Leather', 'https://example.com/leather_texture'),
        ((SELECT id FROM material_types WHERE name = 'Furniture'), 'Velvet Fabric', 'https://example.com/velvet_texture'),
        ((SELECT id FROM material_types WHERE name = 'Furniture'), 'Metal Frame', 'https://example.com/metal_frame_texture'),
      
        -- Flooring
        ((SELECT id FROM material_types WHERE name = 'Flooring'), 'Marble', 'https://example.com/marble_texture'),
        ((SELECT id FROM material_types WHERE name = 'Flooring'), 'Laminate', 'https://example.com/laminate_texture'),
        ((SELECT id FROM material_types WHERE name = 'Flooring'), 'Tiles', 'https://example.com/tiles_texture'),
      
        -- Window
        ((SELECT id FROM material_types WHERE name = 'Window'), 'Clear Glass', 'https://example.com/clear_glass_texture'),
        ((SELECT id FROM material_types WHERE name = 'Window'), 'Aluminum Frame', 'https://example.com/aluminum_frame_texture'),
      
        -- Door
        ((SELECT id FROM material_types WHERE name = 'Door'), 'Solid Wood', 'https://example.com/solid_wood_texture'),
        ((SELECT id FROM material_types WHERE name = 'Door'), 'Steel', 'https://example.com/steel_texture'),
        ((SELECT id FROM material_types WHERE name = 'Door'), 'Glass Panel', 'https://example.com/glass_panel_texture'),
        ((SELECT id FROM material_types WHERE name = 'Door'), 'Composite', 'https://example.com/composite_texture')
      ON CONFLICT DO NOTHING;
    `);

    // Insert initial data into the 'categories' table
    await pool.query(`
      INSERT INTO categories (type_id, parent_id, name)
      VALUES 
        -- Furniture categories
        ((SELECT id FROM material_types WHERE name = 'Furniture'), NULL, '按房間類別'),
        ((SELECT id FROM material_types WHERE name = 'Furniture'), NULL, '按家具類別'),
        ((SELECT id FROM material_types WHERE name = 'Furniture'), (SELECT id FROM categories WHERE name = '按房間類別'), '客廳'),
        ((SELECT id FROM material_types WHERE name = 'Furniture'), (SELECT id FROM categories WHERE name = '按房間類別'), '房間'),
        ((SELECT id FROM material_types WHERE name = 'Furniture'), (SELECT id FROM categories WHERE name = '按家具類別'), '沙發'),
            
        -- Flooring categories
        ((SELECT id FROM material_types WHERE name = 'Flooring'), NULL, 'Wood'),
        ((SELECT id FROM material_types WHERE name = 'Flooring'), NULL, 'Tiles');
    `);

    // Insert initial data into the 'material_categories' table
    await pool.query(`
      INSERT INTO material_categories (material_id, category_id)
      VALUES 
        -- Furniture associations
        ((SELECT id FROM materials WHERE name = 'Pine Wood'), (SELECT id FROM categories WHERE name = '客廳')),
        ((SELECT id FROM materials WHERE name = 'Pine Wood'), (SELECT id FROM categories WHERE name = '沙發')),
        ((SELECT id FROM materials WHERE name = 'Leather'), (SELECT id FROM categories WHERE name = '沙發')),
        ((SELECT id FROM materials WHERE name = 'Metal Frame'), (SELECT id FROM categories WHERE name = '房間')),
          
        -- Flooring associations
        ((SELECT id FROM materials WHERE name = 'Marble'), (SELECT id FROM categories WHERE name = 'Tiles')),
        ((SELECT id FROM materials WHERE name = 'Tiles'), (SELECT id FROM categories WHERE name = 'Tiles'));
    `);

    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await pool.end(); // Close the connection
  }
};

seedDatabase();
