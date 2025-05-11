/*
  Warnings:

  - Added the required column `tweetNo` to the `Response` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Response" ADD COLUMN     "tweetNo" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_tweetNo_fkey" FOREIGN KEY ("tweetNo") REFERENCES "Tweet"("tweet_no") ON DELETE CASCADE ON UPDATE CASCADE;
