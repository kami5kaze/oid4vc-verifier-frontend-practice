import { FC } from "hono/jsx";
import { Card } from "./components/card";

export type InitProps = {
  redirectUrl: string;
  homePath: string;
};

export const Init: FC<InitProps> = ({ redirectUrl, homePath }) => {
  return (
    <Card title="Verification Started">
      <>
        <a
          href={redirectUrl}
          class="block text-center text-lg text-white bg-green-500 hover:bg-green-700 py-2 px-4 rounded mb-4"
        >
          Redirect to Wallet
        </a>
        <a href={homePath} className="text-blue-500 hover:underline">
          Go back to Home
        </a>
      </>
    </Card>
  );
};
