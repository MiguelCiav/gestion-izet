-- Migración: Limpieza de esquema, ubicaciones físicas y funciones administrativas
-- Fecha: 2026-10-21

-- 1. Eliminar clasificacion_riesgo de catalogo_reactivos
ALTER TABLE public.catalogo_reactivos DROP COLUMN IF EXISTS clasificacion_riesgo;

-- 2. Actualizar función guardar_reactivo_inventario
CREATE OR REPLACE FUNCTION public.guardar_reactivo_inventario(
  p_laboratorio_id uuid,
  p_nombre text,
  p_codigo_unico text DEFAULT NULL,
  p_formula_quimica text DEFAULT NULL,
  p_cantidad_actual numeric DEFAULT 0,
  p_unidad_medida text DEFAULT 'ml',
  p_ubicacion_fisica text DEFAULT 'Sin ubicación',
  p_umbral_minimo numeric DEFAULT 0,
  p_fecha_vencimiento date DEFAULT NULL,
  p_lote text DEFAULT NULL,
  p_nfpa_salud smallint DEFAULT 0,
  p_nfpa_inflamabilidad smallint DEFAULT 0,
  p_nfpa_inestabilidad smallint DEFAULT 0,
  p_nfpa_especial text DEFAULT NULL,
  p_es_regulado boolean DEFAULT false,
  p_entidades_regulatorias text[] DEFAULT '{}'::text[],
  p_es_uso_comun boolean DEFAULT false,
  p_ultimo_precio numeric DEFAULT NULL,
  p_moneda_precio text DEFAULT 'USD',
  p_fecha_ultimo_precio date DEFAULT CURRENT_DATE,
  p_motivo_ajuste text DEFAULT NULL,
  p_reactivo_id uuid DEFAULT NULL,
  p_nombre_responsable text DEFAULT NULL,
  p_clasificacion_riesgo text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_reactivo_id uuid;
  v_existing_code_id uuid;
  v_clean_code text := NULLIF(upper(trim(COALESCE(p_codigo_unico, ''))), '');
  v_effective_code text;
  v_stock RECORD;
  v_stock_id uuid;
  v_stock_anterior numeric := 0;
  v_diferencia numeric := 0;
  v_tipo_mov varchar(30);
  v_estado_fisico varchar(20);
BEGIN
  IF trim(COALESCE(p_nombre, '')) = '' THEN
    RAISE EXCEPTION 'El nombre del reactivo es obligatorio';
  END IF;

  IF v_clean_code IS NOT NULL THEN
    SELECT id INTO v_existing_code_id
    FROM public.catalogo_reactivos
    WHERE upper(trim(codigo_unico)) = v_clean_code
    LIMIT 1;
  END IF;

  v_effective_code := COALESCE(v_clean_code, 'S/C-' || upper(substr(md5(random()::text), 1, 6)));

  IF p_reactivo_id IS NOT NULL THEN
    IF v_existing_code_id IS NOT NULL AND v_existing_code_id <> p_reactivo_id THEN
      RAISE EXCEPTION 'El código único "%" ya está registrado en otro reactivo del catálogo institucional', v_clean_code;
    END IF;
    v_reactivo_id := p_reactivo_id;

    UPDATE public.catalogo_reactivos
    SET
      codigo_unico = COALESCE(v_clean_code, codigo_unico),
      nombre = trim(p_nombre),
      formula_quimica = COALESCE(NULLIF(trim(p_formula_quimica), ''), formula_quimica),
      nfpa_salud = LEAST(GREATEST(COALESCE(p_nfpa_salud, 0), 0), 4),
      nfpa_inflamabilidad = LEAST(GREATEST(COALESCE(p_nfpa_inflamabilidad, 0), 0), 4),
      nfpa_inestabilidad = LEAST(GREATEST(COALESCE(p_nfpa_inestabilidad, 0), 0), 4),
      nfpa_especial = NULLIF(trim(COALESCE(p_nfpa_especial, '')), ''),
      es_regulado = COALESCE(p_es_regulado, false),
      entidades_regulatorias = COALESCE(p_entidades_regulatorias, '{}'::text[]),
      es_uso_comun = COALESCE(p_es_uso_comun, false),
      ultimo_precio = COALESCE(p_ultimo_precio, ultimo_precio),
      moneda_precio = CASE WHEN p_moneda_precio IN ('USD', 'VES') THEN p_moneda_precio ELSE 'USD' END,
      fecha_ultimo_precio = COALESCE(p_fecha_ultimo_precio, fecha_ultimo_precio, CURRENT_DATE),
      activo = true,
      updated_at = timezone('utc'::text, now())
    WHERE id = v_reactivo_id;
  ELSE
    IF v_existing_code_id IS NOT NULL THEN
      v_reactivo_id := v_existing_code_id;
      UPDATE public.catalogo_reactivos
      SET
        nombre = trim(p_nombre),
        formula_quimica = COALESCE(NULLIF(trim(p_formula_quimica), ''), formula_quimica),
        nfpa_salud = LEAST(GREATEST(COALESCE(p_nfpa_salud, 0), 0), 4),
        nfpa_inflamabilidad = LEAST(GREATEST(COALESCE(p_nfpa_inflamabilidad, 0), 0), 4),
        nfpa_inestabilidad = LEAST(GREATEST(COALESCE(p_nfpa_inestabilidad, 0), 0), 4),
        nfpa_especial = NULLIF(trim(COALESCE(p_nfpa_especial, '')), ''),
        es_regulado = COALESCE(p_es_regulado, es_regulado),
        entidades_regulatorias = COALESCE(p_entidades_regulatorias, entidades_regulatorias),
        es_uso_comun = COALESCE(p_es_uso_comun, es_uso_comun),
        ultimo_precio = COALESCE(p_ultimo_precio, ultimo_precio),
        moneda_precio = CASE WHEN p_moneda_precio IN ('USD', 'VES') THEN p_moneda_precio ELSE COALESCE(moneda_precio, 'USD') END,
        fecha_ultimo_precio = COALESCE(p_fecha_ultimo_precio, fecha_ultimo_precio, CURRENT_DATE),
        activo = true,
        updated_at = timezone('utc'::text, now())
      WHERE id = v_reactivo_id;
    ELSE
      INSERT INTO public.catalogo_reactivos (
        codigo_unico,
        nombre,
        formula_quimica,
        nfpa_salud,
        nfpa_inflamabilidad,
        nfpa_inestabilidad,
        nfpa_especial,
        es_regulado,
        entidades_regulatorias,
        es_uso_comun,
        ultimo_precio,
        moneda_precio,
        fecha_ultimo_precio,
        activo
      ) VALUES (
        v_effective_code,
        trim(p_nombre),
        COALESCE(NULLIF(trim(p_formula_quimica), ''), 'N/A'),
        LEAST(GREATEST(COALESCE(p_nfpa_salud, 0), 0), 4),
        LEAST(GREATEST(COALESCE(p_nfpa_inflamabilidad, 0), 0), 4),
        LEAST(GREATEST(COALESCE(p_nfpa_inestabilidad, 0), 0), 4),
        NULLIF(trim(COALESCE(p_nfpa_especial, '')), ''),
        COALESCE(p_es_regulado, false),
        COALESCE(p_entidades_regulatorias, '{}'::text[]),
        COALESCE(p_es_uso_comun, false),
        p_ultimo_precio,
        CASE WHEN p_moneda_precio IN ('USD', 'VES') THEN p_moneda_precio ELSE 'USD' END,
        COALESCE(p_fecha_ultimo_precio, CURRENT_DATE),
        true
      )
      RETURNING id INTO v_reactivo_id;
    END IF;
  END IF;

  SELECT * INTO v_stock
  FROM public.stock_reactivos
  WHERE reactivo_id = v_reactivo_id
    AND laboratorio_id = p_laboratorio_id
  FOR UPDATE;

  IF p_cantidad_actual <= 0 THEN
    v_estado_fisico := 'AGOTADO';
  ELSE
    v_estado_fisico := 'DISPONIBLE';
  END IF;

  IF FOUND THEN
    v_stock_id := v_stock.id;
    v_stock_anterior := v_stock.cantidad_actual;
    v_diferencia := ABS(COALESCE(p_cantidad_actual, 0) - v_stock_anterior);
    v_tipo_mov := 'AJUSTE';

    UPDATE public.stock_reactivos
    SET
      cantidad_actual = GREATEST(COALESCE(p_cantidad_actual, 0), 0),
      unidad_medida = COALESCE(NULLIF(trim(p_unidad_medida), ''), unidad_medida),
      ubicacion_fisica = COALESCE(NULLIF(trim(p_ubicacion_fisica), ''), 'Sin ubicación'),
      umbral_minimo = GREATEST(COALESCE(p_umbral_minimo, 0), 0),
      fecha_vencimiento = p_fecha_vencimiento,
      lote = COALESCE(NULLIF(trim(p_lote), ''), lote),
      ultimo_precio_adquirido = COALESCE(p_ultimo_precio, ultimo_precio_adquirido),
      moneda_precio = CASE WHEN p_moneda_precio IN ('USD', 'VES') THEN p_moneda_precio ELSE COALESCE(moneda_precio, 'USD') END,
      es_uso_comun = COALESCE(p_es_uso_comun, es_uso_comun),
      estado_fisico = CASE WHEN v_stock.estado_fisico = 'EN_PRESTAMO' AND p_cantidad_actual = 0 THEN 'EN_PRESTAMO' ELSE v_estado_fisico END,
      updated_at = timezone('utc'::text, now())
    WHERE id = v_stock_id;

    IF v_diferencia > 0 OR p_motivo_ajuste IS NOT NULL THEN
      INSERT INTO public.bitacora_movimientos (
        laboratorio_id,
        reactivo_id,
        usuario_id,
        nombre_responsable,
        tipo_movimiento,
        cantidad,
        unidad_medida,
        stock_anterior,
        stock_posterior,
        motivo
      ) VALUES (
        p_laboratorio_id,
        v_reactivo_id,
        auth.uid(),
        COALESCE(NULLIF(trim(p_nombre_responsable), ''), 'Personal de Laboratorio'),
        v_tipo_mov,
        CASE WHEN v_diferencia > 0 THEN v_diferencia ELSE GREATEST(COALESCE(p_cantidad_actual, 1), 1) END,
        COALESCE(NULLIF(trim(p_unidad_medida), ''), v_stock.unidad_medida),
        v_stock_anterior,
        GREATEST(COALESCE(p_cantidad_actual, 0), 0),
        COALESCE(NULLIF(trim(p_motivo_ajuste), ''), 'Ajuste de inventario / actualización de especificaciones')
      );
    END IF;
  ELSE
    INSERT INTO public.stock_reactivos (
      reactivo_id,
      laboratorio_id,
      cantidad_actual,
      unidad_medida,
      ubicacion_fisica,
      umbral_minimo,
      fecha_vencimiento,
      lote,
      ultimo_precio_adquirido,
      moneda_precio,
      es_uso_comun,
      estado_fisico
    ) VALUES (
      v_reactivo_id,
      p_laboratorio_id,
      GREATEST(COALESCE(p_cantidad_actual, 0), 0),
      COALESCE(NULLIF(trim(p_unidad_medida), ''), 'ml'),
      COALESCE(NULLIF(trim(p_ubicacion_fisica), ''), 'Sin ubicación'),
      GREATEST(COALESCE(p_umbral_minimo, 0), 0),
      p_fecha_vencimiento,
      COALESCE(NULLIF(trim(p_lote), ''), 'L-' || to_char(CURRENT_DATE, 'YYYYMM')),
      p_ultimo_precio,
      CASE WHEN p_moneda_precio IN ('USD', 'VES') THEN p_moneda_precio ELSE 'USD' END,
      COALESCE(p_es_uso_comun, false),
      v_estado_fisico
    )
    RETURNING id INTO v_stock_id;

    IF COALESCE(p_cantidad_actual, 0) > 0 THEN
      INSERT INTO public.bitacora_movimientos (
        laboratorio_id,
        reactivo_id,
        usuario_id,
        nombre_responsable,
        tipo_movimiento,
        cantidad,
        unidad_medida,
        stock_anterior,
        stock_posterior,
        motivo
      ) VALUES (
        p_laboratorio_id,
        v_reactivo_id,
        auth.uid(),
        COALESCE(NULLIF(trim(p_nombre_responsable), ''), 'Personal de Laboratorio'),
        'INGRESO',
        GREATEST(COALESCE(p_cantidad_actual, 0), 0.01),
        COALESCE(NULLIF(trim(p_unidad_medida), ''), 'ml'),
        0,
        GREATEST(COALESCE(p_cantidad_actual, 0), 0),
        COALESCE(NULLIF(trim(p_motivo_ajuste), ''), 'Registro inicial de stock físico en laboratorio')
      );
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'reactivo_id', v_reactivo_id,
    'stock_id', v_stock_id
  );
END;
$$;

-- 3. Tabla de ubicaciones físicas
CREATE TABLE IF NOT EXISTS public.ubicaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  laboratorio_id uuid NOT NULL REFERENCES public.laboratorios(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  descripcion text,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT ubicaciones_nombre_lab_unique UNIQUE (laboratorio_id, nombre)
);

ALTER TABLE public.ubicaciones ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Lectura de ubicaciones para usuarios autenticados' AND tablename = 'ubicaciones') THEN
    CREATE POLICY "Lectura de ubicaciones para usuarios autenticados"
      ON public.ubicaciones FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Escritura de ubicaciones para administradores' AND tablename = 'ubicaciones') THEN
    CREATE POLICY "Escritura de ubicaciones para administradores"
      ON public.ubicaciones FOR ALL
      TO authenticated
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;
END $$;

-- 4. Funciones RPC para gestión de usuarios
CREATE OR REPLACE FUNCTION public.admin_listar_usuarios()
RETURNS TABLE (
  id uuid,
  email text,
  nombre_completo text,
  cedula text,
  contacto text,
  rol varchar,
  laboratorio_id uuid,
  laboratorio_codigo varchar,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Acceso denegado: solo administradores pueden listar usuarios';
  END IF;

  RETURN QUERY
  SELECT
    p.id,
    p.email,
    p.nombre_completo,
    p.cedula,
    p.contacto,
    p.rol,
    p.laboratorio_id,
    l.codigo AS laboratorio_codigo,
    p.created_at
  FROM public.perfiles p
  LEFT JOIN public.laboratorios l ON l.id = p.laboratorio_id
  ORDER BY p.nombre_completo ASC;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_crear_usuario(
  p_email text,
  p_password text,
  p_nombre_completo text,
  p_cedula text,
  p_contacto text,
  p_rol varchar,
  p_laboratorio_codigo varchar
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_lab_id uuid;
  v_clean_email text := lower(trim(p_email));
  v_clean_rol varchar := lower(trim(COALESCE(p_rol, 'investigador')));
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Acceso denegado: solo administradores pueden crear usuarios';
  END IF;

  IF v_clean_email = '' OR p_password = '' OR trim(p_nombre_completo) = '' THEN
    RAISE EXCEPTION 'El correo, contraseña y nombre completo son obligatorios';
  END IF;

  IF EXISTS (SELECT 1 FROM auth.users WHERE lower(email) = v_clean_email) THEN
    RAISE EXCEPTION 'El correo "%" ya está registrado en el sistema', v_clean_email;
  END IF;

  SELECT id INTO v_lab_id
  FROM public.laboratorios
  WHERE codigo = UPPER(trim(p_laboratorio_codigo))
  LIMIT 1;

  IF v_lab_id IS NULL THEN
    SELECT id INTO v_lab_id FROM public.laboratorios WHERE codigo = 'LEPA' LIMIT 1;
  END IF;

  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change_token_current,
    email_change,
    reauthentication_token,
    created_at,
    updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    v_user_id,
    'authenticated',
    'authenticated',
    v_clean_email,
    crypt(p_password, gen_salt('bf')),
    timezone('utc'::text, now()),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object(
      'nombre_completo', trim(p_nombre_completo),
      'cedula', trim(COALESCE(p_cedula, '')),
      'contacto', trim(COALESCE(p_contacto, '')),
      'rol', v_clean_rol,
      'laboratorio_codigo', UPPER(trim(p_laboratorio_codigo))
    ),
    '',
    '',
    '',
    '',
    '',
    '',
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  );

  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    v_user_id,
    jsonb_build_object('sub', v_user_id::text, 'email', v_clean_email),
    'email',
    v_clean_email,
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  );

  INSERT INTO public.perfiles (
    id,
    email,
    nombre_completo,
    cedula,
    contacto,
    rol,
    laboratorio_id,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    v_clean_email,
    trim(p_nombre_completo),
    NULLIF(trim(COALESCE(p_cedula, '')), ''),
    NULLIF(trim(COALESCE(p_contacto, '')), ''),
    v_clean_rol,
    v_lab_id,
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    nombre_completo = EXCLUDED.nombre_completo,
    cedula = EXCLUDED.cedula,
    contacto = EXCLUDED.contacto,
    rol = EXCLUDED.rol,
    laboratorio_id = EXCLUDED.laboratorio_id,
    updated_at = timezone('utc'::text, now());

  RETURN jsonb_build_object('success', true, 'id', v_user_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_actualizar_usuario(
  p_user_id uuid,
  p_nombre_completo text,
  p_cedula text,
  p_contacto text,
  p_rol varchar,
  p_laboratorio_codigo varchar,
  p_password text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_lab_id uuid;
  v_clean_rol varchar := lower(trim(COALESCE(p_rol, 'investigador')));
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Acceso denegado: solo administradores pueden actualizar usuarios';
  END IF;

  SELECT id INTO v_lab_id
  FROM public.laboratorios
  WHERE codigo = UPPER(trim(p_laboratorio_codigo))
  LIMIT 1;

  UPDATE public.perfiles
  SET
    nombre_completo = trim(p_nombre_completo),
    cedula = NULLIF(trim(COALESCE(p_cedula, '')), ''),
    contacto = NULLIF(trim(COALESCE(p_contacto, '')), ''),
    rol = v_clean_rol,
    laboratorio_id = COALESCE(v_lab_id, laboratorio_id),
    updated_at = timezone('utc'::text, now())
  WHERE id = p_user_id;

  UPDATE auth.users
  SET
    raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object(
      'nombre_completo', trim(p_nombre_completo),
      'cedula', trim(COALESCE(p_cedula, '')),
      'contacto', trim(COALESCE(p_contacto, '')),
      'rol', v_clean_rol,
      'laboratorio_codigo', UPPER(trim(p_laboratorio_codigo))
    ),
    encrypted_password = CASE
      WHEN p_password IS NOT NULL AND trim(p_password) <> ''
      THEN crypt(p_password, gen_salt('bf'))
      ELSE encrypted_password
    END,
    updated_at = timezone('utc'::text, now())
  WHERE id = p_user_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_eliminar_usuario(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Acceso denegado: solo administradores pueden eliminar usuarios';
  END IF;

  IF p_user_id = auth.uid() THEN
    RAISE EXCEPTION 'No puedes eliminar tu propia cuenta de administrador en uso';
  END IF;

  DELETE FROM auth.users WHERE id = p_user_id;
  RETURN jsonb_build_object('success', true);
END;
$$;
