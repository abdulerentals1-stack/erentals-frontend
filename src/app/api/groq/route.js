// /app/api/groq/route.js
export async function POST(req) {
  const { field1, field2, includeCSS } = await req.json();

  const prompt = `
You are a professional content writer and frontend developer for an eCommerce rental platform.

Your task:
Generate high-quality, market-aligned content for:
- Content Type: "${field1}"
- Product: ${field2}

Guidelines:
- Research and align with content style of Amazon, Flipkart, Pepperfry, and other top rental/e-commerce websites.
- Content should be natural, engaging, and feel 100% human-written — no robotic or repetitive AI language.
- Make sure the tone sounds genuine and useful to real customers renting the product.
- Avoid generic filler content. Include realistic specs, scenarios, and benefits that make sense for Indian rental users.

${includeCSS ? `
Output format:
- Use semantic HTML: <div>, <h2>, <ul>, <p>, <table>, etc.
- Add Tailwind CSS classes inline.
- Structure should be responsive and mobile-first.
- Follow layout similar to Amazon/Flipkart product pages.
- Return only HTML content (no extra explanation or note).
` : `
Output format:
- Return clean text content (no HTML or styling).
- Use real-world language with headings and bullet points where needed.
- Keep it ready to show directly on product detail pages.
`}

Ensure the content sounds like a skilled human wrote it after doing proper research — not like it was AI-generated.
Use best practices for SEO, rental industry language, and customer clarity.
`;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: "You are an expert eCommerce content writer and frontend UI expert for rental platforms.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "AI API Error", detail: error.message }, { status: 500 });
  }
}
