-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  due_date TEXT,
  priority TEXT DEFAULT 'normal',
  status TEXT DEFAULT 'todo',
  category_id TEXT,
  is_completed INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3b82f6',
  icon TEXT DEFAULT '📁',
  created_at TEXT NOT NULL
);

-- Create reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL,
  reminder_time TEXT NOT NULL,
  reminder_type TEXT DEFAULT '10min',
  created_at TEXT NOT NULL,
  FOREIGN KEY (task_id) REFERENCES tasks(id)
);

-- Insert default categories
INSERT OR IGNORE INTO categories (id, name, color, icon, created_at) VALUES
  ('inbox', 'Inbox', '#3b82f6', '📥', datetime('now')),
  ('work', 'Work', '#ef4444', '💼', datetime('now')),
  ('personal', 'Personal', '#10b981', '👤', datetime('now')),
  ('shopping', 'Shopping', '#f59e0b', '🛍️', datetime('now'));
