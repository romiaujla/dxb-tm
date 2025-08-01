-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" INTEGER NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedById" INTEGER,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_role" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" INTEGER NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedById" INTEGER,
    "fkRoleId" INTEGER NOT NULL,
    "fkUserId" INTEGER NOT NULL,

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" INTEGER NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedById" INTEGER,
    "action" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permission" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" INTEGER NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedById" INTEGER,
    "fkRoleId" INTEGER NOT NULL,
    "fkPermissionId" INTEGER NOT NULL,

    CONSTRAINT "role_permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_role_permission" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" INTEGER NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedById" INTEGER,
    "fkUserId" INTEGER NOT NULL,
    "fkRolePermissionId" INTEGER NOT NULL,

    CONSTRAINT "user_role_permission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "permission_action_key" ON "permission"("action");

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_fkRoleId_fkey" FOREIGN KEY ("fkRoleId") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_fkUserId_fkey" FOREIGN KEY ("fkUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_fkRoleId_fkey" FOREIGN KEY ("fkRoleId") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_fkPermissionId_fkey" FOREIGN KEY ("fkPermissionId") REFERENCES "permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role_permission" ADD CONSTRAINT "user_role_permission_fkUserId_fkey" FOREIGN KEY ("fkUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role_permission" ADD CONSTRAINT "user_role_permission_fkRolePermissionId_fkey" FOREIGN KEY ("fkRolePermissionId") REFERENCES "role_permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
