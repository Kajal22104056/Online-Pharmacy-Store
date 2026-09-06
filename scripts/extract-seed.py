#!/usr/bin/env python3
import json
import re
from pathlib import Path

SQL_PATH = Path(__file__).resolve().parents[1] / "Database Schema" / "DBMS03.sql"
OUT_PATH = Path(__file__).resolve().parents[1] / "web" / "src" / "lib" / "seed.json"

COLUMNS = {
    "customer": ["CID", "Cname", "Gender", "Age", "Contact", "Address"],
    "doctor": ["docID", "Dname", "Gender", "Contact", "Speciality", "Address"],
    "employee": ["EID", "Ename", "Gender", "Age", "Address", "Contact", "Salary"],
    "invoice": ["invoiceID", "CID", "docID", "medID", "Quantity", "Amount"],
    "login": ["Lid", "Role", "Username", "Password"],
    "medicine": ["medID", "Mname", "MfgDate", "ExpDate", "description", "Quantity", "Price"],
    "pharmacy": ["pharID", "pharName", "Address", "City", "State", "Pincode", "Location"],
    "supplier": ["supplierID", "Sname", "Location", "State", "City"],
}


def parse_rows(values_str: str):
    rows = []
    i = 0
    n = len(values_str)
    while i < n:
        while i < n and values_str[i] in " \t\n\r,;":
            i += 1
        if i >= n or values_str[i] != "(":
            break
        i += 1
        row = []
        while i < n and values_str[i] != ")":
            while i < n and values_str[i] in " \t\n\r":
                i += 1
            if values_str.startswith("NULL", i) and (i + 4 == n or values_str[i + 4] in ",)"):
                row.append(None)
                i += 4
            elif values_str[i] == "'":
                i += 1
                buf = []
                while i < n:
                    ch = values_str[i]
                    if ch == "\\" and i + 1 < n:
                        buf.append(values_str[i + 1])
                        i += 2
                    elif ch == "'" and i + 1 < n and values_str[i + 1] == "'":
                        buf.append("'")
                        i += 2
                    elif ch == "'":
                        i += 1
                        break
                    else:
                        buf.append(ch)
                        i += 1
                row.append("".join(buf))
            else:
                start = i
                while i < n and values_str[i] not in ",)":
                    i += 1
                token = values_str[start:i].strip()
                if re.fullmatch(r"-?\d+", token):
                    row.append(int(token))
                elif re.fullmatch(r"-?\d+\.\d+", token):
                    row.append(float(token))
                else:
                    row.append(token)
            while i < n and values_str[i] in " \t\n\r":
                i += 1
            if i < n and values_str[i] == ",":
                i += 1
        if i < n and values_str[i] == ")":
            i += 1
        rows.append(row)
    return rows


def main():
    text = SQL_PATH.read_text(encoding="utf-8", errors="replace")
    seed = {}
    for table, cols in COLUMNS.items():
        marker = f"INSERT INTO `{table}` VALUES "
        start = text.find(marker)
        if start < 0:
            raise SystemExit(f"Missing insert for {table}")
        start += len(marker)
        end = text.find("UNLOCK TABLES", start)
        rows = parse_rows(text[start:end])
        records = []
        for row in rows:
            if len(row) != len(cols):
                print("skip malformed", table, len(row), row[:2])
                continue
            records.append(dict(zip(cols, row)))
        seed[table] = records
        print(table, len(seed[table]))
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(seed), encoding="utf-8")
    print("wrote", OUT_PATH)


if __name__ == "__main__":
    main()
