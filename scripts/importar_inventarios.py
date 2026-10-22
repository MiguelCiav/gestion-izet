#!/usr/bin/env python3
"""
Script de importación y carga definitiva de inventarios Excel a Supabase
Laboratorios:
 - LEPA: 43e531e5-6073-430e-ba2d-3f06bdc5a21a
 - LEM:  e6cfa5a8-8aa6-4947-b58e-cec41591ceb1
"""

import zipfile
import xml.etree.ElementTree as ET
import re
import uuid
import sys
import os
import json
import urllib.request
import urllib.error

SUPABASE_URL = "https://lpvkqkaxamqobnepscua.supabase.co"
SUPABASE_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwdmtxa2F4YW1xb2JuZXBzY3VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMTA5NTAsImV4cCI6MjEwNDg4Njk1MH0."
    "id-Pl0Ii3F4idElK7YpRRyOR79o8ZXiILC_r_MxOr1o"
)

LEPA_LAB_ID = '43e531e5-6073-430e-ba2d-3f06bdc5a21a'
LEM_LAB_ID  = 'e6cfa5a8-8aa6-4947-b58e-cec41591ceb1'

NS = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}

def normalize_text(s):
    if not s:
        return ""
    table = str.maketrans('áéíóúÁÉÍÓÚ', 'aeiouaeiou')
    return " ".join(s.translate(table).lower().split())

def get_shared_strings(z):
    sst = []
    if 'xl/sharedStrings.xml' in z.namelist():
        tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
        for si in tree.findall('ns:si', NS):
            text = ''.join([t.text or '' for t in si.findall('.//ns:t', NS)])
            sst.append(text)
    return sst

def parse_lepa(file_path):
    items = []
    with zipfile.ZipFile(file_path) as z:
        sst = get_shared_strings(z)
        
        # Sheet 1: 179 reactivos químicos
        sheet1_tree = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
        for row in sheet1_tree.findall('.//ns:row', NS):
            if row.attrib.get('r') == '1':
                continue
            cells = {}
            for c in row.findall('ns:c', NS):
                t = c.attrib.get('t')
                v = c.find('ns:v', NS)
                val = v.text if v is not None else None
                if t == 's' and val is not None:
                    val = sst[int(val)]
                col_letter = ''.join([ch for ch in c.attrib.get('r') if ch.isalpha()])
                cells[col_letter] = val

            num_raw = cells.get('A')
            name_raw = cells.get('C')
            if not num_raw or not name_raw:
                continue

            try:
                num_int = int(float(str(num_raw).strip()))
                code = f'LEPA-{num_int:03d}'
            except:
                code = f'LEPA-{re.sub(r"\s+", "", str(num_raw)).upper()}'

            qty_str = str(cells.get('B') or '0').strip()
            m = re.search(r'([0-9.,]+)\s*([a-zA-Z]+)?', qty_str)
            qty = 0.0
            unit = 'g'
            if m:
                qty = float(m.group(1).replace(',', '.'))
                if m.group(2):
                    unit = m.group(2).lower()

            formula = str(cells.get('D') or 'N/A').strip()
            if not formula or formula.lower() == 'none':
                formula = 'N/A'

            qty_clean = int(qty) if qty.is_integer() else qty

            items.append({
                'id': str(uuid.uuid4()),
                'codigo_unico': re.sub(r'\s+', '', code).upper(),
                'nombre': str(name_raw).strip(),
                'formula_quimica': formula,
                'laboratorio_id': LEPA_LAB_ID,
                'cantidad_actual': qty_clean,
                'unidad_medida': unit,
                'ubicacion_fisica': 'Laboratorio LEPA',
                'estado_fisico': 'DISPONIBLE' if qty_clean > 0 else 'AGOTADO',
                'es_uso_comun': False,
                'hoja': 'Hoja1'
            })

        # Sheet 2: 18 indicadores
        sheet2_tree = ET.fromstring(z.read('xl/worksheets/sheet2.xml'))
        for row in sheet2_tree.findall('.//ns:row', NS):
            if row.attrib.get('r') == '1':
                continue
            cells = {}
            for c in row.findall('ns:c', NS):
                t = c.attrib.get('t')
                v = c.find('ns:v', NS)
                val = v.text if v is not None else None
                if t == 's' and val is not None:
                    val = sst[int(val)]
                col_letter = ''.join([ch for ch in c.attrib.get('r') if ch.isalpha()])
                cells[col_letter] = val

            num_raw = cells.get('A')
            name_raw = cells.get('C')
            if not num_raw or not name_raw:
                continue

            ind_clean = re.sub(r'\s+', '', str(num_raw)).upper()
            if ind_clean.startswith('I-'):
                try:
                    n = int(ind_clean.split('-')[1])
                    code = f'LEPA-IND-{n:02d}'
                except:
                    code = f'LEPA-{ind_clean}'
            else:
                code = f'LEPA-IND-{ind_clean}'

            qty_str = str(cells.get('B') or '0').strip()
            m = re.search(r'([0-9.,]+)\s*([a-zA-Z]+)?', qty_str)
            qty = 0.0
            unit = 'g'
            if m:
                qty = float(m.group(1).replace(',', '.'))
                if m.group(2):
                    unit = m.group(2).lower()

            qty_clean = int(qty) if qty.is_integer() else qty

            items.append({
                'id': str(uuid.uuid4()),
                'codigo_unico': re.sub(r'\s+', '', code).upper(),
                'nombre': str(name_raw).strip(),
                'formula_quimica': 'N/A',
                'laboratorio_id': LEPA_LAB_ID,
                'cantidad_actual': qty_clean,
                'unidad_medida': unit,
                'ubicacion_fisica': 'Laboratorio LEPA',
                'estado_fisico': 'DISPONIBLE' if qty_clean > 0 else 'AGOTADO',
                'es_uso_comun': False,
                'hoja': 'Hoja2'
            })

    return items

def parse_lem(file_path):
    items = []
    with zipfile.ZipFile(file_path) as z:
        sst = get_shared_strings(z)
        wb_tree = ET.fromstring(z.read('xl/workbook.xml'))
        sheet_map = []
        for elem in wb_tree.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheet'):
            name = elem.attrib.get('name')
            if name not in ['CATEGORIAS', 'Inventario Material']:
                sheet_map.append((name, elem.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')))
        
        rels_tree = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
        rel_dict = {rel.attrib['Id']: rel.attrib['Target'] for rel in rels_tree}

        for sheet_name, rId in sheet_map:
            target = rel_dict[rId]
            target_path = 'xl/' + target if not target.startswith('xl/') else target
            sheet_tree = ET.fromstring(z.read(target_path))

            loc_cols = {}
            for r in sheet_tree.findall('.//ns:row', NS):
                rn = int(r.attrib.get('r', 0))
                if rn == 2:
                    for c in r.findall('ns:c', NS):
                        t = c.attrib.get('t')
                        v = c.find('ns:v', NS)
                        val = v.text if v is not None else None
                        if t == 's' and val is not None:
                            val = sst[int(val)]
                        col = ''.join([ch for ch in c.attrib.get('r') if ch.isalpha()])
                        val_str = str(val).strip().title() if val else ''
                        if val_str.upper() in ['LABORATORIO', 'DEPÓSITO', 'DEPOSITO', 'NEVERA', 'ESTANTES PASILLO', 'DEP.  OFIC. NORA', 'DEP. OFIC. NORA', 'DEP SALA REUNIONES']:
                            loc_cols[col] = val_str
                elif rn > 2:
                    cells = {}
                    for c in r.findall('ns:c', NS):
                        t = c.attrib.get('t')
                        v = c.find('ns:v', NS)
                        val = v.text if v is not None else None
                        if t == 's' and val is not None:
                            val = sst[int(val)]
                        col = ''.join([ch for ch in c.attrib.get('r') if ch.isalpha()])
                        cells[col] = str(val).strip() if val else ''

                    code = cells.get('A', '')
                    name = cells.get('B', '')
                    if not code or not name:
                        continue

                    total_qty = 0.0
                    loc_counts = []
                    for col, loc_name in loc_cols.items():
                        val = cells.get(col, '')
                        try:
                            f = float(val)
                            if f > 0:
                                q_formatted = int(f) if f.is_integer() else f
                                loc_counts.append((loc_name, q_formatted))
                                total_qty += f
                        except:
                            pass

                    if len(loc_counts) == 1:
                        ubicacion = loc_counts[0][0]
                    elif len(loc_counts) > 1:
                        ubicacion = ', '.join([f'{loc} ({cnt})' for loc, cnt in loc_counts])
                    else:
                        ubicacion = 'Depósito'

                    total_clean = int(total_qty) if total_qty.is_integer() else total_qty

                    items.append({
                        'id': str(uuid.uuid4()),
                        'codigo_unico': re.sub(r'\s+', '', code).upper(),
                        'nombre': name.strip(),
                        'formula_quimica': 'N/A',
                        'laboratorio_id': LEM_LAB_ID,
                        'cantidad_actual': total_clean,
                        'unidad_medida': 'unid',
                        'ubicacion_fisica': ubicacion,
                        'estado_fisico': 'DISPONIBLE' if total_clean > 0 else 'AGOTADO',
                        'es_uso_comun': False,
                        'hoja': sheet_name
                    })

    return items

def mark_common_reagents(lepa_items, lem_items):
    lepa_map = {}
    for r in lepa_items:
        lepa_map[normalize_text(r['nombre'])] = r

    lem_map = {}
    for r in lem_items:
        lem_map[normalize_text(r['nombre'])] = r

    common_names = set(lepa_map.keys()).intersection(set(lem_map.keys()))
    print(f"-> {len(common_names)} reactivos coincidentes entre LEM y LEPA marcados como uso común:")
    for n in sorted(list(common_names)):
        lepa_item = lepa_map[n]
        lem_item = lem_map[n]
        lepa_item['es_uso_comun'] = True
        lem_item['es_uso_comun'] = True
        print(f"   * {lepa_item['nombre']} ({lepa_item['codigo_unico']}) <--> {lem_item['nombre']} ({lem_item['codigo_unico']})")

def post_batches(endpoint, data_list, conflict_key, chunk_size=50):
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}?on_conflict={conflict_key}"
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=minimal'
    }

    total = len(data_list)
    inserted = 0

    for i in range(0, total, chunk_size):
        chunk = data_list[i:i + chunk_size]
        body = json.dumps(chunk).encode('utf-8')
        req = urllib.request.Request(url, data=body, headers=headers, method='POST')
        try:
            with urllib.request.urlopen(req) as resp:
                if resp.status in (200, 201, 204):
                    inserted += len(chunk)
                    print(f"   [{endpoint}] {inserted}/{total} registros procesados...")
                else:
                    print(f"   [{endpoint}] Advertencia: código HTTP {resp.status}")
        except urllib.error.HTTPError as e:
            err_msg = e.read().decode('utf-8')
            print(f"   ERROR en lote {i}-{i+len(chunk)} de {endpoint}: {err_msg}")
            raise

    return inserted

def ejecutar_migracion():
    lepa_file = 'Inventario reactivos2010.xlsx'
    lem_file = 'Inventario LEM 2025 ACTUALIZANDO.xlsx'

    print("1. Parseando archivos de inventario...")
    lepa_items = parse_lepa(lepa_file)
    print(f"   -> LEPA: {len(lepa_items)} reactivos extraídos.")

    lem_items = parse_lem(lem_file)
    print(f"   -> LEM: {len(lem_items)} reactivos extraídos.")

    mark_common_reagents(lepa_items, lem_items)
    consolidated = lepa_items + lem_items
    print(f"   -> Total a cargar: {len(consolidated)} reactivos.")

    # 2. Preparar catalogo_reactivos
    catalogo_payload = []
    for item in consolidated:
        catalogo_payload.append({
            'id': item['id'],
            'codigo_unico': item['codigo_unico'],
            'nombre': item['nombre'],
            'formula_quimica': item['formula_quimica'],
            'nfpa_salud': 0,
            'nfpa_inflamabilidad': 0,
            'nfpa_inestabilidad': 0,
            'nfpa_especial': None,
            'es_regulado': False,
            'entidades_regulatorias': [],
            'es_uso_comun': item['es_uso_comun'],
            'ultimo_precio': None,
            'moneda_precio': 'USD',
            'activo': True
        })

    print("\n2. Insertando registros en 'public.catalogo_reactivos'...")
    cat_count = post_batches('catalogo_reactivos', catalogo_payload, 'codigo_unico', chunk_size=50)
    print(f"   -> Éxito: {cat_count} reactivos en catálogo.")

    # 3. Preparar stock_reactivos
    stock_payload = []
    for item in consolidated:
        stock_payload.append({
            'reactivo_id': item['id'],
            'laboratorio_id': item['laboratorio_id'],
            'cantidad_actual': item['cantidad_actual'],
            'unidad_medida': item['unidad_medida'],
            'ubicacion_fisica': item['ubicacion_fisica'],
            'umbral_minimo': 0,
            'estado_fisico': item['estado_fisico'],
            'es_uso_comun': item['es_uso_comun']
        })

    print("\n3. Insertando registros en 'public.stock_reactivos'...")
    stock_count = post_batches('stock_reactivos', stock_payload, 'reactivo_id,laboratorio_id', chunk_size=50)
    print(f"   -> Éxito: {stock_count} reactivos en stock.")

    print("\n¡Migración completada exitosamente!")

if __name__ == '__main__':
    ejecutar_migracion()
