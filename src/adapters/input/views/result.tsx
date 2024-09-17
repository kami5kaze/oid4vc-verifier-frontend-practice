import { FC } from 'hono/jsx';
import { Card } from './components/card';
import { GetWalletResponseResponse } from '../../../domain/GetWalletResponseResponse';

export const Result: FC<{ response: GetWalletResponseResponse }> = ({
  response,
}) => {
  return (
    <Card title="VP Token">
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
    </Card>
  );
};
