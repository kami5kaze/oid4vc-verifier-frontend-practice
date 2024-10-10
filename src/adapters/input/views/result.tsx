import { FC } from 'hono/jsx';
import { Card } from './components/card';

export type ResultProps = {
  data: Record<string, unknown>[] | undefined;
  vpToken: string;
  homePath: string;
};

export const Result: FC<ResultProps> = ({ data, vpToken, homePath }) => {
  return (
    <Card title="Presentation Result">
      <>
        <div>
          {data?.map((v) =>
            Object.entries(v).map(([key, value]) => (
              <div>
                <p className="text-sm text-gray-500">{key}</p>
                <p className="">{value}</p>
              </div>
            ))
          )}
        </div>
        <details class="mt-6">
          <summary>Raw VP Token</summary>
          <div>
            <textarea
              name="vp_token"
              id="vp_token"
              disabled={true}
              class="w-full h-96 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
            >
              {vpToken}
            </textarea>
          </div>
        </details>
        <a href={homePath} className="text-blue-500 hover:underline">
          Go back to Home
        </a>
      </>
    </Card>
  );
};
