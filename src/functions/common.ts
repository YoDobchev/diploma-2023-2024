import { db } from "../init/db"
import { Transaction } from "sequelize";
import fs from 'fs';
import Threads from "../models/Threads.model"
import Posts from "../models/Posts.model"
import Images from "../models/Images.model";

export function createPost(thread_id: string, text: string, created_by?: string, reply_to_id?: string, imageId?: string, imagePath?: string): Promise<Posts> {
    return db.transaction(async (transaction) => {
        const postData: Partial<Posts> = {
            id: generateId(),
            thread_id,
            text,
            created_by,
            reply_to_id,
        };

        const newPost = await Posts.create(postData as Posts, { transaction });

        if (imagePath) {
            const imageData: Partial<Images> = {
                id: imageId,
                post_id: newPost.id,
                path: imagePath,
                filters: [],
            };

            await Images.create(imageData as Images, { transaction });
        }

        return newPost;
    });
}

export function findPostsByThreadId(thread_id: string): Promise<Posts[]> {
    return Posts.findAll({
        where: { thread_id },
        include: [Images]
    });
}

export async function deletePost(postId: string, sessionUsername?: string, transaction?: Transaction): Promise<void> {
  try {
      let whereClause: Record<string, any> = { id: postId };
      if (sessionUsername && sessionUsername !== 'admin') {
          whereClause['created_by'] = sessionUsername;
      }

      const post = await Posts.findOne({ where: whereClause, transaction });
      if (!post) {
          throw new Error('Post not found or unauthorized');
      }

      await deleteRepliesAndImages(postId, transaction);

      const images = await Images.findAll({ where: { post_id: postId }, transaction });
      const imagePaths = images.map(img => img.path);
      await Images.destroy({ where: { post_id: postId }, transaction });

      await Posts.destroy({ where: { id: postId }, transaction });

      for (const path of imagePaths) {
          await fs.promises.unlink(path);
      }

  } catch (error) {
      console.error('Failed to delete post and associated data:', error);
      throw error;
  }
}

async function deleteRepliesAndImages(parentId: string, transaction?: Transaction): Promise<void> {
  const replies = await Posts.findAll({ where: { reply_to_id: parentId }, transaction });
  for (const reply of replies) {
      const images = await Images.findAll({ where: { post_id: reply.id }, transaction });
      const imagePaths = images.map(img => img.path);
      await Images.destroy({ where: { post_id: reply.id }, transaction });

      await deleteRepliesAndImages(reply.id, transaction);

      await Posts.destroy({ where: { id: reply.id }, transaction });

      for (const path of imagePaths) {
          await fs.promises.unlink(path);
      }
  }
}

export function findThreads(board_id: string): Promise<Threads[]> {  
  return Threads.findAll({
    where: { board_id },
    include: [{
      model: Posts,
      attributes: []
    }],
    attributes: {
      include: [
        [
          db.literal(`(SELECT COUNT(*) FROM "Posts" WHERE "Posts"."thread_id" = "Threads"."id")`),
          'postsCount'
        ]
      ]
    },
    group: ['Threads.id']
  });
}

export async function deleteThread(threadId: string): Promise<void> {
    const transaction = await db.transaction();
    try {
        const posts = await Posts.findAll({
          // @ts-ignore
            where: { thread_id: threadId, reply_to_id: null },
            transaction
        });

        for (const post of posts) {
            await deletePost(post.id, undefined, transaction);
        }

        await Threads.destroy({
            where: { id: threadId },
            transaction
        });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.error('Failed to delete thread and associated posts:', error);
        throw error;
    }
}

export const setupTimers = async (): Promise<void> => {
  try {
    const rows = await Threads.findAll();
    
    const now = new Date().getTime();

    rows.forEach(row => {

      const creationDate = new Date(row.createdat).getTime();
      const duration = 24 * 60 * 60 * 1000;
      const timeSinceCreation = now - creationDate;
      const timeUntilAction = duration - timeSinceCreation;
      console.log(timeUntilAction)
      if (timeUntilAction > 0) {
        setTimeout(() => deleteThread(row.id), timeUntilAction);
      }

      else {
        deleteThread(row.id);
      }
    });
  } catch (error) {
    console.error('Error setting up timers:', error);
  }
};


function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}