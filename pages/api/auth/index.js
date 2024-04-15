import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    if(req.method === 'POST') {
        const data = await prisma.user.findUnique({
            where: {
                phoneNumber: req.body.phoneNumber,
            },
        });

        return res.status(201).json({
            statusCode: 201,
            status: 'success',
            data: data,
            message:
                'Data başarıyla çekildi.',
        });
    }
}
