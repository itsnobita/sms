import { getUniqueRandomNumber } from '@/helpers/getRandomNumber';
import messages from '@/sugget-message.json'


export async function POST(request: Request) {
  
    try {
      const { id } = await request.json();
        const newId = getUniqueRandomNumber(id)
        const message = messages[newId].split("||")
  
      return Response.json(
        {
          success: true,
              suggestions: message,
          suggestionId:newId
        },
        { status: 200 }
      );
    } catch (error) {
      return Response.json(
        {
          succsess: false,
          message: "Error getting suggest message",
        },
        { status: 500 }
      );
    }
  }
  