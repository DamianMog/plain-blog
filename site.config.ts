/**
 * Everything you are likely to change lives in this file.
 * Pages (About, Expertise, ...) are plain Markdown files in src/content/pages,
 * blog posts are Markdown files in src/content/blog.
 */
export const site = {
  title: 'Alex Morgan',
  tagline: 'Software, Notebooks, Coffee, Long Walks',
  description:
    'Personal site and blog of Alex Morgan, a freelance software engineer and lifelong learner. This is a demo of the plain-blog template.',
  author: 'Alex Morgan',
  language: 'en',

  // Used to format dates, for example 'en-US', 'en-GB' or 'pl-PL'.
  // The interface text itself (labels such as "Reading time") is English and
  // lives in the components under src/components and src/pages.
  locale: 'en-US',

  // Dates are shown in this IANA time zone, for example 'Europe/Warsaw'.
  timeZone: 'UTC',

  // Top navigation. `href` is relative to the site root.
  nav: [
    { label: 'About', href: '/about/' },
    { label: 'Expertise', href: '/expertise/' },
    { label: 'Experience', href: '/experience/' },
    { label: 'Blog', href: '/blog/' },
    { label: 'Contact', href: '/contact/' },
  ],

  // Shown on the home page and in the footer.
  social: [
    { label: 'Email', href: 'mailto:hello@example.com' },
    { label: 'GitHub', href: 'https://github.com/your-username' },
    { label: 'Mastodon', href: 'https://mastodon.example/@your-username' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/your-username/' },
  ],

  home: {
    // Number of recent posts listed under the intro. Set to 0 to hide the list.
    latestPosts: 4,
  },

  footer: {
    note: 'Built the way the web was meant to be: simple, content-first, no trackers, no ads and no JavaScript required.',
    license: 'Released under the MIT license',
  },

  // Average adult reading speed used for the "Reading time" label.
  wordsPerMinute: 200,
};

export type SiteConfig = typeof site;
