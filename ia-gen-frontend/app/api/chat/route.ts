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

    const reader = response.body?.getReader();
    const textDecoder = new TextDecoder();
    
    const transformStream = new ReadableStream({
      async start(controller) {
        if (!reader) {
          controller.close();
          return;
        }
        
        try {
          let buffer = '';
          
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              break;
            }
            
            const chunk = textDecoder.decode(value, { stream: true });
            buffer += chunk;
            
            const lines = buffer.split('\n');
            buffer = lines[lines.length - 1];
            
            for (let i = 0; i < lines.length - 1; i++) {
              const line = lines[i].trim();
              if (!line) continue;
              
              if (line.startsWith('data: ')) {
                try {
                  const jsonStr = line.substring(6);
                  const event = JSON.parse(jsonStr);
                  
                  if (event.type === 'text_delta' && event.text) {
                    controller.enqueue(new TextEncoder().encode(event.text));
                  }
                } catch (e) {
                  
                }
              }
            }
          }
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(transformStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, {
      status: 500,
    });
  }
}
