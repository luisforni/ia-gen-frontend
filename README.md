# IA-Gen Frontend

[![GitHub repo](https://img.shields.io/badge/GitHub-luisforni-blue?style=flat&logo=github)](https://github.com/luisforni/ia-gen-frontend)
[![License](https://img.shields.io/badge/License-MIT-green)](#-licencia)
![Next.js](https://img.shields.io/badge/Next.js-16+-black?logo=next.js)
![React](https://img.shields.io/badge/React-19+-blue?logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4+-06B6D4?logo=tailwindcss)

Frontend de Chat Generativo construido con Next.js, TailwindCSS y Vercel AI SDK.

## 🚀 Descripción

Interfaz moderna y responsiva para un servicio de chat generativo. Proporciona una experiencia de usuario fluida con streaming de respuestas en tiempo real y soporte para markdown en las respuestas de la IA.

## 🎨 Features

- ✅ Chat en tiempo real con streaming
- ✅ Interfaz responsiva y moderna
- ✅ Auto-scroll de mensajes
- ✅ Soporte completo para Markdown
- ✅ Bloques de código con coloreado de sintaxis
- ✅ Botón para copiar código
- ✅ Indicador de carga
- ✅ Historial de conversación
- ✅ TypeScript para máxima seguridad de tipos

## 🏗 Arquitectura

```
app/
├── page.tsx                     # Componente principal del chat
├── layout.tsx                   # Layout raíz
├── globals.css                  # Estilos globales
├── api/
│   ├── chat/route.ts           # Proxy del chat (normalización)
│   └── v1/chat/route.ts        # Endpoint alternativo
└── components/
    └── (implícitos en page.tsx)
```

## 📋 Requisitos

- Node.js 18+
- npm o pnpm
- Backend ejecutándose en localhost:8000

## 🔧 Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/luisforni/ia-gen-frontend.git
cd ia-gen-frontend/ia-gen-frontend
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus valores:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_DEBUG=true
```

## 🚀 Desarrollo

### Iniciar servidor de desarrollo:
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Build para producción:
```bash
npm run build
npm start
```

## 📦 Stack Tecnológico

- **Framework**: Next.js 16.1.6 (React 19)
- **Styling**: TailwindCSS 4
- **Chat SDK**: Vercel AI (@ai-sdk/react v3.0.110)
- **Markdown**: react-markdown
- **Icons**: Lucide React
- **Language**: TypeScript 5

## 🔌 Integración Backend

### Comunicación

El frontend se comunica con el backend a través de dos rutas:

1. **`/api/chat`** (Recomendada)
   - Normaliza mensajes (convierte `parts` a `content`)
   - Decodifica caracteres Unicode
   - Procesa el stream correctamente

2. **`/api/v1/chat`** (Alternativa)
   - Proxy directo al backend
   - Similar función de normalización

### Flujo de Datos

```
Frontend (React) 
    ↓
/api/chat (Node.js proxy)
    ↓
Backend FastAPI (/api/v1/chat)
    ↓
Ollama (LLM)
```

### Normalización de Mensajes

El frontend envía mensajes con estructura:
```typescript
{
  role: 'user',
  content: [{ type: 'text', text: 'Mensaje' }]
}
```

El proxy normaliza a:
```json
{
  "role": "user",
  "content": "Mensaje"
}
```

## 🎨 Componentes Principales

### Página Principal (`page.tsx`)

Contiene:
- Componente `CodeBlock`: Renderiza bloques de código con coloreado y botón copy
- Función `getMessageText()`: Extrae texto de diferentes formatos de mensaje
- Hook `useChat`: Maneja el estado y comunicación del chat
- Interfaz responsiva con TailwindCSS

### Estructura del Mensaje

Los mensajes pueden tener dos estructuras:

**Usuario:**
```typescript
{
  role: 'user',
  content: [{ type: 'text', text: '...' }],
  id: 'string',
  metadata: undefined
}
```

**Asistente:**
```typescript
{
  role: 'assistant',
  parts: [{ type: 'text', text: '...' }],
  id: 'string',
  metadata: undefined
}
```

## 🎯 Características Destacadas

### Markdown Rendering
Las respuestas de la IA se renderan como Markdown completo:
- **Texto en negrita**: `**texto**`
- *Texto en itálica*: `*texto*`
- Listas: `- item` o `1. item`
- Blockquotes: `> cita`
- Código inline: `` `código` ``

### Bloques de Código
- Coloreado de sintaxis por lenguaje
- Botón para copiar al portapapeles
- Soporte para scroll horizontal
- Indicador del lenguaje usado

### Indicadores Visuales
- Iconos para usuario/asistente
- Colores diferenciados por rol
- Estado de carga con animación
- Scroll automático a la última respuesta

## 🔐 Variables de Entorno

```bash
# .env.local (desarrollo)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1

# Ejemplo para producción
# NEXT_PUBLIC_API_BASE_URL=https://api.tudominio.com/api/v1
```

## 🧪 Testing

### Lint:
```bash
npm run lint
```

### Build:
```bash
npm run build
```

## 📊 Performance

- Next.js 16 con Turbopack para builds rápidos
- TailwindCSS v4 con just-in-time compilation
- TypeScript para detección de errores en tiempo de compilación
- React 19 con automatic batching

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t ia-gen-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_BASE_URL=http://backend:8000/api/v1 ia-gen-frontend
```

## 📝 Guía de Uso

1. Escribe tu mensaje en el campo de entrada
2. Presiona Enter o haz clic en el botón enviar
3. La IA procesará tu solicitud y transmitirá la respuesta en tiempo real
4. Los bloques de código pueden copiarse al portapapeles
5. El historial se mantiene durante la sesión

## � Repositorios Relacionados

- **Backend**: [ia-gen-backend](https://github.com/luisforni/ia-gen-backend) - API FastAPI
- **Infraestructura**: [ia-gen-infra](https://github.com/luisforni/ia-gen-infra) - Orquestación Docker

## �🐛 Troubleshooting

### El chat no se conecta al backend
- Verifica que `NEXT_PUBLIC_API_BASE_URL` es correcto
- Asegúrate de que el backend está ejecutándose
- Revisa la consola del navegador (F12) para ver errores

### Los mensajes no se muestran
- Abre DevTools (F12) y revisa la consola
- Verifica los logs del servidor en la terminal

### El markdown no se renderiza correctamente
- Asegúrate de que `react-markdown` está instalado
- Revisa que el contenido HTML no tenga caracteres escapados

## 📄 Licencia

Este proyecto está bajo licencia MIT.

## 👥 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto ([GitHub](https://github.com/luisforni/ia-gen-frontend/fork))
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para reportar issues o solicitar features, abre un [issue en GitHub](https://github.com/luisforni/ia-gen-frontend/issues).

## 👤 Autor

**luisforni**
- GitHub: [@luisforni](https://github.com/luisforni)
- Repositorio: [ia-gen-frontend](https://github.com/luisforni/ia-gen-frontend)

## 👤 Autor

**luisforni**
- GitHub: [@luisforni](https://github.com/luisforni)
- Repositorio: [ia-gen-frontend](https://github.com/luisforni/ia-gen-frontend)
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Para reportar issues o solicitar features, abre un issue en el repositorio.
