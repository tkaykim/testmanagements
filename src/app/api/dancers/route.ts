import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// 서비스 역할 키를 사용하여 RLS를 우회
const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('company_id');

    // 댄서 목록 조회
    let query = supabaseAdmin
      .from('dancers')
      .select('*')
      .order('created_at', { ascending: false });

    if (companyId) {
      query = query.eq('partner_company_id', parseInt(companyId));
    }

    const { data: dancersData, error: dancersError } = await query;

    if (dancersError) {
      console.error('댄서 목록 조회 실패:', dancersError);
      return NextResponse.json({ error: dancersError.message }, { status: 500 });
    }

    const dancers = dancersData || [];

    // 각 댄서의 팀 정보 조회 (Supabase MCP 활용)
    const dancersWithTeams = await Promise.all(
      dancers.map(async (dancer) => {
        try {
          const { data: mapping } = await (supabaseAdmin as any)
            .from('dancer_team_mapping')
            .select('dance_team_id')
            .eq('dancer_id', dancer.id)
            .limit(1)
            .maybeSingle();

          if (mapping && mapping.dance_team_id) {
            const { data: team } = await (supabaseAdmin as any)
              .from('dance_team')
              .select('id, name_ko, name_en')
              .eq('id', mapping.dance_team_id)
              .maybeSingle();

            return {
              ...dancer,
              dance_team: team || null,
              dance_team_id: team?.id || null,
            };
          }
        } catch (error) {
          console.error(`댄서 ${dancer.id}의 팀 정보 조회 실패:`, error);
        }

        return {
          ...dancer,
          dance_team: null,
          dance_team_id: null,
        };
      })
    );

    return NextResponse.json({ data: dancersWithTeams });
  } catch (error) {
    console.error('서버 에러:', error);
    return NextResponse.json({ error: '서버 에러가 발생했습니다.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // gender 필드가 빈 문자열이면 null로 변환
    if (body.gender === '') {
      body.gender = null;
    }
    
    // 다른 문자열 필드들도 빈 문자열을 null로 변환
    const stringFields = ['contact', 'nationality', 'nickname_ko', 'nickname_en', 'real_name', 'note', 'team_name', 'visa_type'];
    stringFields.forEach((field) => {
      if (body[field] === '') {
        body[field] = null;
      }
    });
    
    // 날짜 필드 처리
    const dateFields = ['contract_start', 'contract_end', 'visa_start', 'visa_end'];
    dateFields.forEach((field) => {
      if (body[field] === '') {
        body[field] = null;
      }
    });
    
    const { data, error } = await supabaseAdmin.from('dancers').insert(body).select();

    if (error) {
      console.error('댄서 추가 실패:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data?.[0] });
  } catch (error) {
    console.error('서버 에러:', error);
    return NextResponse.json({ error: '서버 에러가 발생했습니다.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID가 필요합니다.' }, { status: 400 });
    }

    // gender 필드가 빈 문자열이면 null로 변환
    if (updateData.gender === '') {
      updateData.gender = null;
    }
    
    // 다른 문자열 필드들도 빈 문자열을 null로 변환
    const stringFields = ['contact', 'nationality', 'nickname_ko', 'nickname_en', 'real_name', 'note', 'team_name', 'visa_type'];
    stringFields.forEach((field) => {
      if (updateData[field] === '') {
        updateData[field] = null;
      }
    });
    
    // 날짜 필드 처리
    const dateFields = ['contract_start', 'contract_end', 'visa_start', 'visa_end'];
    dateFields.forEach((field) => {
      if (updateData[field] === '') {
        updateData[field] = null;
      }
    });

    const { data, error } = await supabaseAdmin
      .from('dancers')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('댄서 수정 실패:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data?.[0] });
  } catch (error) {
    console.error('서버 에러:', error);
    return NextResponse.json({ error: '서버 에러가 발생했습니다.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID가 필요합니다.' }, { status: 400 });
    }

    const dancerId = parseInt(id);

    // 먼저 dancer_team_mapping에서 관련 데이터 삭제
    const { error: mappingError } = await (supabaseAdmin as any)
      .from('dancer_team_mapping')
      .delete()
      .eq('dancer_id', dancerId);

    if (mappingError) {
      console.error('팀 매핑 삭제 실패:', mappingError);
      // 매핑 삭제 실패해도 댄서 삭제는 계속 진행
    }

    // 댄서 삭제
    const { error } = await supabaseAdmin.from('dancers').delete().eq('id', dancerId);

    if (error) {
      console.error('댄서 삭제 실패:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('서버 에러:', error);
    return NextResponse.json({ error: '서버 에러가 발생했습니다.' }, { status: 500 });
  }
}

