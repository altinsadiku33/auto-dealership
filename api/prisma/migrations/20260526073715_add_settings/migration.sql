-- CreateTable
CREATE TABLE "settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "dealerName" TEXT NOT NULL DEFAULT 'AUTO',
    "tagline" TEXT NOT NULL DEFAULT 'Drive the Extraordinary',
    "address" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "mondayFridayHours" TEXT NOT NULL DEFAULT '09:00 – 18:30',
    "saturdayHours" TEXT NOT NULL DEFAULT '10:00 – 17:00',
    "sundayHours" TEXT NOT NULL DEFAULT 'By Appointment',
    "updatedAt" DATETIME NOT NULL
);
