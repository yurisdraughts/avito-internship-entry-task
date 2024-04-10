import { useAsyncError } from "react-router-dom";
import ErrorElement from "./ErrorElement";

export default function AsyncErrorElement() {
  const error = useAsyncError() as Error;

  return <ErrorElement error={error} />;
}
