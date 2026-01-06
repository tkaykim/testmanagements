import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) return null;

  // 서비스 역할 키를 사용하여 RLS를 우회
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function GET(request: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase 환경변수가 설정되어 있지 않습니다.' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('company_id');

    let query = supabaseAdmin
      .from('partner_worker')
      .select('id, name, name_ko, name_en, phone, email, partner_company_id')
      .eq('is_active', true)
      .order('name_ko', { ascending: true });

    // 회사 ID가 제공되면 해당 회사의 담당자만 필터링
    if (companyId) {
      query = query.eq('partner_company_id', parseInt(companyId, 10));
    }

    const { data, error } = await query;

    if (error) {
      console.error('파트너 워커 목록 조회 실패:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error('서버 에러:', error);
    return NextResponse.json({ error: '서버 에러가 발생했습니다.' }, { status: 500 });
  }
}

