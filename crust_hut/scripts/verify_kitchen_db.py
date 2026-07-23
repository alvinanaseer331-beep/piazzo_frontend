"""Verify local SQLite order data used during Kitchen Dashboard checks.

Usage:
  python scripts/verify_kitchen_db.py
"""

from __future__ import annotations

import sqlite3
from pathlib import Path

DB_CANDIDATES = [
    Path(r"C:\Users\global\Documents\backend-crusthub\backend_crusthub\piazzo.db"),
    Path(r"C:\Users\global\Documents\backend-crusthub\piazzo.db"),
]


def main() -> None:
    found = False
    for path in DB_CANDIDATES:
        exists = path.exists()
        print(f"path {path} exists {exists}")
        if not exists:
            continue

        found = True
        conn = sqlite3.connect(path)
        try:
            tables = conn.execute(
                "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
            ).fetchall()
            print(" tables:", [row[0] for row in tables])

            try:
                rows = conn.execute(
                    "SELECT id, status, notes FROM orders ORDER BY id DESC LIMIT 5"
                ).fetchall()
                print(" orders:", rows)
            except sqlite3.Error as err:
                print(" orders err:", err)
        finally:
            conn.close()

    if not found:
        raise SystemExit("No SQLite database file found at known paths.")

    print("OK: verification script completed with no errors.")


if __name__ == "__main__":
    main()
