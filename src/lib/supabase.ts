import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

let cachedClient: SupabaseClient<Database> | null = null;

/**
 * 빌드/프리렌더 환경에서 ENV가 없을 수 있어, 모듈 로드 시점에 createClient를 호출하지 않습니다.
 * (ENV가 없으면 Supabase SDK가 즉시 예외를 던져 `next build`가 실패함)
 */
export function getSupabaseClient(): SupabaseClient<Database> | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) return null;

  if (!cachedClient) {
    cachedClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }

  return cachedClient;
}

