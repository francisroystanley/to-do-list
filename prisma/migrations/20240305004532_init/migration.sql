-- CreateTable
CREATE TABLE "Todo" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_completed" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);
