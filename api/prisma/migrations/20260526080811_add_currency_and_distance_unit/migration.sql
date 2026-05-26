-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "dealerName" TEXT NOT NULL DEFAULT 'AUTO',
    "tagline" TEXT NOT NULL DEFAULT 'Drive the Extraordinary',
    "address" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "mondayFridayHours" TEXT NOT NULL DEFAULT '09:00 – 18:30',
    "saturdayHours" TEXT NOT NULL DEFAULT '10:00 – 17:00',
    "sundayHours" TEXT NOT NULL DEFAULT 'By Appointment',
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "distanceUnit" TEXT NOT NULL DEFAULT 'km',
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_settings" ("address", "dealerName", "email", "id", "mondayFridayHours", "phone", "saturdayHours", "sundayHours", "tagline", "updatedAt") SELECT "address", "dealerName", "email", "id", "mondayFridayHours", "phone", "saturdayHours", "sundayHours", "tagline", "updatedAt" FROM "settings";
DROP TABLE "settings";
ALTER TABLE "new_settings" RENAME TO "settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
