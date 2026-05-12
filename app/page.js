import { readFileSync } from 'fs';
import { join } from 'path';

export default function Home() {
  try {
    // Read index.html on server side
    const indexPath = join(process.cwd(), 'public', 'index.html');
    const htmlContent = readFileSync(indexPath, 'utf-8');
    
    // Render as HTML with dangerouslySetInnerHTML
    return (
      <div
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        suppressHydrationWarning
      />
    );
  } catch (error) {
    console.error('Error loading app:', error);
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial' }}>
        <h1>Lỗi tải ứng dụng</h1>
        <p>Không thể tải giao diện. Vui lòng thử lại.</p>
      </div>
    );
  }
}

