import { useLocation, Link as RouterLink } from 'react-router-dom';
import { RootProvider } from 'fumadocs-ui/provider/react-router';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { DocsPage as FumaDocsPage, DocsBody, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const markdownFiles = import.meta.glob('../docs/*.md', { query: '?raw', import: 'default', eager: true });

const DOCS_PAGES = [
  { id: 'getting-started', title: 'Getting Started' },
  { id: 'architecture', title: 'Architecture & Stack' },
  { id: 'api-gateway', title: 'API Gateway' },
  { id: 'sync-engine', title: 'Sync Engine' },
  { id: 'security', title: 'Security' },
  { id: 'development', title: 'Development & Contributing' },
];

const pageTree = {
  name: 'Docs',
  children: DOCS_PAGES.map((page) => ({
    type: 'page' as const,
    name: page.title,
    url: `/docs/${page.id}`,
  })),
};

export function DocsPage() {
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop() || 'getting-started';
  const page = DOCS_PAGES.find((p) => p.id === currentPath) || DOCS_PAGES[0];

  const markdownContent =
    (markdownFiles[`../docs/${page.id}.md`] as string) || '# 404 Not Found\n\nThe requested documentation page could not be found.';

  // Extract title and description from markdown if needed, but we have it in DOCS_PAGES
  const contentWithoutH1 = markdownContent.replace(/^#\s+.*$/m, '');

  return (
    <RootProvider>
      <DocsLayout 
        tree={pageTree}
        nav={{
          title: 'ThiruXDB',
          url: '/',
        }}
      >
        <FumaDocsPage toc={[]}>
          <DocsTitle>{page.title}</DocsTitle>
          <DocsBody>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {contentWithoutH1}
            </ReactMarkdown>
          </DocsBody>
        </FumaDocsPage>
      </DocsLayout>
    </RootProvider>
  );
}
