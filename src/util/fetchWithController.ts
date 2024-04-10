const host = "https://api.kinopoisk.dev/v1.4/";
const token = process.env.TOKEN;

export default async function customFetch<T>(path: string): Promise<{
  data: T | null;
  controller: AbortController;
}> {
  const controller = new AbortController();
  const input = host + path;

  const request = new Request(input, {
    method: "GET",
    headers: {
      accept: "application/json",
      "X-API-KEY": `${token}`,
    },
    signal: controller.signal,
  });

  let data: T | null = null;

  try {
    const response = await fetch(request);

    if (response.status !== 200) {
      throw new Error(
        `HTTP error! API endpoint: ${input}. Status: ${response.status}`
      );
    }

    data = await response.json();
  } catch (e) {
    console.error(e);
    throw e;
  }

  return { data, controller };
}
