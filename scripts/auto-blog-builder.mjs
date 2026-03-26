import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize APIs
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!GEMINI_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing required environment variables.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TOPICS = [
  "Women Empowerment in Rural India",
  "Child Education Rights and Awareness",
  "Free Legal Aid Services for the Underprivileged",
  "Environmental Protection & Climate Change Impacts",
  "Understanding Fundamental Human Rights",
  "The Importance of Community Health Camps",
  "Tribal Rights and Protection in India",
  "Right to Information Act: Empowering Citizens",
  "Eradicating Child Labour through Education",
  "Mental Health Awareness in Marginalized Communities"
];

async function generateBlog() {
  console.log("🤖 Starting Autonomous AI Blog Generation...");
  
  // 1. Pick a random topic to base the article on
  const randomTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
  console.log(`📌 Selected Theme: ${randomTopic}`);

  // 2. Generate Content using Gemini
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = `
    You are an expert human rights activist and SEO blog writer for PCHR&R (Possible Centre for Human Rights & Responsibilities), a top NGO in India.
    
    Write a highly engaging, professional, and SEO-optimized blog post about: "${randomTopic}". 
    The tone should be inspiring, informative, and perfectly suited for an NGO's audience.
    
    Format the output EXACTLY as a raw JSON object string (do NOT use markdown code blocks like \`\`\`json, just output the raw JSON directly) with these exact keys:
    {
      "title": "A catchy, SEO-friendly title under 65 characters",
      "category": "One of: Human Rights, Education, Health, Social Awareness",
      "read_time": "Estimated read time (e.g., '4 min read')",
      "content": "The full article content formatted in valid HTML. Use <h2>, <p>, <ul>, <li>, and <strong> tags. Write at least 400 words. Keep it professional and inspiring."
    }
  `;

  console.log("✍️ AI is writing the article...");
  let result;
  try {
    result = await model.generateContent(prompt);
  } catch(err) {
    console.error("❌ Failed to contact Gemini API", err);
    process.exit(1);
  }

  let responseText = result.response.text();
  responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
  
  let blogData;
  try {
    blogData = JSON.parse(responseText);
  } catch (e) {
    console.error("❌ Failed to parse AI response as JSON:", responseText);
    process.exit(1);
  }

  // 3. Generate Image URL (Free AI Image via Pollinations)
  console.log("🎨 Generating dynamic cover image...");
  // Strip out any complex characters for the image generation prompt
  const safeImagePrompt = blogData.title.replace(/[^a-zA-Z0-9 ]/g, " ");
  const imagePrompt = `high quality photorealistic image, no text in image, ${safeImagePrompt}, NGO humanitarian context, cinematic lighting`;
  const seed = Math.floor(Math.random() * 1000000); 
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=1200&height=630&nologo=true&seed=${seed}`;

  // 4. Insert into Supabase
  console.log("💾 Saving article to the database...");
  const newPost = {
    id: crypto.randomUUID(),
    title: blogData.title,
    content: blogData.content,
    category: blogData.category,
    read_time: blogData.read_time,
    image_url: imageUrl,
    author: "PCHR&R AI Editorial",
    created_at: new Date().toISOString()
  };

  const { error } = await supabase.from('blog_posts').insert([newPost]);
  
  if (error) {
    console.error("❌ Supabase Database Error:", error.message);
    process.exit(1);
  }

  console.log("✅ Success! Blog post published live.");
  console.log(`📑 Title: ${blogData.title}`);
  console.log(`📁 Category: ${blogData.category}`);
  console.log(`🖼️ Image: ${imageUrl}`);
}

generateBlog().catch(err => {
  console.error("❌ Fatal Error:", err);
  process.exit(1);
});
