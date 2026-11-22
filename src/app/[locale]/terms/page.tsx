export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      {/* 홈 화면 푸터에서 들어오는 페이지인데 BottomNav도 없고 뒤로가기 버튼도 없어서,
          iOS에서는(하드웨어 뒤로가기 리스너가 안드로이드 전용이라) 못 나가는 막다른
          화면이었음(2026-11-22 점검, K-POP Korean 초기 버그와 동일 패턴) — 홈으로
          돌아가는 링크 추가 */}
      <a href={`/${locale}`} style={{ display: 'inline-block', marginBottom: '20px', padding: '8px 16px', border: '1px solid #1a3a5c', borderRadius: '20px', color: '#1a3a5c', textDecoration: 'none', fontSize: '14px' }}>
        {locale === 'ko' ? '← 뒤로' : '← Back'}
      </a>
      <h1>Terms of Service</h1>
      <p>Last updated: June 2026</p>
      <h2>1. Acceptance of Terms</h2>
      <p>By using K-Tour Guide, you agree to these terms of service.</p>
      <h2>2. Use of Service</h2>
      <p>K-Tour Guide provides travel information and guides for Korea. The service is provided as-is.</p>
      <h2>3. Payment</h2>
      <p>Pro features require a one-time lifetime payment of $9.99 processed securely via Paddle.</p>
      <h2>4. Contact</h2>
      <p>For questions, contact: ss122000@naver.com</p>
    </div>
  );
}
