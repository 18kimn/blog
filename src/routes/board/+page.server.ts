import type {PageServerLoad, Actions} from './$types'
import {prisma} from '$lib/server/prisma'
import {fail} from '@sveltejs/kit'
import {env} from '$env/dynamic/private'
import {oauthProviderInfo} from '../../auth'

export const prerender = false

const MAX_LENGTH = 2000
const MAX_COMMENTS_PER_USER = 50
const MAX_TOTAL_COMMENTS = 5000
const MIN_SECONDS_BETWEEN_POSTS = 15

export const load: PageServerLoad = async ({locals}) => {
  const session = await locals.auth()
  const viewerEmail = session?.user?.email ?? null
  const isOwner = !!viewerEmail && viewerEmail === env.OWNER_EMAIL

  const [viewer, comments] = await Promise.all([
    viewerEmail
      ? prisma.user.findUnique({
          where: {email: viewerEmail},
          select: {showIdentity: true},
        })
      : null,
    prisma.comment.findMany({
      where: isOwner ? undefined : {author: {banned: false}},
      orderBy: {createdAt: 'desc'},
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
            showIdentity: true,
            banned: true,
          },
        },
      },
    }),
  ])

  return {
    session,
    isOwner,
    oauthProviders: oauthProviderInfo,
    maxLength: MAX_LENGTH,
    viewerShowIdentity: viewer?.showIdentity ?? false,
    comments: comments.map((comment) => ({
      id: comment.id,
      body: comment.body,
      createdAt: comment.createdAt,
      authorName: comment.author.showIdentity
        ? (comment.author.name ?? comment.author.email)
        : 'anonymous',
      authorImage: comment.author.showIdentity
        ? comment.author.image
        : null,
      canDelete:
        isOwner ||
        (!!viewerEmail && comment.author.email === viewerEmail),
      owner: isOwner
        ? {
            userId: comment.author.id,
            name: comment.author.name,
            email: comment.author.email,
            banned: comment.author.banned,
            isSelf: comment.author.email === viewerEmail,
          }
        : null,
    })),
  }
}

export const actions: Actions = {
  create: async ({locals, request}) => {
    const session = await locals.auth()
    if (!session?.user?.email)
      return fail(401, {error: 'Sign in to post.'})

    const data = await request.formData()
    const body = (data.get('body') ?? '').toString().trim()
    const showIdentity = data.has('showIdentity')
    if (!body)
      return fail(400, {error: 'Comment cannot be empty.'})
    if (body.length > MAX_LENGTH)
      return fail(400, {
        error: `Keep it under ${MAX_LENGTH} characters.`,
      })

    const author = await prisma.user.findUnique({
      where: {email: session.user.email},
    })
    if (!author)
      return fail(401, {error: 'Account not found.'})
    if (author.banned)
      return fail(403, {error: 'You are banned from posting.'})

    const [latest, userCount, totalCount] =
      await Promise.all([
        prisma.comment.findFirst({
          where: {authorId: author.id},
          orderBy: {createdAt: 'desc'},
          select: {createdAt: true},
        }),
        prisma.comment.count({
          where: {authorId: author.id},
        }),
        prisma.comment.count(),
      ])

    if (
      latest &&
      Date.now() - latest.createdAt.getTime() <
        MIN_SECONDS_BETWEEN_POSTS * 1000
    )
      return fail(429, {
        error:
          "You're posting too fast — give it a moment.",
      })
    if (userCount >= MAX_COMMENTS_PER_USER)
      return fail(403, {
        error: "You've reached your post limit.",
      })
    if (totalCount >= MAX_TOTAL_COMMENTS)
      return fail(403, {
        error: 'The guestbook is full for now.',
      })

    if (author.showIdentity !== showIdentity)
      await prisma.user.update({
        where: {id: author.id},
        data: {showIdentity},
      })

    await prisma.comment.create({
      data: {body, authorId: author.id},
    })
    return {success: true}
  },

  delete: async ({locals, request}) => {
    const session = await locals.auth()
    if (!session?.user?.email)
      return fail(401, {error: 'Sign in first.'})

    const data = await request.formData()
    const id = (data.get('id') ?? '').toString()
    const comment = await prisma.comment.findUnique({
      where: {id},
      include: {author: {select: {email: true}}},
    })
    if (!comment)
      return fail(404, {error: 'Comment not found.'})

    const isOwner = session.user.email === env.OWNER_EMAIL
    const isAuthor =
      comment.author.email === session.user.email
    if (!isOwner && !isAuthor)
      return fail(403, {error: 'Not allowed.'})

    await prisma.comment.delete({where: {id}})
    return {success: true}
  },

  ban: async ({locals, request}) => {
    const session = await locals.auth()
    if (
      !session?.user?.email ||
      session.user.email !== env.OWNER_EMAIL
    )
      return fail(403, {error: 'Not allowed.'})

    const data = await request.formData()
    const userId = (data.get('userId') ?? '').toString()
    const banned = data.get('banned') === 'true'
    if (!userId) return fail(400, {error: 'Missing user.'})

    await prisma.user.updateMany({
      where: {id: userId, email: {not: env.OWNER_EMAIL}},
      data: {banned},
    })
    return {success: true}
  },
}
