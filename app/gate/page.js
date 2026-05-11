export const metadata = {
  title: 'Nhập mật khẩu'
};

export default function GatePage({ searchParams }) {
  const err = searchParams?.err;
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
        fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#f1f5f9'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 20,
          padding: 28,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
        }}
      >
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>B00 Study Hub</h1>
        <p style={{ marginTop: 8, marginBottom: 18, color: '#cbd5e1', fontSize: 14 }}>
          Nhập mật khẩu để truy cập.
        </p>

        <form method="POST" action="/api/gate">
          <label style={{ display: 'block', fontSize: 13, color: '#cbd5e1', fontWeight: 600 }}>
            Mật khẩu
          </label>
          <input
            name="password"
            type="password"
            autoFocus
            required
            style={{
              marginTop: 8,
              width: '100%',
              padding: '12px 14px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(15,23,42,0.6)',
              color: '#f1f5f9',
              outline: 'none'
            }}
          />

          {err ? (
            <div style={{ marginTop: 10, color: '#f87171', fontSize: 13 }}>
              Mật khẩu không đúng.
            </div>
          ) : null}

          <button
            type="submit"
            style={{
              marginTop: 14,
              width: '100%',
              padding: '12px 14px',
              borderRadius: 12,
              border: 0,
              cursor: 'pointer',
              fontWeight: 700,
              color: '#fff',
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)'
            }}
          >
            Vào trang
          </button>
        </form>

        <p style={{ marginTop: 14, marginBottom: 0, color: '#94a3b8', fontSize: 12 }}>
          Nếu bạn chưa có mật khẩu, hãy liên hệ quản trị viên.
        </p>
      </div>
    </main>
  );
}

