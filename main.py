from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import sqlite3

app = FastAPI(title="BCanteen")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TableToggleRequest(BaseModel):
    table_id: int

class OrderCreateRequest(BaseModel):
    tenant_name: str
    items: str
    total_price: int
    table_id: Optional[int] = None

class StatusUpdateRequest(BaseModel):
    status: str

def get_db_connection():
    conn = sqlite3.connect('foodcourt.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.get("/api/data")
def get_master_data():
    conn = get_db_connection()
    tables = [dict(row) for row in conn.execute("SELECT * FROM tables").fetchall()]
    tenants = [dict(row) for row in conn.execute("SELECT * FROM tenants").fetchall()]
    conn.close()
    return {"tables": tables, "tenants": tenants}

@app.get("/api/tables")
def get_tables():
    conn = get_db_connection()
    tables = [dict(row) for row in conn.execute("SELECT * FROM tables").fetchall()]
    tenants = [dict(row) for row in conn.execute("SELECT * FROM tenants").fetchall()]
    conn.close()
    return {"tables": tables, "tenants": tenants}

@app.post("/api/tables/toggle")
def toggle_table(payload: TableToggleRequest):
    conn = get_db_connection()
    table = conn.execute("SELECT * FROM tables WHERE id = ?", (payload.table_id,)).fetchone()
    if not table:
        conn.close()
        raise HTTPException(status_code=404, detail="Table not found")
    
    new_status = "Occupied" if table["status"] == "Available" else "Available"
    conn.execute("UPDATE tables SET status = ? WHERE id = ?", (new_status, payload.table_id))
    conn.commit()
    
    updated_table = conn.execute("SELECT * FROM tables WHERE id = ?", (payload.table_id,)).fetchone()
    conn.close()
    return {"table": dict(updated_table)}

@app.post("/api/orders")
def create_order(payload: OrderCreateRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO orders (tenant_name, items, total_price, status, table_id) VALUES (?, ?, ?, 'Received', ?)",
        (payload.tenant_name, payload.items, payload.total_price, payload.table_id)
    )
    conn.commit()
    order_id = cursor.lastrowid
    new_order = conn.execute("SELECT * FROM orders WHERE id = ?", (order_id,)).fetchone()
    conn.close()
    return dict(new_order)

@app.get("/api/orders")
def get_orders():
    conn = get_db_connection()
    orders = [dict(row) for row in conn.execute("SELECT * FROM orders ORDER BY id DESC").fetchall()]
    conn.close()
    return {"orders": orders}

@app.put("/api/orders/{order_id}/status")
def update_order_status(order_id: int, payload: StatusUpdateRequest):
    conn = get_db_connection()
    order = conn.execute("SELECT * FROM orders WHERE id = ?", (order_id,)).fetchone()
    if not order:
        conn.close()
        raise HTTPException(status_code=404, detail="Order not found")
    
    conn.execute("UPDATE orders SET status = ? WHERE id = ?", (payload.status, order_id))
    conn.commit()
    conn.close()
    return {"message": "Status updated successfully"}