-- =========================
-- USERS
-- =========================
INSERT INTO users (id, name, email, password, created_at) VALUES
('8f1a7c52-1a4d-4f5b-9c8e-1a2b3c4d5e01', 'Jenil', 'jenil@example.com', '$2a$12$oPAUYLdJG0L6BJMCT1.2f.1wv1BGfd4AZ1y9a0X5zWjBQjCE0LHkW', NOW()),
('9a2b8d63-2b5e-4c6c-8d9f-2b3c4d5e6f02', 'User', 'user@example.com', '$2a$12$oPAUYLdJG0L6BJMCT1.2f.1wv1BGfd4AZ1y9a0X5zWjBQjCE0LHkW', NOW());


-- =========================
-- PROJECTS
-- =========================

-- Jenil's Projects
INSERT INTO projects (id, name, description, owner_id, created_at) VALUES
('a1b2c3d4-1111-4a1b-8c1d-aaaaaaaaaaaa', 'TaskFlow Backend', 'Design and implement scalable task management APIs with authentication.', '8f1a7c52-1a4d-4f5b-9c8e-1a2b3c4d5e01', NOW()),
('b2c3d4e5-2222-4b2c-9d2e-bbbbbbbbbbbb', 'Portfolio Website', 'Build a modern developer portfolio using React and deploy it.', '8f1a7c52-1a4d-4f5b-9c8e-1a2b3c4d5e01', NOW());


-- User's Projects
INSERT INTO projects (id, name, description, owner_id, created_at) VALUES
('c3d4e5f6-3333-4c3d-ae3f-cccccccccccc', 'E-commerce Platform', 'Backend system for product catalog, cart, and order processing.', '9a2b8d63-2b5e-4c6c-8d9f-2b3c4d5e6f02', NOW()),
('d4e5f6a7-4444-4d4e-bf40-dddddddddddd', 'Mobile App UI Revamp', 'Improve UI/UX and redesign core mobile components.', '9a2b8d63-2b5e-4c6c-8d9f-2b3c4d5e6f02', NOW());


-- =========================
-- TASKS
-- =========================

-- ===== TaskFlow Backend =====
INSERT INTO tasks VALUES
('11111111-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'Design DB schema', 'Create schema for users, projects and tasks.', 'done', 'high', 'a1b2c3d4-1111-4a1b-8c1d-aaaaaaaaaaaa', '8f1a7c52-1a4d-4f5b-9c8e-1a2b3c4d5e01', NOW(), NOW()),
('22222222-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 'Implement authentication', 'Add JWT authentication and bcrypt password hashing.', 'in_progress', 'high', 'a1b2c3d4-1111-4a1b-8c1d-aaaaaaaaaaaa', '8f1a7c52-1a4d-4f5b-9c8e-1a2b3c4d5e01', NOW(), NOW()),
('33333333-cccc-4ccc-8ccc-ccccccccccc3', 'Task APIs', 'Develop CRUD APIs with filtering and validation.', 'todo', 'medium', 'a1b2c3d4-1111-4a1b-8c1d-aaaaaaaaaaaa', NULL, NOW(), NOW());


-- ===== Portfolio Website =====
INSERT INTO tasks VALUES
('44444444-dddd-4ddd-8ddd-ddddddddddd4', 'Setup React app', 'Initialize project using Vite and setup routing.', 'done', 'medium', 'b2c3d4e5-2222-4b2c-9d2e-bbbbbbbbbbbb', '8f1a7c52-1a4d-4f5b-9c8e-1a2b3c4d5e01', NOW(), NOW()),
('55555555-eeee-4eee-8eee-eeeeeeeeeee5', 'Design homepage', 'Create modern and responsive landing page.', 'in_progress', 'high', 'b2c3d4e5-2222-4b2c-9d2e-bbbbbbbbbbbb', NULL, NOW(), NOW()),
('66666666-ffff-4fff-8fff-fffffffffff6', 'Deploy website', 'Deploy on Vercel and configure domain.', 'todo', 'low', 'b2c3d4e5-2222-4b2c-9d2e-bbbbbbbbbbbb', NULL, NOW(), NOW());


-- ===== E-commerce Platform =====
INSERT INTO tasks VALUES
('77777777-1111-4111-8111-111111111117', 'Product schema design', 'Design schema for products and inventory.', 'done', 'high', 'c3d4e5f6-3333-4c3d-ae3f-cccccccccccc', '9a2b8d63-2b5e-4c6c-8d9f-2b3c4d5e6f02', NOW(), NOW()),
('88888888-2222-4222-8222-222222222228', 'Cart API', 'Implement add/remove cart functionality.', 'in_progress', 'high', 'c3d4e5f6-3333-4c3d-ae3f-cccccccccccc', NULL, NOW(), NOW()),
('99999999-3333-4333-8333-333333333339', 'Order processing', 'Handle order lifecycle and payments.', 'todo', 'medium', 'c3d4e5f6-3333-4c3d-ae3f-cccccccccccc', NULL, NOW(), NOW());


-- ===== Mobile UI Revamp =====
INSERT INTO tasks VALUES
('aaaaaaaa-4444-4444-8444-aaaaaaaaaaa4', 'UI audit', 'Identify usability issues and inconsistencies.', 'done', 'medium', 'd4e5f6a7-4444-4d4e-bf40-dddddddddddd', '9a2b8d63-2b5e-4c6c-8d9f-2b3c4d5e6f02', NOW(), NOW()),
('bbbbbbbb-5555-4555-8555-bbbbbbbbbbb5', 'Redesign components', 'Improve UI components and consistency.', 'in_progress', 'high', 'd4e5f6a7-4444-4d4e-bf40-dddddddddddd', NULL, NOW(), NOW()),
('cccccccc-6666-4666-8666-ccccccccccc6', 'User testing', 'Conduct usability testing and gather feedback.', 'todo', 'low', 'd4e5f6a7-4444-4d4e-bf40-dddddddddddd', NULL, NOW(), NOW());