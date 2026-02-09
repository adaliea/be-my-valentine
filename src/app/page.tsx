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

  const footer = (
    <footer className="m-0 mt-auto w-full">
      <div className="w-full max-w-7xl mx-auto p-2 flex flex-col justify-center items-center">
        <div className="flex flex-row items-center text-sm font-medium text-body w-fit justify-between gap-5">
          <a href="https://github.com/adaliea/be-my-valentine?tab=readme-ov-file#-deployment-guide" className="hover:underline">
            Deploy your own
          </a>
          <a href="https://github.com/sponsors/adaliea" className="hover:underline">
            Sponsor me
          </a>
        </div>
      </div>
    </footer>
  );



  return (
    <main className="overflow-hidden bg-pink-50  min-h-screen flex flex-col">
      <ValentineClient name={nameToDisplay} />
      {!nameToDisplay ? footer : <></>}
    </main>

  );
}
