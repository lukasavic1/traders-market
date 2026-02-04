import { NextRequest, NextResponse } from 'next/server';
import archiver from 'archiver';
import { createSupabaseAdmin, STORAGE } from '@/lib/supabase';

/**
 * GET /api/download-ex5?name=file.ex5  -> download single file
 * GET /api/download-ex5                -> download all .ex5 files as zip
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseAdmin();
    const { searchParams } = new URL(request.url);
    const singleName = searchParams.get('name');

    if (singleName) {
      const path = singleName;
      if (!singleName.toLowerCase().endsWith('.ex5')) {
        return NextResponse.json(
          { error: 'Only .ex5 files are allowed' },
          { status: 400 }
        );
      }
      const { data, error } = await supabase.storage
        .from(STORAGE.BUCKET)
        .download(path);

      if (error) {
        console.error('Download error:', error);
        return NextResponse.json(
          { error: error.message || 'File not found' },
          { status: 404 }
        );
      }
      if (!data) {
        return NextResponse.json({ error: 'No data' }, { status: 404 });
      }

      const buffer = Buffer.from(await data.arrayBuffer());
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${singleName}"`,
          'Content-Length': String(buffer.length),
        },
      });
    }

    // Zip all .ex5 files from bucket root
    const { data: list } = await supabase.storage
      .from(STORAGE.BUCKET)
      .list('', { limit: 1000 });

    const ex5Files = (list ?? []).filter((f) =>
      f.name?.toLowerCase().endsWith('.ex5')
    );

    if (ex5Files.length === 0) {
      return NextResponse.json(
        { error: 'No .ex5 files found in ea-bots bucket' },
        { status: 404 }
      );
    }

    const archive = archiver('zip', { zlib: { level: 6 } });
    const chunks: Buffer[] = [];
    archive.on('data', (chunk: Buffer) => chunks.push(chunk));

    const zipPromise = new Promise<Buffer>((resolve, reject) => {
      archive.on('end', () => resolve(Buffer.concat(chunks)));
      archive.on('error', reject);
    });

    for (const file of ex5Files) {
      const path = file.name!;
      const { data, error } = await supabase.storage
        .from(STORAGE.BUCKET)
        .download(path);
      if (error || !data) continue;
      const buf = Buffer.from(await data.arrayBuffer());
      archive.append(buf, { name: file.name! });
    }

    archive.finalize();
    const zipBuffer = await zipPromise;

    return new NextResponse(new Uint8Array(zipBuffer), {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="ea-bots-ex5.zip"',
        'Content-Length': String(zipBuffer.length),
      },
    });
  } catch (err) {
    console.error('Download API error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
