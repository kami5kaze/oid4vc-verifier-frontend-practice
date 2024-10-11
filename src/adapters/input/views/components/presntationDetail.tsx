import { Tag } from 'cbor-x';
import { FC } from 'hono/jsx';
import { Buffer } from 'node:buffer';

const mimeType = 'image/png';

export const PresentationDetail: FC<{
  title: string;
  data: Record<string, unknown>;
}> = ({ title, data }) => {
  const mapData = (data: Record<string, unknown>) => {
    return Object.entries(data).map(([key, value]) => (
      <div>
        <p class="text-sm text-gray-500">{key}</p>
        {value instanceof Uint8Array ? (
          <image
            class="max-w-24 max-h-24"
            src={`data:${mimeType};base64,${Buffer.from(value).toString(
              'base64'
            )}`}
          />
        ) : value instanceof Tag ? (
          <p class="w-full truncate">{`${
            value.value instanceof Date
              ? value.value.toDateString()
              : value.value
          }`}</p>
        ) : Array.isArray(value) ? (
          <div class="ml-2">
            {value.map((v) => (
              <div class="ml-2">{mapData(v as Record<string, unknown>)}</div>
            ))}
          </div>
        ) : typeof value === 'object' &&
          value !== null &&
          !(value instanceof Date) ? (
          <div class="ml-2">{mapData(value as Record<string, unknown>)}</div>
        ) : (
          <p class="w-full truncate">{`${
            value instanceof Date ? value.toDateString() : value
          }`}</p>
        )}
      </div>
    ));
  };

  return (
    <section>
      <div class="mb-2">
        <h3 class="text-gray-800">{title}</h3>
      </div>
      <div class="bg-white rounded-lg p-2 m-1 border border-gray-200">
        {mapData(data)}
      </div>
    </section>
  );
};
