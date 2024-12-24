export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics: {
        Row: {
          id: string
          market_value: number | null
          recorded_at: string
          total_holders: number | null
          transaction_count: number | null
          transaction_volume: number | null
        }
        Insert: {
          id?: string
          market_value?: number | null
          recorded_at?: string
          total_holders?: number | null
          transaction_count?: number | null
          transaction_volume?: number | null
        }
        Update: {
          id?: string
          market_value?: number | null
          recorded_at?: string
          total_holders?: number | null
          transaction_count?: number | null
          transaction_volume?: number | null
        }
        Relationships: []
      }
      app_config: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      comment_votes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
          vote_type: number
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          vote_type: number
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          vote_type?: number
        }
        Relationships: [
          {
            foreignKeyName: "comment_votes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          formatted_content: Json | null
          id: string
          mentions: string[] | null
          parent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          formatted_content?: Json | null
          id?: string
          mentions?: string[] | null
          parent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          formatted_content?: Json | null
          id?: string
          mentions?: string[] | null
          parent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          end_date: string
          id: string
          location: string | null
          start_date: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          location?: string | null
          start_date: string
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          location?: string | null
          start_date?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_metrics: {
        Row: {
          endpoint: string
          error_message: string | null
          error_type: string | null
          id: string
          latency: number
          success: boolean
          timestamp: string
        }
        Insert: {
          endpoint: string
          error_message?: string | null
          error_type?: string | null
          id?: string
          latency: number
          success: boolean
          timestamp?: string
        }
        Update: {
          endpoint?: string
          error_message?: string | null
          error_type?: string | null
          id?: string
          latency?: number
          success?: boolean
          timestamp?: string
        }
        Relationships: []
      }
      poll_options: {
        Row: {
          created_at: string
          id: string
          poll_id: string
          text: string
        }
        Insert: {
          created_at?: string
          id?: string
          poll_id: string
          text: string
        }
        Update: {
          created_at?: string
          id?: string
          poll_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_options_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_votes: {
        Row: {
          created_at: string
          id: string
          poll_option_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          poll_option_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          poll_option_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_votes_poll_option_id_fkey"
            columns: ["poll_option_id"]
            isOneToOne: false
            referencedRelation: "poll_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poll_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          created_at: string
          description: string | null
          end_date: string
          id: string
          question: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          question: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          question?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "polls_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      price_data: {
        Row: {
          created_at: string | null
          id: string
          last_updated: string | null
          market_cap: number | null
          price: number
          price_change_24h: number | null
          source: string
          symbol: string
          updated_at: string | null
          volume_24h: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_updated?: string | null
          market_cap?: number | null
          price: number
          price_change_24h?: number | null
          source: string
          symbol: string
          updated_at?: string | null
          volume_24h?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_updated?: string | null
          market_cap?: number | null
          price?: number
          price_change_24h?: number | null
          source?: string
          symbol?: string
          updated_at?: string | null
          volume_24h?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      rpc_connection_logs: {
        Row: {
          created_at: string
          endpoint: string
          error_message: string | null
          id: string
          latency: number | null
          success: boolean
        }
        Insert: {
          created_at?: string
          endpoint: string
          error_message?: string | null
          id?: string
          latency?: number | null
          success: boolean
        }
        Update: {
          created_at?: string
          endpoint?: string
          error_message?: string | null
          id?: string
          latency?: number | null
          success?: boolean
        }
        Relationships: []
      }
      rpc_health_metrics: {
        Row: {
          endpoint: string
          error: string | null
          id: string
          latency: number | null
          status: string
          timestamp: string
        }
        Insert: {
          endpoint: string
          error?: string | null
          id?: string
          latency?: number | null
          status: string
          timestamp?: string
        }
        Update: {
          endpoint?: string
          error?: string | null
          id?: string
          latency?: number | null
          status?: string
          timestamp?: string
        }
        Relationships: []
      }
      strategic_reserve_transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          price_per_btc: number
          total_value: number
          transaction_date: string
          transaction_hash: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          price_per_btc: number
          total_value: number
          transaction_date?: string
          transaction_hash: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          price_per_btc?: number
          total_value?: number
          transaction_date?: string
          transaction_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
      swap_metrics: {
        Row: {
          amount: number
          duration: number | null
          error: string | null
          from_token: string
          id: string
          price_impact: number | null
          success: boolean
          timestamp: string
          to_token: string
        }
        Insert: {
          amount: number
          duration?: number | null
          error?: string | null
          from_token: string
          id?: string
          price_impact?: number | null
          success: boolean
          timestamp?: string
          to_token: string
        }
        Update: {
          amount?: number
          duration?: number | null
          error?: string | null
          from_token?: string
          id?: string
          price_impact?: number | null
          success?: boolean
          timestamp?: string
          to_token?: string
        }
        Relationships: []
      }
      swap_transactions: {
        Row: {
          created_at: string
          from_amount: number
          from_token: string
          gas_fee: number | null
          id: string
          slippage: number
          status: string
          swap_route: Json | null
          to_amount: number
          to_token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          from_amount: number
          from_token: string
          gas_fee?: number | null
          id?: string
          slippage?: number
          status?: string
          swap_route?: Json | null
          to_amount: number
          to_token: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          from_amount?: number
          from_token?: string
          gas_fee?: number | null
          id?: string
          slippage?: number
          status?: string
          swap_route?: Json | null
          to_amount?: number
          to_token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "swap_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_alerts: {
        Row: {
          created_at: string
          id: string
          message: string
          metadata: Json | null
          resolved_at: string | null
          resolved_by: string | null
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          type?: string
        }
        Relationships: []
      }
      token_counsel_members: {
        Row: {
          contact_email: string | null
          created_at: string
          id: string
          image_url: string | null
          name: string
          role: string
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          role: string
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      token_metrics: {
        Row: {
          burn_amount: number | null
          created_at: string
          id: string
          market_cap: number
          price: number
          timeframe: string
          timestamp: string
          volume_24h: number
          wallet_count: number
        }
        Insert: {
          burn_amount?: number | null
          created_at?: string
          id?: string
          market_cap: number
          price: number
          timeframe: string
          timestamp?: string
          volume_24h: number
          wallet_count: number
        }
        Update: {
          burn_amount?: number | null
          created_at?: string
          id?: string
          market_cap?: number
          price?: number
          timeframe?: string
          timestamp?: string
          volume_24h?: number
          wallet_count?: number
        }
        Relationships: []
      }
      token_pairs: {
        Row: {
          base_token_id: string
          created_at: string
          id: string
          is_active: boolean | null
          max_amount: number | null
          min_amount: number | null
          quote_token_id: string
          updated_at: string
        }
        Insert: {
          base_token_id: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          max_amount?: number | null
          min_amount?: number | null
          quote_token_id: string
          updated_at?: string
        }
        Update: {
          base_token_id?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          max_amount?: number | null
          min_amount?: number | null
          quote_token_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_pairs_base_token_id_fkey"
            columns: ["base_token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "token_pairs_quote_token_id_fkey"
            columns: ["quote_token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      tokens: {
        Row: {
          created_at: string
          decimals: number
          id: string
          is_active: boolean | null
          logo_uri: string | null
          mint_address: string
          name: string
          symbol: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          decimals: number
          id?: string
          is_active?: boolean | null
          logo_uri?: string | null
          mint_address: string
          name: string
          symbol: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          decimals?: number
          id?: string
          is_active?: boolean | null
          logo_uri?: string | null
          mint_address?: string
          name?: string
          symbol?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
