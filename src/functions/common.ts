import { db } from "../init/db"
import Threads from "../models/Threads.model"
import Posts from "../models/Posts.model"
import Images from "../models/Images.model";

export function createPost(thread_id: string, text: string, created_by?: string, reply_to_id?: string, imagePath?: string): Promise<Posts> {
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
                id: generateId(),
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

function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}