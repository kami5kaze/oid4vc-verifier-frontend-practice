import { FC } from 'hono/jsx';
import { Card } from './components/card';
import { GetWalletResponseResponse } from '../../../domain/GetWalletResponseResponse';

export type ResultProps = {
  response: GetWalletResponseResponse;
  homePath: string;
};

export const Result: FC<ResultProps> = ({ response, homePath }) => {
  return (
    <Card title="VP Token">
      <>
        <div>
          <textarea
            name="vp_token"
            id="vp_token"
            disabled={true}
            class="w-full h-96 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
          >
            {response?.vpToken}
          </textarea>
        </div>
        <a href={homePath} className="text-blue-500 hover:underline">
          Go back to Home
        </a>
      </>
    </Card>
  );
};
