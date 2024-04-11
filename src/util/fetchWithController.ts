const host = "https://api.kinopoisk.dev/v1.4/";
const countryListHost = "https://api.kinopoisk.dev/v1/";
const token = process.env.TOKEN;

const fetchWithController =
  (host: string) =>
  async <T>(
    path: string
  ): Promise<{
    data: T | null;
    controller: AbortController;
  }> => {
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

    for (let i = 0; i < 3; i++) {
      try {
        const response = await fetch(request);

        if (response.status !== 200) {
          throw new Error(
            `HTTP error! API endpoint: ${input}. Status: ${response.status}`
          );
        }

        data = await response.json();
        break;
      } catch (e) {
        console.error(e);
        if (i < 3) continue;
        throw e;
      }
    }

    return { data, controller };
  };

export default fetchWithController(host);
export const fetchCountryList = fetchWithController(countryListHost);
