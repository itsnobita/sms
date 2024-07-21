import axios from "axios";
export async function getShortURL(_id: string, name: string) {
  try {
    const response = await axios.post(
      `${process.env.SHORTURL_CREATE}`,
      {
        long_url: `${process.env.BASEURL}/${_id}`,
        // expire_at_datetime: "2035-01-17 15:00:00",
        description: `Send ${name} a annonymous message by Secret Message Sender`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SHORTURL_KEY}`,
        },
      }
    );
    console.log(response);
    return response.data.short_url;
  } catch (error) {
    throw error;
  }
}
