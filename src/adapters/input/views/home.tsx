import { FC } from "hono/jsx";
import { Card } from "./components/card";

export type HomeProps = {
  initTransactionPath: string;
};

export const Home: FC<HomeProps> = ({ initTransactionPath }) => {
  return (
    <Card title="Start Verification">
      <>
        <a
          href={initTransactionPath}
          class="block text-center text-lg text-white bg-green-500 hover:bg-green-700 py-2 px-4 rounded mb-4"
        >
          mDL Verification
        </a>
      </>
    </Card>
  );
};
