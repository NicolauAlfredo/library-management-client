export function Loading({ message = "Loading..." }: { message?: string }) {
  return <p className="text-sm text-gray-500">{message}</p>;
}
