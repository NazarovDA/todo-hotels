-- DropForeignKey
ALTER TABLE "task_fields" DROP CONSTRAINT "task_fields_taskId_fkey";

-- CreateTable
CREATE TABLE "TaskFieldValue" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "TaskFieldValue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "task_fields" ADD CONSTRAINT "task_fields_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
