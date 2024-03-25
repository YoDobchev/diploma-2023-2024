import { db } from "../init/db"
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

export async function deletePost(postId: string, sessionUsername: string): Promise<void> {
    const transaction = await db.transaction();
    try {
      const post = await Posts.findOne({ where: { id: postId, created_by: sessionUsername }, transaction });
      if (!post) {
        throw new Error('Post not found or unauthorized');
      }
  
      await deleteRepliesAndImages(postId, transaction);
  
      const images = await Images.findAll({ where: { post_id: postId }, transaction });
      const imagePaths = images.map(img => img.path);
      await Images.destroy({ where: { post_id: postId }, transaction });
  
      await Posts.destroy({ where: { id: postId }, transaction });
  
      await transaction.commit();
  
      imagePaths.forEach(async path => await fs.promises.unlink(path));
  
    } catch (error) {
      await transaction.rollback();
      console.error('Failed to delete post and associated data:', error);
      throw error;
    }
  }
  
async function deleteRepliesAndImages(parentId: string, transaction: any): Promise<void> {
    const replies = await Posts.findAll({ where: { reply_to_id: parentId }, transaction });
    for (const reply of replies) {
      const images = await Images.findAll({ where: { post_id: reply.id }, transaction });
      const imagePaths = images.map(img => img.path);
      await Images.destroy({ where: { post_id: reply.id }, transaction });
  
      await deleteRepliesAndImages(reply.id, transaction);
  
      await Posts.destroy({ where: { id: reply.id }, transaction });
  
      imagePaths.forEach(async path => await fs.promises.unlink(path)); // Ensure this function handles FS deletion
    }
  }
  

function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}