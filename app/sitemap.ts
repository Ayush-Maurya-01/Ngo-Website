import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'
 
export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://possiblecentre.com'
 
  // Fetch dynamic events
  const { data: events } = await supabase
    .from('events')
    .select('id, updated_at')
 
  const eventUrls = (events || []).map((event) => ({
    url: `${baseUrl}/events/${event.id}/`,
    lastModified: new Date(event.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Add blog posts if there's a blog table (noting the admin code has blog_posts)
  const { data: blogs } = await supabase
    .from('blog_posts')
    .select('id, created_at')
  
  const blogUrls = (blogs || []).map((blog) => ({
    url: `${baseUrl}/human-rights/${blog.id}/`, // Assuming this is the blog route
    lastModified: new Date(blog.created_at || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))
 
  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/human-rights/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/donate/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/volunteer/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...eventUrls,
    ...blogUrls,
  ]
}
