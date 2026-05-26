-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_inquiries" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT NOT NULL,
    "vehicle" TEXT,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "pipelineStage" TEXT,
    "assignedToId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "inquiries_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_inquiries" ("createdAt", "email", "id", "message", "name", "phone", "pipelineStage", "status", "subject", "updatedAt", "vehicle") SELECT "createdAt", "email", "id", "message", "name", "phone", "pipelineStage", "status", "subject", "updatedAt", "vehicle" FROM "inquiries";
DROP TABLE "inquiries";
ALTER TABLE "new_inquiries" RENAME TO "inquiries";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
