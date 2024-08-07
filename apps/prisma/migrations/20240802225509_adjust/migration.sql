/*
  Warnings:

  - You are about to drop the `TaskFieldValue` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "TaskFieldValue";

-- CreateTable
CREATE TABLE "task_field_value" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "task_field_value_pkey" PRIMARY KEY ("id")
);
