import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Community Engine — Sprint 15 PHASE 4 (3pts)
 * Discussion forums beta + knowledge base + comments
 */

async function communityEngine(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { action, post, comment, articleId } = body;

    if (action === 'create_post') {
      return Response.json({
        success: true,
        post: {
          id: `post_${Date.now()}`,
          title: post?.title || 'Untitled',
          content: post?.content || '',
          category: post?.category || 'general',
          author: { id: user.id, email: user.email, name: user.full_name },
          tags: post?.tags || [],
          votes: 0,
          commentsCount: 0,
          views: 0,
          createdAt: new Date().toISOString(),
          status: 'published'
        }
      });
    }

    if (action === 'add_comment') {
      return Response.json({
        success: true,
        comment: {
          id: `cmt_${Date.now()}`,
          postId: articleId,
          content: comment?.content || '',
          author: { id: user.id, email: user.email, name: user.full_name },
          votes: 0,
          createdAt: new Date().toISOString()
        }
      });
    }

    if (action === 'search_knowledge_base') {
      return Response.json({
        success: true,
        results: [],
        query: body.query || '',
        totalFound: 0,
        searchedAt: new Date().toISOString()
      });
    }

    return Response.json({
      success: true,
      features: {
        forums: { enabled: true, categories: ['geral', 'duvidas', 'sugestoes', 'bugs'] },
        knowledgeBase: { enabled: true, sections: ['onboarding', 'api', 'integrações', 'faq'] },
        comments: { enabled: true, maxDepth: 3, moderation: 'auto' }
      },
      usage: 'Pass action: create_post | add_comment | search_knowledge_base'
    });

  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

Deno.serve(async (req) => {
  try {
    return await communityEngine(req);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
});

export { communityEngine };