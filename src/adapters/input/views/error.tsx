import { FC } from "hono/jsx";
import { Card } from "./components/card";

export type ErrorPageProps = {
  error: string;
  homePath: string;
};

export const ErrorPage: FC<ErrorPageProps> = ({ error, homePath }) => {
  return (
    <Card title="An Error Occurred">
      <>
        <p className="text-gray-700 mb-4 text-red-600">{error}</p>
        <a href={homePath} className="text-blue-500 hover:underline">
          Go back to Home
        </a>
      </>
    </Card>
  );
};
