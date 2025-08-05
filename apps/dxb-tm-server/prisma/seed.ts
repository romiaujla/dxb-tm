import bcrypt from "bcryptjs";
import type { InstanceModel, RoleModel } from "dxb-tm-core";
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
    console.log(`🌱 Start seeding...`);

    const hashedPassword = await bcrypt.hash(
        process.env.SUPER_ADMIN_PASSWORD as string,
        10,
    );

    const superUser = await prisma.user.create({
        data: {
            firstName: "Raman",
            middleName: "Singh",
            lastName: "Aujla",
            email: "r.aujla9091@gmail.com",
            password: hashedPassword,
            createdById: 0,
            updatedById: 0,
        },
    });

    console.log(
        `🌱 Created user '${superUser.firstName}' with id: ${superUser.id}`,
    );

    console.log('🌱 Creating Instances...');

    const instanceList: Array<CreateInstanceModel> = [
        {
            active: true,
            alias: "aujla_star_tpt",
            createdById: superUser.id,
            updatedById: superUser.id,
            description: `Aujla Star Transport's: Transport Management System`,
            name: "Aujla Star Transport",
        },
        {
            active: true,
            alias: "hamriyah_tpt",
            createdById: superUser.id,
            updatedById: superUser.id,
            description: `Hamriyah Transport's: Transport Management System`,
            name: "Hamriyah Transport",
        },
    ];

    for (const instance of instanceList) {
        const createdInstance = await prisma.instance.create({
            data: {
                ...instance,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        });

        console.log(
            `Created instance '${createdInstance.name}' with id: ${createdInstance.id}`,
        );
    }

    console.log('🌱 Creating Roles...');

    const roleList: Array<CreateRoleModel> = [
        {
            name: "Super Admin",
            description: "Has full access to the system, can access any instance",
        },
        {
            name: "Admin",
            description: "Can manage instances and users",
        },
        {
            name: "Dispatcher",
            description: "Can access the system with dispatcher-specific permissions",
        },
        {
            name: "Driver",
            description: "Can access the system with driver-specific permissions",
        },
        {
            name: "Accountant",
            description: "Can access the system with accountant-specific permissions",
        },
    ];
    let superAdminRoleId: RoleModel["id"] | null = null;
    let adminRoleId: RoleModel["id"] | null = null;

    for (const role of roleList) {
        const createdRole = await prisma.role.create({
            data: {
                ...role,
                createdById: superUser.id,
                updatedById: superUser.id,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        });

        if (createdRole.name === "Super Admin") {
            superAdminRoleId = createdRole.id;
        }

        if (createdRole.name === "Admin") {
            adminRoleId = createdRole.id;
        }

        console.log(`Created role '${createdRole.name}' with id: ${createdRole.id}`);
    }

    if (superAdminRoleId != null) {
        console.log('🌱 Assigning Super Admin role to Super User...');

        await prisma.userRole.create({
            data: {
                fkUserId: superUser.id,
                fkRoleId: superAdminRoleId,
                createdById: superUser.id,
                updatedById: superUser.id,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        });

        console.log(`🌱 Assigned Super Admin role to user '${superUser.firstName}'`);
    } else {
        console.error("🛑 Error: Super Admin role not found, Super User was unable to be assigned the Super Admin role.");
    }

    if (adminRoleId != null) {
        console.log('🌱 Assigning Admin role to Super User...');

        await prisma.userRole.create({
            data: {
                fkUserId: superUser.id,
                fkRoleId: adminRoleId,
                createdById: superUser.id,
                updatedById: superUser.id,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        });

        console.log(`🌱 Assigned Admin role to user '${superUser.firstName}'`);
    } else {
        console.error("🛑 Error: Admin role not found, Super User was unable to be assigned the Admin role.");
    }

    console.log(`🌱 Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

type CreateInstanceModel = Pick<
    InstanceModel,
    "active" | "alias" | "createdById" | "updatedById" | "description" | "name"
>;

type CreateRoleModel = Pick<RoleModel, "name" | "description">;