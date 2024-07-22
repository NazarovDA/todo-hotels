/*
  Warnings:

  - You are about to drop the `number_field_values` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `string_field_values` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `taskId` to the `task_fields` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `task_fields` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `task_fields` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Type" AS ENUM ('string', 'number');

-- DropForeignKey
ALTER TABLE "number_field_values" DROP CONSTRAINT "number_field_values_taskFieldId_fkey";

-- DropForeignKey
ALTER TABLE "number_field_values" DROP CONSTRAINT "number_field_values_taskId_fkey";

-- DropForeignKey
ALTER TABLE "string_field_values" DROP CONSTRAINT "string_field_values_taskFieldId_fkey";

-- DropForeignKey
ALTER TABLE "string_field_values" DROP CONSTRAINT "string_field_values_taskId_fkey";

-- AlterTable
ALTER TABLE "task_fields" ADD COLUMN     "taskId" TEXT NOT NULL,
ADD COLUMN     "type" "Type" NOT NULL,
ADD COLUMN     "value" TEXT NOT NULL;

-- DropTable
DROP TABLE "number_field_values";

-- DropTable
DROP TABLE "string_field_values";

-- AddForeignKey
ALTER TABLE "task_fields" ADD CONSTRAINT "task_fields_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
