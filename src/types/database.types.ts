export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      bitacora_movimientos: {
        Row: {
          cantidad: number
          created_at: string
          id: string
          laboratorio_id: string
          motivo: string | null
          nombre_responsable: string | null
          reactivo_id: string
          stock_anterior: number
          stock_posterior: number
          tipo_movimiento: string
          unidad_medida: string
          usuario_id: string | null
        }
        Insert: {
          cantidad: number
          created_at?: string
          id?: string
          laboratorio_id: string
          motivo?: string | null
          nombre_responsable?: string | null
          reactivo_id: string
          stock_anterior: number
          stock_posterior: number
          tipo_movimiento: string
          unidad_medida: string
          usuario_id?: string | null
        }
        Update: {
          cantidad?: number
          created_at?: string
          id?: string
          laboratorio_id?: string
          motivo?: string | null
          nombre_responsable?: string | null
          reactivo_id?: string
          stock_anterior?: number
          stock_posterior?: number
          tipo_movimiento?: string
          unidad_medida?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bitacora_movimientos_laboratorio_id_fkey"
            columns: ["laboratorio_id"]
            isOneToOne: false
            referencedRelation: "laboratorios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bitacora_movimientos_reactivo_id_fkey"
            columns: ["reactivo_id"]
            isOneToOne: false
            referencedRelation: "catalogo_reactivos"
            referencedColumns: ["id"]
          },
        ]
      }
      catalogo_reactivos: {
        Row: {
          activo: boolean
          clasificacion_riesgo: string
          codigo_unico: string
          created_at: string
          entidades_regulatorias: string[]
          es_regulado: boolean
          es_uso_comun: boolean
          fecha_ultimo_precio: string | null
          formula_quimica: string | null
          id: string
          moneda_precio: string | null
          nfpa_especial: string | null
          nfpa_inestabilidad: number
          nfpa_inflamabilidad: number
          nfpa_salud: number
          nombre: string
          ultimo_precio: number | null
          updated_at: string
        }
        Insert: {
          activo?: boolean
          clasificacion_riesgo: string
          codigo_unico: string
          created_at?: string
          entidades_regulatorias?: string[]
          es_regulado?: boolean
          es_uso_comun?: boolean
          fecha_ultimo_precio?: string | null
          formula_quimica?: string | null
          id?: string
          moneda_precio?: string | null
          nfpa_especial?: string | null
          nfpa_inestabilidad?: number
          nfpa_inflamabilidad?: number
          nfpa_salud?: number
          nombre: string
          ultimo_precio?: number | null
          updated_at?: string
        }
        Update: {
          activo?: boolean
          clasificacion_riesgo?: string
          codigo_unico?: string
          created_at?: string
          entidades_regulatorias?: string[]
          es_regulado?: boolean
          es_uso_comun?: boolean
          fecha_ultimo_precio?: string | null
          formula_quimica?: string | null
          id?: string
          moneda_precio?: string | null
          nfpa_especial?: string | null
          nfpa_inestabilidad?: number
          nfpa_inflamabilidad?: number
          nfpa_salud?: number
          nombre?: string
          ultimo_precio?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      laboratorios: {
        Row: {
          activo: boolean
          codigo: string
          created_at: string
          descripcion: string | null
          id: string
          nombre: string
          updated_at: string
        }
        Insert: {
          activo?: boolean
          codigo: string
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre: string
          updated_at?: string
        }
        Update: {
          activo?: boolean
          codigo?: string
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre?: string
          updated_at?: string
        }
        Relationships: []
      }
      perfiles: {
        Row: {
          cedula: string | null
          contacto: string | null
          created_at: string
          email: string
          id: string
          laboratorio_id: string | null
          nombre_completo: string
          rol: string
          updated_at: string
        }
        Insert: {
          cedula?: string | null
          contacto?: string | null
          created_at?: string
          email: string
          id: string
          laboratorio_id?: string | null
          nombre_completo: string
          rol?: string
          updated_at?: string
        }
        Update: {
          cedula?: string | null
          contacto?: string | null
          created_at?: string
          email?: string
          id?: string
          laboratorio_id?: string | null
          nombre_completo?: string
          rol?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "perfiles_laboratorio_id_fkey"
            columns: ["laboratorio_id"]
            isOneToOne: false
            referencedRelation: "laboratorios"
            referencedColumns: ["id"]
          },
        ]
      }
      prestamos: {
        Row: {
          cantidad_devuelta: number | null
          cantidad_prestada: number
          created_at: string
          estado: string
          fecha_devolucion_real: string | null
          fecha_estimada_devolucion: string
          fecha_prestamo: string
          id: string
          incidencia_devolucion: string | null
          laboratorio_origen_id: string
          nombre_registrador: string | null
          observaciones: string | null
          reactivo_id: string
          solicitante_cedula: string
          solicitante_contacto: string | null
          solicitante_institucion: string
          solicitante_nombre: string
          tipo_prestamo: string
          unidad_medida: string
          updated_at: string
          usuario_registro_id: string | null
        }
        Insert: {
          cantidad_devuelta?: number | null
          cantidad_prestada: number
          created_at?: string
          estado?: string
          fecha_devolucion_real?: string | null
          fecha_estimada_devolucion: string
          fecha_prestamo?: string
          id?: string
          incidencia_devolucion?: string | null
          laboratorio_origen_id: string
          nombre_registrador?: string | null
          observaciones?: string | null
          reactivo_id: string
          solicitante_cedula: string
          solicitante_contacto?: string | null
          solicitante_institucion: string
          solicitante_nombre: string
          tipo_prestamo: string
          unidad_medida: string
          updated_at?: string
          usuario_registro_id?: string | null
        }
        Update: {
          cantidad_devuelta?: number | null
          cantidad_prestada?: number
          created_at?: string
          estado?: string
          fecha_devolucion_real?: string | null
          fecha_estimada_devolucion?: string
          fecha_prestamo?: string
          id?: string
          incidencia_devolucion?: string | null
          laboratorio_origen_id?: string
          nombre_registrador?: string | null
          observaciones?: string | null
          reactivo_id?: string
          solicitante_cedula?: string
          solicitante_contacto?: string | null
          solicitante_institucion?: string
          solicitante_nombre?: string
          tipo_prestamo?: string
          unidad_medida?: string
          updated_at?: string
          usuario_registro_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prestamos_laboratorio_origen_id_fkey"
            columns: ["laboratorio_origen_id"]
            isOneToOne: false
            referencedRelation: "laboratorios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prestamos_reactivo_id_fkey"
            columns: ["reactivo_id"]
            isOneToOne: false
            referencedRelation: "catalogo_reactivos"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_reactivos: {
        Row: {
          cantidad_actual: number
          created_at: string
          es_uso_comun: boolean
          estado_fisico: string | null
          fecha_vencimiento: string | null
          id: string
          laboratorio_id: string
          lote: string | null
          moneda_precio: string | null
          reactivo_id: string
          ubicacion_fisica: string
          ultimo_precio_adquirido: number | null
          umbral_minimo: number
          unidad_medida: string
          updated_at: string
        }
        Insert: {
          cantidad_actual?: number
          created_at?: string
          es_uso_comun?: boolean
          estado_fisico?: string | null
          fecha_vencimiento?: string | null
          id?: string
          laboratorio_id: string
          lote?: string | null
          moneda_precio?: string | null
          reactivo_id: string
          ubicacion_fisica: string
          ultimo_precio_adquirido?: number | null
          umbral_minimo?: number
          unidad_medida: string
          updated_at?: string
        }
        Update: {
          cantidad_actual?: number
          created_at?: string
          es_uso_comun?: boolean
          estado_fisico?: string | null
          fecha_vencimiento?: string | null
          id?: string
          laboratorio_id?: string
          lote?: string | null
          moneda_precio?: string | null
          reactivo_id?: string
          ubicacion_fisica?: string
          ultimo_precio_adquirido?: number | null
          umbral_minimo?: number
          unidad_medida?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_reactivos_laboratorio_id_fkey"
            columns: ["laboratorio_id"]
            isOneToOne: false
            referencedRelation: "laboratorios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_reactivos_reactivo_id_fkey"
            columns: ["reactivo_id"]
            isOneToOne: false
            referencedRelation: "catalogo_reactivos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      actualizar_perfil_registro: {
        Args: {
          p_cedula: string
          p_contacto: string
          p_email: string
          p_laboratorio_codigo: string
          p_nombre_completo: string
          p_user_id: string
        }
        Returns: undefined
      }
      dar_baja_logica_reactivo: {
        Args: {
          p_laboratorio_id: string
          p_motivo?: string
          p_nombre_responsable?: string
          p_reactivo_id: string
        }
        Returns: Json
      }
      get_auth_user_lab_id: { Args: never; Returns: string }
      guardar_reactivo_inventario: {
        Args: {
          p_cantidad_actual?: number
          p_clasificacion_riesgo?: string
          p_codigo_unico?: string
          p_entidades_regulatorias?: string[]
          p_es_regulado?: boolean
          p_es_uso_comun?: boolean
          p_fecha_ultimo_precio?: string
          p_fecha_vencimiento?: string
          p_formula_quimica?: string
          p_laboratorio_id: string
          p_lote?: string
          p_moneda_precio?: string
          p_motivo_ajuste?: string
          p_nfpa_especial?: string
          p_nfpa_inestabilidad?: number
          p_nfpa_inflamabilidad?: number
          p_nfpa_salud?: number
          p_nombre: string
          p_nombre_responsable?: string
          p_reactivo_id?: string
          p_ubicacion_fisica?: string
          p_ultimo_precio?: number
          p_umbral_minimo?: number
          p_unidad_medida?: string
        }
        Returns: Json
      }
      is_admin: { Args: never; Returns: boolean }
      resolver_email_login: {
        Args: {
          p_identificador: string
        }
        Returns: string | null
      }
      registrar_consumo_reactivo: {
        Args: {
          p_cantidad: number
          p_laboratorio_id: string
          p_motivo?: string
          p_nombre_responsable?: string
          p_reactivo_id: string
        }
        Returns: Json
      }
      registrar_devolucion_prestamo: {
        Args: {
          p_cantidad_devuelta?: number
          p_estado_cierre?: string
          p_incidencia?: string
          p_nombre_responsable?: string
          p_prestamo_id: string
        }
        Returns: Json
      }
      registrar_prestamo_reactivo: {
        Args: {
          p_cantidad?: number
          p_fecha_estimada_devolucion?: string
          p_fecha_prestamo?: string
          p_laboratorio_id: string
          p_nombre_registrador?: string
          p_observaciones?: string
          p_reactivo_id: string
          p_solicitante_cedula: string
          p_solicitante_contacto?: string
          p_solicitante_institucion: string
          p_solicitante_nombre: string
          p_tipo_prestamo?: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
