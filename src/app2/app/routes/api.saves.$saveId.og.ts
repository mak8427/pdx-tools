import { s3Fetch, s3Keys } from '@/server-lib/s3';
import { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { z } from 'zod';

const saveSchema = z.object({ saveId: z.string().regex(/^[a-z0-9_-]*$/i) });
export async function loader({ params }: LoaderFunctionArgs) {
  const save = saveSchema.parse(params);
  return s3Fetch(s3Keys.preview(save.saveId));
}
