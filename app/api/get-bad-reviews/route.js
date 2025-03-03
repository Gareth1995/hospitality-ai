import { ApiHandler } from "@/utils/apiTemplate";

const redisCacheKey = "bad_reviews";

const sqlCommand = `SELECT positive_review, negative_review, review_rating, reviewer_name, sentiment
                    FROM reviews
                    WHERE hotel_id = $1
                    AND sentiment IN ('anger', 'fear', 'disgust', 'sadness')
                    AND (review_feedback IS NULL OR review_feedback = '')`;

export const GET = ApiHandler(redisCacheKey, sqlCommand);