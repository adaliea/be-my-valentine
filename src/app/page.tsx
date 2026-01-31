import { cookies } from 'next/headers';
import ValentineClient from './components/ValentineClient';

export default async function Home() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('valentine_token');
  const userToken = tokenCookie?.value;

  const validToken = process.env.VALENTINE_TOKEN;
  const partnerName = process.env.PARTNER_NAME;

  let nameToDisplay: string | null = null
  
  if (validToken && userToken === validToken) {
    nameToDisplay = partnerName || null;
  }

  return (
    <main className="overflow-hidden bg-pink-50  h-full">
      <ValentineClient name={nameToDisplay} />
    </main>
  );
}