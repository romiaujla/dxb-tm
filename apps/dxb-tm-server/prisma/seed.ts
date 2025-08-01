import bcrypt from "bcryptjs";
import type { InstanceModel } from "dxb-tm-core";
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
    console.log(`Start seeding ...`);

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
        `Created user '${superUser.firstName}' with id: ${superUser.id}`,
    );

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

    console.log(`Seeding finished.`);
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
