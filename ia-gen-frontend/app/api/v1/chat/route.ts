export async function POST(req: Request) {
  const { messages }: { messages: any[] } = await req.json();

  const normalizedMessages = messages.map((msg) => {
    let content = msg.content;
    
    if (Array.isArray(content)) {
      content = content
        .filter((part: any) => part.type === 'text')
        .map((part: any) => part.text)
        .join('');
    }
    else if (!content && Array.isArray(msg.parts)) {
      content = msg.parts
        .filter((part: any) => part.type === 'text')
        .map((part: any) => part.text)
        .join('');
    }
    
    return {
      role: msg.role,
      content: content,
    };
  });

  const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';
  const backendUrl = backendBaseUrl + '/chat';

  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: normalizedMessages }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(`Backend error: ${response.status}`, {
        status: response.status,
      });
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'text/plain',
      },
    });
  } catch (error) {
    return new Response(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, {
      status: 500,
    });
  }
}