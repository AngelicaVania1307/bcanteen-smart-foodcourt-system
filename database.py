import sqlite3

def init_db():
    conn = sqlite3.connect('foodcourt.db')
    cursor = conn.cursor()
    
    # 1. Tables structure
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tables (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            table_number INTEGER UNIQUE,
            status TEXT DEFAULT 'Available'
        )
    ''')
    
    # 2. Tenants structure
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tenants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE,
            queue_status TEXT DEFAULT 'Low'
        )
    ''')
    
    # 3. Orders structure
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tenant_name TEXT,
            items TEXT,
            total_price INTEGER,
            status TEXT DEFAULT 'Received',
            table_id INTEGER NULL
        )
    ''')
    
    # Pre-populate Tables if empty
    cursor.execute("SELECT COUNT(*) FROM tables")
    if cursor.fetchone()[0] == 0:
        for i in range(1, 7):
            cursor.execute("INSERT INTO tables (table_number, status) VALUES (?, 'Available')", (i,))
            
    # Pre-populate Tenants if empty
    cursor.execute("SELECT COUNT(*) FROM tenants")
    if cursor.fetchone()[0] == 0:
        tenants = [('Noodle House', 'Low'), ('Chicken King', 'Medium'), ('Burger Lab', 'Busy')]
        for name, q_status in tenants:
            cursor.execute("INSERT INTO tenants (name, queue_status) VALUES (?, ?)", (name, q_status))
            
    conn.commit()
    conn.close()
    print("Initialized database at foodcourt.db with tables, tenants, and order schemas.")

if __name__ == "__main__":
    init_db()